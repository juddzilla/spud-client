// list with list items
// do items have meta context?
// add to list via voice
// importance
// list timeline view

// delete
// add to collection
//

import { useEffect, useState, useCallback } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';

import { BaseButton } from 'react-native-gesture-handler';

import DraggableFlatList, { ScaleDecorator, } from "react-native-draggable-flatlist";
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import  { router, useLocalSearchParams } from 'expo-router';
import DrawerScreen from '../../../components/DrawerScreen';
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

import Options from '../actions/Options';

export default function List() {
  const local = useLocalSearchParams();

  const baseUri = `lists/${local.slug}/`;
  const itemsUri = `${baseUri}items/`;
  const itemUri = (itemId) => `${baseUri}item/${itemId}/`;
  const initialTitle = local.title ? local.title : 'List';
  
  let initialList = [];
  const sortOn = ['order', 'updated_at'];
  const [title, setTitle] = useState(initialTitle);
  // const [newTitle, setNewTitle] = useState(initialTitle);  
  const [initialListItems, setInitialListItems] = useState(initialList);
  const [listItems, setListItems] = useState(initialList);
  const [filter, setFilter] = useState('');
  const [showCompleted, setShowCompleted] = useState(null);
  const [sort, setSort] = useState({ property: 'order', direction: 'desc' });

  const [showOptions, setShowOptions] = useState(false);
  const [action, setAction] = useState('');
  
  
  // useEffect(() => {
  //   setNewTitle(title);
  // }, [title, setNewTitle]);
  
  useEffect(() => {
    if (!showOptions) {
      setAction('');
    }
  }, [showOptions, setAction]);

  useEffect(() => {
    getData();
  }, [sort, filter, showCompleted]);

  useEffect(() => {
    if (local.slug) {
      getData();
    }
  }, []);

  function getData() {
    if (!local.slug) {
      return;
    }
    Fetch.get(baseUri, {
      search: filter,
      sortDirection: sort.direction,
      sortProperty: sort.property,
      showCompleted,
    })
      .then(res => {            
        const [err, list] = res;
        console.log('list', list);
        setTitle(list.title);
        setListItems(list.children);        
      })
      .catch(err => { console.warn('List Error', err)});
  }

  function updateItem(id, data) {  
    Fetch.put(itemUri(id), data)
      .then(res => {            
        const [err, item] = res;
        const itemIndex = listItems.findIndex(listItem => item.id === listItem.id);
        const newListItems = [...listItems];
        newListItems[itemIndex] = item;
        setListItems([...newListItems]);
      })
      .catch(err => {
        console.warn('updateItem err', err);
      })
  }

  function toggleCompleted({id, completed}) {   
      updateItem(id, { completed: !completed});
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

  function removeItem(id) {
    Fetch.remove(itemUri(id))
      .then(res => {             
        const [err, item] = res;
        if (!err) {
          getData();
        }
      })
      .catch(err => {
        console.warn('updateItem err', err);
      });    
  }

  function removeList() {
    console.log('slig', local.slug);
    router.back();    
  }

  function updateItemBody(item, text) {
    const itemIndex = listItems.findIndex(i => i.id = item.id);
    const newListItems = [...listItems];
    newListItems[itemIndex].body = text;
    setListItems(newListItems);
    Fetch.put(itemUri(item.id), { body: text})
      .then(res => {
        const [err, item] = res;
        if (!err) {
          console.log('item', item);
        }
      })
      .catch(err => {})    
  }

  
  function onSortUpdate({ sortProperty, sortDirection }) {
    const newSort = {direction: sortDirection, property: sortProperty};
    setSort(newSort);      
  }

  function onFilterUpdate({search}) {
    setFilter(search);
  }

  function onDragEnd({data}) {
    // const reordered = data.map((item, index) => {
    //   item.order = index;
    //   return item;
    // });

    const reordered = data.reduce((acc, cur, index) => {
      cur.order = index;
      acc.items.push(cur);
      acc.ids.push(cur.id);
      return acc;
    }, { items: [], ids: []});

    setListItems(reordered.items);

    const reqData = {
      order: reordered.ids,
    };
    
    Fetch.put(itemsUri, reqData)
    .then(res => {                  
      const [err, items] = res;

      if (!err) {
        setListItems(items.results);
      }
    })
    .catch(err => { console.warn('List Error', err)});
  }

  function updateTitle(newTitle) {
    setTitle(newTitle);
    setShowOptions(false);
    Fetch.put(baseUri, {title: newTitle});
  }

  function create(text) {
    if (!text.trim().length) {
      return;
    }
    const data = {
      body: text.trim(), 
      order: listItems.length,
    };
    
    Fetch.post(baseUri, data)
    .then(res => {            
      const [err, items] = res;
      console.log("res", res);
      
      if (!err) {
        setListItems(items.results);
      }
    })
    .catch(err => { console.warn('List Error', err)});    
  }

  const EmptyState = () => {
    return (
      <View style={{ padding: 16, flex: 1, alignItems: 'center' }}>
        { listItems.length !== 0 ? (
          <View style={{...Styles.row}}>
            <Light style={{marginRight: 2}}>No list items containing</Light>
            <Bold>"{filter}"</Bold>
          </View>
        ) : (
          <View style={{...Styles.row}}>
            <Bold>Add your first list item</Bold>
          </View>
        ) }
      </View>
    )
  }

  const ListItem = useCallback(({ drag, isActive, item}) => {    
    const iconName = item.completed ? 'checkedOutline' : 'checkOutline';
    const styled = StyleSheet.create({
      container: {
        backgroundColor: item.completed ? '#f8fafc' : 'white',        
        flexDirection: 'row',      
        paddingRight: 48,              
        marginHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.darkBg,      
        shadowColor: "#e2e8f0",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
      },
      checkbox: {
        alignItems: 'center',
        height: 44, 
        justifyContent: 'center', 
        width: 44,
      },
      icon: {
        color: item.completed ? colors.lightText : colors.text,        
      },
      body: {
        paddingTop: 10,        
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

    const RenderRightActions = () => {    
      const { percentOpen } = useSwipeableItemParams();
      const animStyle = useAnimatedStyle(
        () => ({
          opacity: percentOpen.value,
        }),
        [percentOpen]
      );

      return (
        <BaseButton style={{alignItems: 'flex-end', justifyContent: 'center', height: 44}} onPress={() => { removeItem(item.id) }}>
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
              <Pressable style={styled.checkbox} onPress={() => toggleCompleted(item)}>
                <Icon name={iconName} styles={styled.icon} />
              </Pressable>
              <View style={styled.body}>
                {
                  item.completed ? (
                    <Light style={styled.text}>{item.body}</Light>
                  ) : (
                    <TextInput              
                      multiline={true}
                      onChangeText={(text) => updateItemBody(item, text)}
                      style={styled.input}
                    >{ item.body }</TextInput>
                  )
                }
              </View>
            </View>
          </TouchableOpacity>        
        </SwipeableItem>
      </ScaleDecorator>
    )
  });

  const headerOptions = [
    {
        name: 'rename',
        cb: updateTitle,
    },
    {
        name: 'remove',
        cb: removeList
    }
];

const checkboxToggleIconMap = {
  null: 'completedAll',
  true: 'completedOnly',
  false: 'completedNot'
};



  return (
    <>
      {DrawerScreen(title, () => <Options options={headerOptions} />)}    
      <View style={Styles.View}>        
          
          <View style={Styles.header}>
            <Pressable
              onPress={toggleShowCompleted}
              style={{ width: 48, height: 64, alignItems: 'center', justifyContent: 'center'}}
            >
              <Icon name={checkboxToggleIconMap[showCompleted]} styles={{size: 22, color: colors.sort.active }} />
            </Pressable>          
            <Sort fields={sortOn} query={sort} update={onSortUpdate} />
            <Search placeholder={'Filter'} update={onFilterUpdate} />
          </View>

          <View style={{flex: 1}}>
            <DraggableFlatList
              activationDistance={20}           
              data={listItems}
              keyExtractor={item => item.id}   
              ListEmptyComponent={<EmptyState />}
              onDragEnd={onDragEnd}
              renderItem={ListItem}
              refreshing={true}
            />
          </View>
          
          <View style={Styles.footer}>                  
            <Input hideModal={true} onSubmit={create} placeholder='Create New List Item'/>
            <Talk />          
          </View>       
        </View>
    </>
  );
}