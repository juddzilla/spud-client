import { useCallback, useEffect, useState } from 'react';
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

import DraggableFlatList, { ScaleDecorator, } from "react-native-draggable-flatlist";
import { BaseButton } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";

// import Talk from '../actions/Talk';
import TalkButton from '../Talk/Button';
import Input from '../actions/Input';
import colors from '../colors';
import DebouncedInput from '../DebouncedInput';
import Sort from '../filtering/Sort';
import Search from '../filtering/Search';
import Icon from '../icons';
import Styles from '../styles';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import { queryClient } from '../../../contexts/query-client';
import Fetch from '../../../interfaces/fetch';

export default function List({item, left}) {  
  const queryKeys = ['lists', item.uuid];
  const baseUri = `lists/${item.uuid}/`;
  const itemsUri = `${baseUri}items/`;
  const itemUri = (itemId) => `${baseUri}item/${itemId}/`;
  
  const initialSort = { property: 'order', direction: 'desc' };
  const sortOn = ['order', 'updated_at'];
  
  const [filter, setFilter] = useState('');
  const [listItems, setListItems] = useState([]);
  const [showCompleted, setShowCompleted] = useState(null);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    const data = queryClient.getQueryData(queryKeys);
    
    if (!data || !data.children) {      
      return;
    }
    const items = data.children
      .filter(i => {
        if (showCompleted === null) { return true; }
        return i.completed === showCompleted;
      })
      .filter(i => {
        if (!filter.trim().length) {
          return true;
        }
        return i.body.toLowerCase().includes(filter.toLowerCase());
      })
      .sort((a,b) => {
        let first = a[sort.property];
        let second = b[sort.property];

        if (sort.property === 'updated_at') {          
          const timestamp = (dateString) => {
            const date = new Date(dateString);
            return date.getTime();
          }
   
          first = timestamp(first);
          second = timestamp(second);
        }

        if (first === second) {
          return 0;
        }
        
        const values = [first, second];

        if (sort.direction === 'desc') {
          values.reverse();
        }

        return values[0] - values[1];
      });
    setListItems(items);
  }, [filter, showCompleted, sort]);
  
  const Query = useQuery({
    keepPreviousData: true,
    placeholderData: keepPreviousData,
    queryKey: queryKeys, 
    queryFn: async () => {
      const params = {
        search: filter,
        sortDirection: sort.direction,
        sortProperty: sort.property,
        completed: showCompleted,
      };
      const response = await Fetch.get(baseUri, params);
      
      const { children, error } = response; 

      if (error) {
        return Query.data;
      }

      return { ...Query.data, children, params };
    },    
  });

  useEffect(() => {
    if (Query.data.children) {
      setListItems(Query.data.children)
    }    
  }, [Query.data]);

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
      const itemIndex = listItems.findIndex(listItem => data.id === listItem.id);
      const newListItems = [...listItems];
      newListItems[itemIndex] = data;
      setListItems(newListItems);
      queryClient.invalidateQueries([queryKeys[0]]);
    },
  });

  const removeListItemMutation = useMutation({
    mutationFn: async ({ id }) => {
      try {
        return await Fetch.remove(itemUri(id));
      } catch (error) {
        console.warn('Delete List Item Error:', error);
      }
    },
    onSuccess: (data, variables) => {          
      if (!data.error) {        
        const itemIndex = listItems.findIndex(l => l.id === variables.id);        
        listItems.splice(itemIndex, 1);
        setListItems([...listItems]);
        queryClient.invalidateQueries([queryKeys[0]]);
      } 
    }
  })

  const createListItemMutation = useMutation({
    mutationFn: async (text) => {
      if (!text.trim().length) {
        return;
      }
      const data = { body: text.trim() };

      try {
        return await Fetch.post(baseUri, data)
      } catch (error) {
        console.warn('Create List Item Error:', error);
      }
    },
    onSuccess: (data) => {      
      setListItems([...listItems, data.results]);
      queryClient.invalidateQueries([queryKeys[0]]);
    }
  });

  const reorderMutation = useMutation({
    mutationFn: async ({data}) => {
      const reordered = data.reduce((acc, cur, index) => {
        cur.order = index;
        acc.items.push(cur);
        acc.ids.push(cur.id);
        return acc;
      }, { items: [], ids: []});
  
      return await Fetch.put(itemsUri, {order: reordered.ids})
    },
    onSuccess: (data) => {
      setListItems(data.results);
      queryClient.invalidateQueries([queryKeys[0]]);
    }
  });
  
  // UI OPERATIONS
  function onFilterUpdate({search}) {
    setFilter(search);
  }

  function onSortUpdate({ sortProperty, sortDirection }) {
    const newSort = {direction: sortDirection, property: sortProperty};
    setSort(newSort);      
  }

  function toggleShowCompleted() {
    if (showCompleted === null) {
      setShowCompleted(true);
    } else if (showCompleted === true) {
      setShowCompleted(false);
    } else {
      setShowCompleted(null);
    }
  }


  // UI ELEMENTS
  const EmptyState = () => {
    const completedMap = {
      false: "No 'Uncompleted' Items",
      true: '0 Completed Items',
    }

    return (
      <View style={{ padding: 16, flex: 1, alignItems: 'center' }}>        
        { showCompleted === null ? (          
          <View style={{...Styles.row, color: colors.white
          
          
          
          }}>            
            <Bold style={{color: colors.lightWhite}}>Add your first list item</Bold>
          </View>
        ) : (
          <View style={{...Styles.row}}>
            { filter.trim().length ?
              (
                <>
                  <Light style={{marginRight: 2}}>No list items containing</Light>
                  <Bold>"{filter}"</Bold>
                </>
              ) : (
                <>
                  <Light>{completedMap[showCompleted]}</Light>
                </>
              )
            }
          </View>
        ) }
      </View>
    )
  }

  const ListItem = useCallback((props) => {    
    const {drag, getIndex, isActive, item} = props;     

    const textColor = colors.darkText;
    
    const styled = StyleSheet.create({
      container: {
        flexDirection: 'row',
        marginBottom: 4,
        marginHorizontal: 0,    
        backgroundColor: colors.white, 
        borderRadius: 4,
      },
      checkbox: {
        ...Styles.centered,        
        width: 40,
        height: 40,
      },
      icon: {
        color: textColor,
        size: 20,    
      },
      body: {
        flex: 1,
        paddingHorizontal: 8,   
      },
      indexContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 24,
        minWidth: 16,
        height: 40,
        
      },
      index: {
        fontSize: 10,     
      },
      input: {
        backgroundColor: 'transparent',
        color: textColor,
        fontFamily: item.completed ? 'Inter-Light' :'Inter-Bold',                     
        height: '100%',
        paddingRight: 0,        
        paddingTop: 13,
        position: 'relative',
        top: -2,
      },
      text: {
        color: colors.lightWhite,
        position: 'relative', 
        top: 3
      }
    });

    const checkboxIcon = item.completed ? 'checkedOutline' : 'checkOutline';

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
          >
            <View style={styled.container}>
              <Pressable style={styled.checkbox} onPress={() => updateListItemMutation.mutate({ id: item.id, completed: !item.completed })}>
                <Icon name={checkboxIcon} styles={styled.icon} />                
              </Pressable>
              <View style={styled.indexContainer}>
                <Regular style={styled.index}>{ getIndex()+1 }</Regular>
              </View>
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


  // UI CONFIG
  const checkboxToggleIconMap = {
    null: 'checkedFilled',
    true: 'completedOnly',
    false: 'completedNot'
  };

  return (
    <View
      style={{
        ...Styles.View,
        left: -(left),
        width: Dimensions.get('window').width - (left*2),   
        backgroundColor: colors.theme.inputs.light.backgroundColor,                               
      }}
    >        
        <View style={{flex: 1, paddingHorizontal: 8,   }}>

          <View
            style={{
              ...Styles.header, 
              paddingHorizontal: 0,
              marginBottom: 8,
            }}
          >        
            <Sort
              fields={sortOn} 
              query={sort} 
              size='small' 
              theme='dark' 
              update={onSortUpdate}
            />
            <Search placeholder={'Filter'} size='small' update={onFilterUpdate} />
            <Pressable
              onPress={toggleShowCompleted}
              style={{width: 40, height: 40, marginRight: 8,alignItems: 'center', justifyContent: 'center'}}
            >
              <Icon name={checkboxToggleIconMap[showCompleted]} styles={{size: 22, color: colors.darkText }} />
            </Pressable>   
          </View>          

          <View style={{flex: 1}}>
            <DraggableFlatList
              activationDistance={20}           
              data={listItems}
              keyExtractor={item => item.id}   
              ListEmptyComponent={<EmptyState />}
              onDragEnd={reorderMutation.mutate}
              renderItem={ListItem}
              refreshing={true}
            />
          </View>
        </View>
        
        <View
          style={{
            ...Styles.footer,
            paddingHorizontal: 16,
            backgroundColor: colors.darkText,
          }}>
          <Input            
            onSubmit={createListItemMutation.mutate} 
            placeholder='Create New List Item'
            theme='dark'
          />        
          <TalkButton keys={queryKeys} />
        </View>       
      </View>
  );
}