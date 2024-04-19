import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Animated as RNAnimated,
  Pressable, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  View,
} from 'react-native';

import {
  keepPreviousData,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { BaseButton } from 'react-native-gesture-handler';

import DraggableFlatList, { ScaleDecorator, } from "react-native-draggable-flatlist";
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Fetch from '../../../interfaces/fetch';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Icon from '../icons';

import colors from '../colors';
import Styles from '../styles';

import Sort from '../filtering/Sort';
import Search from '../filtering/Search';

import Talk from '../actions/Talk';
import Input from '../actions/Input';

import Options from './Options';

import { queryClient } from '../../../contexts/query-client';
import { DetailObservable } from './observable';
import DebouncedInput from '../DebouncedInput';

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
  const [title, setTitle] = useState(item.title);  

  const [focusedAction, setFocusedAction] = useState(null);


  useEffect(() => {
    const data = queryClient.getQueryData(queryKeys);
    if (!data) {
      return;
    }
    
    const items = showCompleted === null ? data : data.filter(i => i.completed === showCompleted);

    setListItems(items);
  }, [showCompleted]);
  
  const Query = useQuery({
    queryKey: queryKeys, 
    queryFn: async () => {        
      const response = await Fetch.get(baseUri, {
        search: filter,
        sortDirection: sort.direction,
        sortProperty: sort.property,
        completed: showCompleted,
      });
        
      const { error, children, title } = response;        

      if (!error) {          
        setTitle(title);
        setListItems(children);        
        return children;
      }
      return [];
    },
    keepPreviousData: true,
    placeholderData: keepPreviousData,
  });

  const updateListMutation = useMutation({
    mutationFn: async (data) => {
      try {
        return await Fetch.put(baseUri, data);
      } catch (error) {
        console.warn('Update List Error:', error);
      }
    },
    onSuccess: (data) => {  // variables, context            
      queryClient.setQueryData(queryKeys, oldData => {            
        return {...oldData, ...data};
      });
      queryClient.setQueryData([queryKeys[0]], oldData => {                    
        return oldData.map(old => {
          if (old.uuid !== item.uuid) {
            return old;
          }
          return {
            ...old,
            headline: data.title,
            updated_at: data.updated_at,
          }
        });
      });
    },
  });

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
    onSuccess: (data) => {  // variables, context               
      const itemIndex = listItems.findIndex(listItem => data.id === listItem.id);
      const newListItems = [...listItems];
      newListItems[itemIndex] = data;
      setListItems(newListItems);
    },
  });

  const removeListMutation = useMutation({
    mutationFn: async () => {
      try {
        return await Fetch.remove(baseUri);      
      } catch (error) {
        console.warn('Delete List Error:', error);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData([queryKeys[0]], oldData => {                    
        return oldData.map(old => {
          if (old.uuid !== item.uuid) {
            return old;
          }
          return null;
        }).filter(Boolean);        
      });
      queryClient.removeQueries({ queryKey: queryKeys, exact: true });
      DetailObservable.notify(null);
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
        
        
        queryClient.setQueryData([queryKeys[0]], oldData => {                    
          return oldData.map(old => {             
            if (old.uuid === item.uuid) {              
              let number = parseInt(old.subheadline);
              number--;
              let subheadline = number + ' Item';
              if (number !== 1) {
                subheadline = subheadline + 's'
              }

              return {
                ...old,
                subheadline,
                updated_at: data.updated_at,
              }
            }
            return old;
          });
        });
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

      queryClient.setQueryData([queryKeys[0]], oldData => {                    
        return oldData.map(old => {             
          if (old.uuid === item.uuid) {              
            let number = parseInt(old.subheadline);
            number++;
            let subheadline = number + ' Item';            
            if (number !== 1) {
              subheadline = subheadline + 's';
            }

            return {
              ...old,
              subheadline,
              updated_at: data.results.updated_at,
            }
          }
          return old;
        });
      });
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
    }
  })
  
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
    const message = listItems.length !== 0;
    const completedMap = {
      false: "No 'Uncompleted' Items",
      true: '0 Completed Items',
    }

    return (
      <View style={{ padding: 16, flex: 1, alignItems: 'center' }}>        
        { showCompleted === null ? (          
          <View style={{...Styles.row}}>            
            <Bold>Add your first list item</Bold>
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

    const marginBottom = getIndex() === listItems.length - 1 ? 64 : 0;
    
    const styled = StyleSheet.create({
      container: {
        flexDirection: 'row',
        marginBottom,
        marginHorizontal: 0,    

      },
      checkbox: {
        ...Styles.centered,
        // top: 1,
        width: 40,
        height: 40,
        marginRight: 8,  
      },
      icon: {
        color: item.completed ? colors.sort.inactive : colors.text,
        size:15,    
      },
      body: {
        paddingTop: 10,        
        // backgroundColor: item.completed ? 'transparent' : 'white',  
        paddingHorizontal: 8,   
        flex: 1,
      },
      input: {
        color: colors.text,
        fontFamily: 'Inter-Bold',                     
        paddingRight: 0,        
        position: 'relative',
        top: -2,
        paddingBottom: 10,        
      },
      text: {
        color: colors.lightText,
        paddingBottom: 10, 
        position: 'relative', 
        top: 3
      }
    });

    const checkboxIcon = item.completed ? 'checkedFilled' : 'checkOutline';

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
            <Icon name='trash' styles={{transform: [{ translateX: -16 }]}} />
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
              <View style={styled.body}>
                {
                  item.completed ? (
                    <Light style={styled.text}>{item.body}</Light>
                  ) : (
                    <DebouncedInput
                      multiline={true}
                      placeholder='(text)'
                      style={styled.input}
                      update={(value) => { updateListItemMutation.mutate({ id: item.id, body: value })}} 
                      value={item.body}
                    />  
                  )
                }
              </View>
            </View>
          </TouchableOpacity>        
        </SwipeableItem>
      </ScaleDecorator>
    )
  });


  // UI CONFIG
  const checkboxToggleIconMap = {
    null: 'completedAll',
    true: 'completedOnly',
    false: 'completedNot'
  };

  const headerOptions = [
    {
        cb: removeListMutation.mutate,
        name: 'remove',
        theme: 'red',
    }
  ];

  return (
    <View
      style={{
        ...Styles.View,
        left: -(left),
        width: Dimensions.get('window').width - left,                
      }}
    >
        <View style={{...Styles.row, height: 44, paddingLeft: 12, paddingRight: 4}}>
          <Pressable
            onPress={() => DetailObservable.notify(null)}
            style={{width: 40, marginRight: 0, left: -4, top: -1}}
          >
            <Icon name='close' styles={{fontSize: 20}}/>
          </Pressable>
          
          <DebouncedInput
            multiline={false}
            placeholder='Note Title'
            style={{
              fontSize: 16,
              height: '100%',            
              marginRight: 16,        
            }}
            update={(value) => { updateListMutation.mutate({title: value})}} 
            value={title}
          />        
          <Options options={headerOptions} />
        </View>    
        
        <View
          style={{
            ...Styles.header, 
            paddingHorizontal: 0,            
          }}>        
          <Sort fields={sortOn} query={sort} update={onSortUpdate} />
          <Search placeholder={'Filter'} update={onFilterUpdate} />
          <Pressable
            onPress={toggleShowCompleted}
            style={{width: 40, height: 40, marginRight: 8,alignItems: 'center', justifyContent: 'center'}}
          >
            <Icon name={checkboxToggleIconMap[showCompleted]} styles={{size: 22, color: colors.sort.active }} />
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
        
        <View
          style={{
            ...Styles.footer,
            left: -(left)/2,
            width: Dimensions.get('window').width,
            paddingHorizontal: 8,
          }}>
          <Input
            focused={focusedAction === 'create'}
            setFocused={setFocusedAction}
            onSubmit={createListItemMutation.mutate} 
            placeholder='Create New List Item'
          />        
          { [null, 'talk'].includes(focusedAction) &&          
            <Talk />          
          }  
        </View>       
      </View>
  );
}