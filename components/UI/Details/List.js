import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  keepPreviousData,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { useLocalSearchParams } from 'expo-router';

import DraggableFlatList, { ScaleDecorator, } from "react-native-draggable-flatlist";
import { BaseButton } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";

import { DetailStyles } from './styles';

import TalkButton from '../Talk/Button';
import colors from '../colors';
import DebouncedInput from '../DebouncedInput';
import Icon from '../icons';
import styles from '../styles';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import { queryClient } from '../../../contexts/query-client';
import Fetch from '../../../interfaces/fetch';
import ViewHead, { HeaderButton } from '../View/Header';

import { colorway } from '../type';

const ListParamsContext = createContext({});

const initialFilters = { completed: null, search: '' };
const textColor = colors.darkText;

function ListParamsProvider(props) {
  const [listParams, setListParams] = useState(initialFilters);

  return (
    <ListParamsContext.Provider value={{ listParams, setListParams }}>
      {props.children}
    </ListParamsContext.Provider>
  )
}

const EmptyListState = ({ context }) => {
  const queryData = queryClient.getQueryData(context);

  if (!queryData || !queryData.params) {
    return (
      <View style={{ ...styles.row, color: colors.white }}>
        <Bold style={{ color: colors.darkText }}>LOADING</Bold>
      </View>
    );
  }

  const completedMap = {
    false: "No 'Uncompleted' Items",
    true: '0 Completed Items',
  }

  return (
    <View style={{ padding: 16, flex: 1, alignItems: 'center' }}>
      {!queryData.list_items.length ? (
        <View style={{ ...styles.row }}>
          <Bold style={{ color: colors.darkText }}>Add your first list item</Bold>
        </View>
      ) : (
        <View style={{ ...styles.row }}>
          {queryData.params.search.trim().length ?
            (
              <>
                <Light style={{ marginRight: 2 }}>No list items containing</Light>
                <Bold>"{queryData.params.search}"</Bold>
              </>
            ) : (
              <>
                <Light>{completedMap[queryData.params.completed]}</Light>
              </>
            )
          }
        </View>
      )}
    </View>
  )
};

const DraggableList = ({ context }) => {
  const itemsContext = [...context, 'items'];
  const [items, setItems] = useState([]);
  const { listParams } = useContext(ListParamsContext);

  const initialData = {
    count: null,
    next: null,
    params: {
      page: 1,
      per: 100,
      search: '',
      sortDirection: 'desc',
      sortProperty: 'order',
      completed: null,
    },
    list_items: []
  };

  const DataQuery = useQuery({
    initialData,
    keepPreviousData: true,
    placeholderData: keepPreviousData,
    queryFn: async () => await Fetch.get(context),
    queryKey: context,
  });


  useEffect(() => {
    if (DataQuery.data && DataQuery.data.list_items) {
      const newItems = filterItems(DataQuery.data.list_items, listParams);
      setItems(newItems);
    }

  }, [DataQuery.data, listParams]);


  function filterItems(list, filter) {
    return list.filter(i => {
      if (filter.completed === null) { return true; }
      return i.completed === filter.completed;
    });
  }

  function onReorder({ data }) {
    const newItems = filterItems(data, listParams);
    setItems(newItems);
    const dataIds = data.map(d => d.id);
    const queryData = queryClient.getQueryData(context);
    const queryDataIds = queryData.list_items.map(d => d.id);
    const areEqual = JSON.stringify(dataIds) === JSON.stringify(queryDataIds);

    if (!areEqual) {
      const reordered = data.reduce((acc, cur, index) => {
        cur.order = index;
        acc.items.push(cur);
        acc.ids.push(cur.id);
        return acc;
      }, { items: [], ids: [] });

      reorderMutation.mutate({ order: reordered.ids });
    }
  }

  const reorderMutation = useMutation({
    mutationFn: async (order) => await Fetch.put(itemsContext, order),
    onSuccess: (data) => {
      const newItems = filterItems(reorderMutation.data.list_items, listParams);
      setItems(newItems);
    }
  });

  const removeListItemMutation = useMutation({
    mutationFn: async ({ id }) => {
      try {
        return await Fetch.remove([...itemsContext, id]);
      } catch (error) {
        console.warn('Delete List Item Error:', error);
      }
    },
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries([context[0]]);
      }
    }
  })

  const updateListItemMutation = useMutation({
    mutationFn: async (data) => {
      const { id, ...rest } = data;
      try {
        const response = await Fetch.put([...itemsContext, id], rest);
        return response;
      } catch (error) {
        console.warn('Update List Item Error', error);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([context[0]]);
    },
  });

  const ListItem = useCallback((props) => {
    const { drag, getIndex, isActive, item } = props;

    const number = getIndex() + 1;

    const marginBottom = number === items.length ? 56 : 0;

    const styled = StyleSheet.create({
      container: {
        flexDirection: 'row',
        marginHorizontal: 0,
        flex: 1,
        marginRight: 4,
        marginBottom
      },
      checkbox: {
        ...styles.centered,
        height: 40,
        paddingRight: 4,
        position: 'absolute'
      },
      icon: {
        color: textColor,
        size: 16,
        left: 1,
      },
      body: {
        flex: 1,
        paddingLeft: 12,
        backgroundColor: 'transparent',
      },
      indexContainer: {
        ...styles.centered,
        // marginLeft: 16,
        height: 20,
        width: 20,
        borderWidth: item.completed ? 1 : 2,
        borderRadius: 4,
        borderColor: item.completed ? colors.lightText : colors.darkText,

      },
      index: {
        fontSize: 10,
      },
      input: {
        backgroundColor: 'transparent',
        color: textColor,
        fontFamily: item.completed ? 'Inter-Light' : 'Inter-Regular',
        fontSize: 16,
        lineHeight: 20,
        height: '100%',
        paddingRight: 0,
        position: 'relative',
        top: -5,
      },
      text: {
        color: colors.lightWhite,
        position: 'relative',
        top: 3
      }
    });

    const RenderRightActions = () => {
      const { percentOpen } = useSwipeableItemParams();
      const animStyle = useAnimatedStyle(
        () => ({
          opacity: percentOpen.value,
        }),
        [percentOpen]
      );

      const rightActionStyled = StyleSheet.create({
        base: { alignItems: 'flex-end', justifyContent: 'center', height: 44 },
        view: {
          justifyContent: 'center',
          alignItems: 'center',
          width: 60,
          flex: 1,
          ...animStyle,
        },
        icon: { backgroundColor: colors.remove, transform: [{ translateX: -16 }] }
      })

      return (
        <BaseButton style={rightActionStyled.base} onPress={() => { removeListItemMutation.mutate(item) }}>
          <Animated.View style={rightActionStyled.view}>
            <Icon name='trash' styles={rightActionStyled.icon} />
          </Animated.View>
        </BaseButton>
      );
    };



    return (
      <ScaleDecorator>
        <SwipeableItem
          key={item.id}
          item={item}
          renderUnderlayLeft={() => <RenderRightActions drag={drag} />}
          snapPointsLeft={[48]}
          overSwipe={20}
        >
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}
            style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}
          >
            <View style={styled.indexContainer}>
              {!item.completed &&
                <Regular style={styled.index}>{number}</Regular>
              }
              <Pressable style={styled.checkbox} onPress={() => updateListItemMutation.mutate({ id: item.id, completed: !item.completed })}>
                {item.completed &&
                  <Icon name='check' styles={styled.icon} />
                }
                {/* <Icon name={checkboxIcon} styles={styled.icon} />                 */}
              </Pressable>
            </View>
            <View style={styled.container}>
              <View style={styled.body}>
                <DebouncedInput
                  editable={!item.completed}
                  multiline={true}
                  placeholder='(text)'
                  style={styled.input}
                  update={(value) => { updateListItemMutation.mutate({ id: item.id, body: value }) }}
                  value={item.body}
                />
              </View>
            </View>
          </TouchableOpacity>
        </SwipeableItem>
      </ScaleDecorator>
    )
  });


  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        activationDistance={20}
        data={items}
        initialNumToRender={20}
        keyExtractor={item => item.id}
        ListEmptyComponent={<EmptyListState context={context} />}
        // ListHeaderComponent={() => <ViewHead />}
        onDragEnd={onReorder}
        renderItem={ListItem}
        refreshing={true}
      />
    </View>
  );
};

const AddListItem = ({ submit }) => {
  const style = {
    icon: { color: colorway('lists') },
    text: { color: colorway('lists') }
  };

  function onPress() {
    const title = 'New List Item';
    Alert.prompt(
      title,
      null,
      submit,
      'plain-text'
    )
  }

  return (
    <HeaderButton
      onPress={onPress}
      style={style}
      text='Add New'
    />
  )
}

export default function List() {
  const local = useLocalSearchParams();
  const context = ['lists', local.slug];

  const styled = StyleSheet.create({
    view: {
      ...DetailStyles.view,
      backgroundColor: colors.theme.inputs.light.backgroundColor,
      flex: 1
    },
    flex1: { flex: 1 },
    content: {
      ...DetailStyles.content
    },
    header: {
      ...DetailStyles.header,
    },
    menu: {
      ...DetailStyles.menu
    },
  });

  const createListItemMutation = useMutation({
    mutationFn: async (text) => {
      if (!text.trim().length) {
        return;
      }
      const data = { body: text.trim() };

      try {
        return await Fetch.post(context, data)
      } catch (error) {
        console.warn('Create List Item Error:', error);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(context, old => {
        const oldCopy = JSON.parse(JSON.stringify(old));
        const list_items = oldCopy.list_items;
        list_items.push(data.list_items);
        return { ...oldCopy, list_items };
      });
    }
  });

  return (
    <ListParamsProvider>
      <View style={styled.view}>
        <ViewHead>
          <AddListItem
            submit={createListItemMutation.mutate}
          />
        </ViewHead>
        <DraggableList context={context} />
        {/* <View
          style={styled.view}
        >
          <View style={styled.content}>
            <View style={styled.flex1}>
            </View>
          </View> */}

        {/* <View style={styles.footer}>
            <TalkButton context={context} />
          </View> */}
        {/* </View> */}
      </View>
    </ListParamsProvider >
  );
}