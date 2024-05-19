import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
 } from 'react';
import {
  Dimensions,
  Pressable, 
  StyleSheet, 
  TouchableOpacity,
  View,
} from 'react-native';

import {
  keepPreviousData,
  useMutation,  
  useQuery,
} from '@tanstack/react-query';

import Exit from './Exit';
import Title from './Title';

import Menu from './Menu';

import DraggableFlatList, { ScaleDecorator, } from "react-native-draggable-flatlist";
import { BaseButton } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";

import Input from './Input';
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

const ListParamsContext = createContext({});

const initialFilters = { completed: null, search: ''};
const textColor = colors.darkText;


function ListParamsProvider(props) {
  const [listParams, setListParams] = useState(initialFilters);

  return (
    <ListParamsContext.Provider value={{listParams, setListParams}}>
      { props.children}
    </ListParamsContext.Provider>
  )
}
const EmptyListState = () => {
  const { context } = queryClient.getQueryData(['details']);
  const queryData = queryClient.getQueryData(context);

  if (!queryData || !queryData.params) {
    return (
      <View style={{...styles.row, color: colors.white}}>            
          <Bold style={{color: colors.darkText}}>LOADING</Bold>
      </View>
    );
  }

  const completedMap = {
    false: "No 'Uncompleted' Items",
    true: '0 Completed Items',
  }

  return (
    <View style={{ padding: 16, flex: 1, alignItems: 'center' }}>        
      { !queryData.results.length ? (          
        <View style={{...styles.row}}>            
          <Bold style={{color: colors.darkText}}>Add your first list item</Bold>
        </View>
      ) : (
        <View style={{...styles.row}}>
          { queryData.params.search.trim().length ?
            (
              <>
                <Light style={{marginRight: 2}}>No list items containing</Light>
                <Bold>"{queryData.params.search}"</Bold>
              </>
            ) : (
              <>
                <Light>{completedMap[queryData.params.completed]}</Light>
              </>
            )
          }
        </View>
      ) }
    </View>
  )
}

const ListList = ({context}) => {   
  const baseUri = `lists/${context[1]}/`;
  const itemsUri = `${baseUri}items/`;
  const itemUri = (itemId) => `${baseUri}item/${itemId}/`;
  const [items, setItems] = useState([]);
  const {listParams} = useContext(ListParamsContext);

  const DataQuery = useQuery({
    enabled: false,    
    keepPreviousData: true,
    placeholderData: keepPreviousData,
    queryFn: async () => await Fetch.get(baseUri),    
    queryKey: context, 
  });
  
  useEffect(() => {
    if (DataQuery.data.results) {      
      const newItems = filterItems(DataQuery.data.results, listParams);          
      setItems(newItems);
    }

  }, [DataQuery.data, listParams]);


  function filterItems(list, filter) {
    return list.filter(i => {
      if (filter.completed === null) { return true; }
      return i.completed === filter.completed;
    });
  }

  function onReorder({data}) {
    const newItems = filterItems(data, listParams);          
    setItems(newItems);    
    const dataIds = data.map(d => d.id);
    const queryData = queryClient.getQueryData(context);
    const queryDataIds = queryData.results.map(d => d.id);
    const areEqual = JSON.stringify(dataIds) === JSON.stringify(queryDataIds);

    if (!areEqual) {
      const reordered = data.reduce((acc, cur, index) => {
        cur.order = index;
        acc.items.push(cur);
        acc.ids.push(cur.id);
        return acc;
      }, { items: [], ids: []});

      reorderMutation.mutate({order: reordered.ids});
    }
  }

  const reorderMutation = useMutation({
    mutationFn: async (order) => await Fetch.put(itemsUri, order),
    onSuccess: (data) => {      
      const newItems = filterItems(reorderMutation.data.results, listParams);          
      setItems(newItems);
    }
  });

  const removeListItemMutation = useMutation({
    mutationFn: async ({ id }) => {
      try {
        return await Fetch.remove(itemUri(id));
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
        const response = await Fetch.put(itemUri(id), rest);
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
    const {drag, getIndex, isActive, item} = props;     
    
    const styled = StyleSheet.create({
      container: {
        flexDirection: 'row',
        marginHorizontal: 0,
        flex: 1,
        marginRight: 4,
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
        backgroundColor: 'transparent' ,
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
        fontFamily: item.completed ? 'Inter-Light' :'Inter-Regular',  
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

      return (
        <BaseButton style={{alignItems: 'flex-end', justifyContent: 'center', height: 44}} onPress={() => { removeListItemMutation.mutate(item) }}>
          <Animated.View
            style={{            
              justifyContent: 'center',
              alignItems: 'center',              
              width: 60,
              flex: 1,
              ...animStyle,
            }}>            
            <Icon name='trash' styles={{backgroundColor: colors.remove, transform: [{ translateX: -16 }]}} />
          </Animated.View>
        </BaseButton>
      );
    };

    const number = getIndex()+1;

    return (
      <ScaleDecorator>
        <SwipeableItem
          key={item.id}
          item={item}
          renderUnderlayLeft={() => <RenderRightActions drag={drag}/>}
          snapPointsLeft={[48]}
          overSwipe={20}
        >
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}          
            style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12}}
          >
            <View style={styled.indexContainer}>
              { !item.completed &&              
                <Regular style={styled.index}>{ number }</Regular>
              }
              <Pressable style={styled.checkbox} onPress={() => updateListItemMutation.mutate({ id: item.id, completed: !item.completed })}>
                { item.completed &&
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
                  update={(value) => { updateListItemMutation.mutate({ id: item.id, body: value })}} 
                  value={item.body}
                />  
              </View>
            </View>
          </TouchableOpacity>        
        </SwipeableItem>
      </ScaleDecorator>
    )
  }); 

  if (!items || !items.length) {
    return null;  
  }
  
  return (
    <View style={{flex: 1}}>
      <DraggableFlatList
        activationDistance={20}           
        data={items}
        initialNumToRender={20}
        keyExtractor={item => item.id}   
        ListEmptyComponent={<EmptyListState />}
        onDragEnd={onReorder}
        renderItem={ListItem}
        refreshing={true}
      />
    </View>
  );
};

const Header = () => {
  const {listParams, setListParams} = useContext(ListParamsContext);

  function toggleShowCompleted() {
    let completed = null;
    
    if (listParams.completed === null) {      
      completed = true;
    } else if (listParams.completed === true) {      
      completed = false;
    }
    setListParams({...listParams, completed})    
  }

  const checkboxToggleIconMap = {
    null: 'checkedFilled',
    true: 'completedOnly',
    false: 'completedNot'
  };

  let checkboxToggleIcon = checkboxToggleIconMap[null];

  if (listParams && !listParams.completed !== null) {
    checkboxToggleIcon = checkboxToggleIconMap[listParams.completed];
  }

  return (
    <View style={{...styles.row, height: 40}}>
      <Exit />
      <View style={{...styles.row, justifyContent: 'flex-end', flex: 1}}>             
        <Pressable
          onPress={toggleShowCompleted}
          style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}
        >
          <Icon name={checkboxToggleIcon} styles={{size: 22, color: colors.darkText }} />
        </Pressable>  
        <Menu />
      </View>
    </View>
  )
}

export default function List({item}) {  
  console.log('LIST');
  const queryKeys = item.context;
  const baseUri = queryKeys.join('/')+'/';
  
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
    results: []
  };
  
  const DataQuery = useQuery({
    initialData,
    keepPreviousData: true,
    placeholderData: keepPreviousData,
    queryFn: async () => await Fetch.get(baseUri),    
    queryKey: queryKeys, 
  });

  const listStyles = StyleSheet.create({
    content: {flex: 1, paddingLeft: 20},
    footer: {
      ...styles.footer,
      paddingHorizontal: 16,
      backgroundColor: colors.darkText,
    }
  });

  return (
    <ListParamsProvider>
      <View
        style={{
          ...styles.View,
          width: Dimensions.get('window').width,
          backgroundColor: colors.theme.inputs.light.backgroundColor,                               
        }}
      >   
        <Header />           
        <View style={listStyles.content}>
          <Title />
          <View style={{flex: 1}}>
            <ListList context={queryKeys} />            
          </View>          
        </View>
        <View
          style={listStyles.footer}>
          <Input            
            keys={queryKeys}
            placeholder='Create New List Item'
            theme='dark'
          />        
          <TalkButton keys={queryKeys} />
        </View>       
      </View>
    </ListParamsProvider>
  );
}