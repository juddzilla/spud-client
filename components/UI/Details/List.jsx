import { useCallback, useEffect, useState } from 'react';
import {
  Animated as RNAnimated,
  Pressable, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  View,
} from 'react-native';

import { BaseButton } from 'react-native-gesture-handler';

import DraggableFlatList, { ScaleDecorator, } from "react-native-draggable-flatlist";
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import  { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
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
  
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [filter, setFilter] = useState('');
  const [listItems, setListItems] = useState(initialList);
  const [showCompleted, setShowCompleted] = useState(null);
  const [sort, setSort] = useState({ property: 'order', direction: 'desc' });
  const [title, setTitle] = useState(initialTitle);  

  const [showOptions, setShowOptions] = useState(false);
  const [action, setAction] = useState('');
  
  useEffect(() => {
    if (!showOptions) {
      setAction('');
    }
  }, [showOptions, setAction]);

  useFocusEffect(
    useCallback(() => {
      setInitialLoadComplete(true);
      getData();    
      return () => {
        setInitialLoadComplete(false);
      };
    }, [])
  );

  useEffect(() => {    
    if (initialLoadComplete) {
      getData();
    }
  }, [filter, showCompleted, sort])


  function getData() {
    if (!local.slug) {
      return;
    }
    Fetch.get(baseUri, {
      search: filter,
      sortDirection: sort.direction,
      sortProperty: sort.property,
      completed: showCompleted,
    })
      .then(res => {            
        const [err, list] = res;
        
        if (!err) {          
          setTitle(list.title);
          setListItems(list.children);        
        }
      })
      .catch(err => { console.warn('List Error', err)});
  }

  function removeList() {    
    Fetch.remove(baseUri)
      .then((res) => {
        const [err] = res;
        if (!err) {
          router.back();    
        }
      });
  }

  function updateTitle(newTitle) {
    setTitle(newTitle);
    setShowOptions(false);
    Fetch.put(baseUri, {title: newTitle});
  }


  // LIST ITEM OPERATIONS
  function createItem(text) {
    if (!text.trim().length) {
      return;
    }
    const data = {
      body: text.trim(), 
    };
    setListItems([
      ...listItems, 
      { 
        ...data, 
        id: `temp${data.order}`,
        order: listItems.length,
      }]);
    
    Fetch.post(baseUri, data)
      .then(res => {            
        const [err, items] = res;
        
        if (!err) {
          setListItems([...listItems, items.results]);
        }
      })
      .catch(err => { console.warn('List Error', err)});    
  }  

  function removeItem(id) {
    Fetch.remove(itemUri(id))
      .then(res => {             
        const [err] = res;
        if (!err) {
          const itemIndex = listItems.indexOf(l => l.id === id);
          listItems.splice(itemIndex, 1);
          setListItems([...listItems]);        
        }
      })
      .catch(err => {
        console.warn('updateItem err', err);
      });    
  }

  function toggleCompleted({id, completed}) {   
    updateItem(id, { completed: !completed});
  }

  function updateItem(id, data) {  
    Fetch.put(itemUri(id), data)
      .then(res => {            
        const [err, item] = res;
        if (!err) {
          const itemIndex = listItems.findIndex(listItem => item.id === listItem.id);
          const newListItems = [...listItems];
          newListItems[itemIndex] = item;
          setListItems(newListItems);
        }
      })
      .catch(err => {
        console.warn('updateItem err', err);
      })
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
          // console.log('item', item);
        }
      })
      .catch(err => {})    
  }


  // UI OPERATIONS
  function onFilterUpdate({search}) {
    setFilter(search);
  }

  function onReorderUpdate({data}) {
    const reordered = data.reduce((acc, cur, index) => {
      cur.order = index;
      acc.items.push(cur);
      acc.ids.push(cur.id);
      return acc;
    }, { items: [], ids: []});

    setListItems(reordered.items);

    Fetch.put(itemsUri, {order: reordered.ids})
    .then(res => {                  
      const [err, items] = res;

      if (!err) {
        setListItems(items.results);
      }
    })
    .catch(err => { console.warn('List Error', err)});
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

  const ListItem = useCallback((props) => {    
    const {drag, getIndex, isActive, item} = props;     
    const iconName = item.completed ? 'checkedOutline' : 'checkOutline';

    const marginBottom = getIndex() === listItems.length - 1 ? 64 : 0;
    // console.log('marginBottom', index, listItems.length);
    const styled = StyleSheet.create({
      container: {
        flexDirection: 'row',
        marginBottom,
        marginHorizontal: 0,
        // borderBottomWidth: 1,
        // borderBottomColor: colors.darkBg,      
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
        // backgroundColor: 'green', 
        alignItems: 'center',
        height: 44, 
        justifyContent: 'center', 
        width: 48,
        marginLeft: 5,
      },
      icon: {
        color: item.completed ? colors.lightText : colors.text,    
        size:14,    
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
                <Icon name={'checkOutline'} styles={styled.icon} />
                { item.completed &&
                  <Icon name={'check'} styles={{
                    position: 'absolute', 
                    size: 20,
                    top: 9,
                    left: 17
                  }}/>
                }
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


  // UI CONFIG
  const checkboxToggleIconMap = {
    null: 'completedAll',
    true: 'completedOnly',
    false: 'completedNot'
  };

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

  return (
    <>
      {DrawerScreen(title, () => <Options options={headerOptions} />)}    
      <View style={Styles.View}>        
          
          <View style={Styles.header}>
         
            <Sort fields={sortOn} query={sort} update={onSortUpdate} />
            <Search placeholder={'Filter'} update={onFilterUpdate} />
            <Pressable
              onPress={toggleShowCompleted}
              style={{width: 40, height: 40, right: -7, alignItems: 'center', justifyContent: 'center'}}
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
              onDragEnd={onReorderUpdate}
              renderItem={ListItem}
              refreshing={true}
            />
          </View>
          
          <View style={Styles.footer}>                  
            <Input hideModal={true} onSubmit={createItem} placeholder='Create New List Item'/>
            <Talk />          
          </View>       
        </View>
    </>
  );
}