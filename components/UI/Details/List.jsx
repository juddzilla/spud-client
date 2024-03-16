// list with list items
// do items have meta context?
// add to list via voice
// importance
// list timeline view

// delete
// add to collection
//

import { useEffect, useState, useCallback } from 'react';
import { Pressable, Modal, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { BaseButton } from 'react-native-gesture-handler';

import DraggableFlatList, { ScaleDecorator, } from "react-native-draggable-flatlist";
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import  { router, useLocalSearchParams, useGlobalSearchParams } from 'expo-router';
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

function sortByUpdated(direction) {
  return function(a, b) {
    const dateAWithoutOffset = a.updated.replace(/-\d{2}$/, '');
    const dateBWithoutOffset = b.updated.replace(/-\d{2}$/, '');        
    const dateA = new Date(dateAWithoutOffset);        
    const dateB = new Date(dateBWithoutOffset);
    
    if (direction === 'asc') {
        return dateA - dateB;
    } else if (direction === 'desc') {
        return dateB - dateA;
    }
  };
}

function sortByIndex(direction) {
  return function(a, b) {
      if (direction === 'asc') {
          return a.index - b.index;
      } else if (direction === 'desc') {
          return b.index - a.index;
      }
  };
}


export default function List() {
  // id or new
  // 
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  // console.log("Local:", local, "Global:", glob.params);

  const initialTitle = local.title ? local.title : 'List';
  
  let initialList = [];
  const sortOn = ['order', 'updated'];
  const [title, setTitle] = useState(initialTitle);
  const [newTitle, setNewTitle] = useState(initialTitle);  
  const [initialListItems, setInitialListItems] = useState(initialList);
  const [listItems, setListItems] = useState(initialList);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState({ property: 'order', direction: 'desc' });

  const [showOptions, setShowOptions] = useState(false);
  const [action, setAction] = useState('');
  
  
  useEffect(() => {
    setNewTitle(title);
  }, [title, setNewTitle]);
  
  useEffect(() => {
    if (!showOptions) {
      setAction('');
    }
  }, [showOptions, setAction]);

  useEffect(() => {
    const sortMap = {
      order: sortByIndex,
      updated: sortByUpdated
    };

    let items = initialListItems;
    
    if (filter.trim().length) {
      items = items.filter(item => item.body.toLowerCase().includes(filter.toLowerCase()));      
    }
    items = items.sort(sortMap[sort.property](sort.direction));
    
    setListItems([...items]);


  }, [filter, sort, initialListItems, setListItems]);

  useEffect(() => {
    if (local.slug) {
      // console.log('local', local.slug);
      Fetch.get('list')
      .then(res => {            
        setInitialListItems(res.children);
        // setTitle(res.title);
      })
      .catch(err => { console.warn('List Error', err)});
    }
  }, []);

  function toggleCompleted({id}) {        
      const newListItems = initialListItems.map(li => {
        if (li.id === id) {
          li.completed = !li.completed;
        }
        return li;
      });
      setListItems(newListItems);
  }

  function removeItem(id) {
    // make api request, onsuccess
    const newList = initialListItems.filter(i => i.id !== id);
    setListItems(newList);    
  }

  function removeList() {
    console.log('slig', local.slug);
    router.back();    
  }

  function update(index, text) {
    const newListItems = [...initialListItems];
    newListItems[index].body = text;
    setInitialListItems(newListItems)
  }

  function onSortUpdate({ sortProperty, sortDirection }) {
    setSort({direction: sortDirection, property: sortProperty});    
  }

  function onFilterUpdate({search}) {
    setFilter(search);
  }

  function onDragEnd({data}) {
    const reordered = data.map((item, index) => {
      item.index = index;
      return item;
    });

    setInitialListItems(reordered);
  }

  function updateTitle() {
    setTitle(newTitle);
    setShowOptions(false);
  }

  function create(text) {
    if (!text.trim().length) {
      return;
    }
    setInitialListItems([
      ...initialListItems, 
      { 
        id: `ss23w2323${initialListItems.length}`, 
        index: initialListItems.length,
        body: text.trim(), 
        updated: `2024-02-20 07:37:27.06557${initialListItems.length}-08`,
      }])    
  }

  const EmptyState = () => {
    return (
      <View style={{ padding: 16, flex: 1, alignItems: 'center' }}>
        { initialListItems.length !== 0 ? (
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

  const HeaderRight = () => {
    const styles = StyleSheet.create({
      background: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.4)',
      },    
      confirmation: {
        container: {
          flex: 1, 
          alignItems: 'center',
          padding: 16,
        },
        content: {
          backgroundColor: colors.white,
          padding: 16,          
          borderRadius: 8,
          shadowColor: colors.darkestBg,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.2,
          shadowRadius: 6.27,
          elevation: 10,
          width: '100%',
          option: {
            alignItems: 'center',            
            child: {
              marginBottom: 12,
            },
            body: {
              flexDirection: 'row', 
              flexWrap: 'wrap',
              textAlign: 'center',
              marginBottom: 16,
            }
          },
        },
        button: {
          ...Styles.centered,
          // paddingHorizontal: 16,
          // paddingVertical: 8,
          borderWidth: 1,          
          borderRadius: 8,
          marginBottom: 8,
          height: 44,
          ...Styles.centered
        },
        actions : {
          cancel: {
            backgroundColor: colors.black,     
            borderColor: colors.black,        
          },
          remove: {            
            backgroundColor: colors.remove,     
            borderColor: colors.remove,        
          },
        }
      },
      options: {
        display: action === '' ? 'flex' : 'none',
        close: {
          ...Styles.centered,
          backgroundColor: colors.white,
          height: 48,
          paddingRight: 16,
          paddingTop: 4,
        },
        container: {
          alignItems: 'flex-end',           
          backgroundColor: 'rgba(255,255,255,0.4)',
          paddingTop: getStatusBarHeight() + 35, 
        },
        option: {
          ...Styles.row, 
          flexDirection: 'row-reverse', 
          // backgroundColor: 'white', 
          paddingLeft: 4, 
          paddingRight: 16,
          paddingVertical: 8, 
          borderRadius: 4,
          marginBottom: 4,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 2,
          elevation: 5,
          icon : {
            container: {
              ...Styles.buttons.icon, 
              ...Styles.centered, 
              backgroundColor: colors.black, 
              borderRadius: 999, 
              marginLeft: 16,
            },
            image: {
              color: colors.white,
            }
          },
          text: {
            container: {
              backgroundColor: colors.white,
              padding: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
            },
            text: {
              fontSize: 16,
            },
          },
        },
      },
    });

    const actions = [
      {        
        display: 'Delete',
        icon: 'trash',
      },
      {        
        display: 'Rename',
        icon: 'pencil',
      },
      // {
      //   display: 'Add To Collection',
      //   icon: 'plus',
      //   onPress: () => {}
      // },
    ];

    return (
      <View>        
        <Modal
          transparent={true}
          visible={showOptions}
          onRequestClose={() => setShowOptions(!showOptions)}
        >
            <View style={styles.background}>
              <View style={styles.options.container}>
                <Pressable
                    style={styles.options.close}
                    onPress={() => setShowOptions(!showOptions)}>
                  <Icon name='close' />
                </Pressable>
                
                <View style={styles.options}> 
                  { actions.map(action => {
                    return (
                      <Pressable key={action.icon} onPress={() => setAction(action.icon)}>
                        <View style={styles.options.option}>
                          <View style={styles.options.option.icon.container}>
                            <Icon name={action.icon} styles={styles.options.option.icon.image} />
                          </View>
                          <View style={styles.options.option.text.container}>
                            <Bold style={styles.options.option.text.text}>{action.display}</Bold>
                          </View>
                        </View>                
                      </Pressable>         
                    )
                  })}                                                          
                </View>
              </View>

              <View style={styles.confirmation.container}>
                {
                  action === 'trash' &&
                  <View style={styles.confirmation.content}>
                    <View style={styles.confirmation.content.option}>
                      <View style={{...Styles.centered, ...Styles.buttons.icon, backgroundColor: colors.remove, borderRadius: 999, ...styles.confirmation.content.option.child}}>
                        <Icon name='trash' styles={{color: colors.white}} />
                      </View>
                      <Bold style={styles.confirmation.content.option.child}>Confirmation Required</Bold>
                      <View style={{ ...styles.confirmation.content.option.child, ...styles.confirmation.content.option.body}}>
                        <Light style={{textAlign: 'center'}}>Are you certain you want to delete this List? This action cannot be reversed.</Light>                                            
                      </View>
                      <View style={{width: '100%'}}>
                        <Pressable style={{ ...styles.confirmation.actions.remove, ...styles.confirmation.button}}>
                          <Bold style={{color: colors.white}}>Delete</Bold>
                        </Pressable>
                        <Pressable style={styles.confirmation.button} onPress={() => setAction('')}>
                          <Bold>Cancel</Bold>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                }
                
                {
                  action === 'pencil' &&
                  <View style={styles.confirmation.content}>
                    <View style={{...styles.confirmation.content.option, width: '100%'}}>
                      <View style={{...Styles.centered, ...Styles.buttons.icon, backgroundColor: colors.black, borderRadius: 999, ...styles.confirmation.content.option.child}}>
                        <Icon name='pencil' styles={{color: colors.white}}/>
                      </View>
                      <Bold style={styles.confirmation.content.option.child}>Change Title</Bold>
                      <View style={{ ...styles.confirmation.content.option.child, ...styles.confirmation.content.option.body}}>
                        <Light style={{textAlign: 'center'}}>What would you like to rename this List to?</Light>                      
                      </View>
                      <TextInput
                        value={newTitle}
                        onChangeText={(text) => setNewTitle(text)}
                        style={{
                          textAlign: 'center',
                          ...styles.confirmation.content.option.child, 
                          borderWidth: 1, 
                          borderColor: colors.darkBg,
                          width: '100%',
                          height: 44,
                          borderRadius: 8,
                          marginBottom: 16,
                          fontFamily: 'Inter-Bold',                        
                        }}
                      />
                      <View style={{width: '100%'}}>
                        <Pressable
                          onPress={updateTitle}
                          style={{ ...styles.confirmation.actions.cancel, ...styles.confirmation.button}}
                        >
                          <Bold style={{color: colors.white}}>Save</Bold>
                        </Pressable>                        
                        <Pressable style={styles.confirmation.button} onPress={() => setAction('')}>
                          <Bold>Cancel</Bold>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                }

                {/* {
                  action === 'plus' &&
                  <View style={styles.confirmation.content}>
                    <View style={{...styles.confirmation.content.option, width: '100%'}}>
                      <View style={{...Styles.centered, ...Styles.buttons.icon, backgroundColor: colors.black, borderRadius: 999, ...styles.confirmation.content.option.child}}>
                        <Icon name='plus' styles={{color: colors.white}}/>
                      </View>
                      <Bold style={styles.confirmation.content.option.child}>Change Title</Bold>
                      <View style={{ ...styles.confirmation.content.option.child, ...styles.confirmation.content.option.body}}>
                        <Light style={{textAlign: 'center'}}>Choose a Collection you would like to add this List to</Light>                      
                      </View>                      
                      <View style={{width: '100%'}}>
                        <Pressable
                          onPress={updateTitle}
                          style={{ ...styles.confirmation.actions.cancel, ...styles.confirmation.button}}
                        >
                          <Bold style={{color: colors.white}}>Save</Bold>
                        </Pressable>                        
                        <Pressable style={styles.confirmation.button} onPress={() => setAction('')}>
                          <Bold>Cancel</Bold>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                } */}

              </View>
            </View>
            
        </Modal>
        <Pressable onPress={ () => setShowOptions(!showOptions)}>
          <Icon name='dots' />
        </Pressable>
      </View>
    )
  };

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
              <Pressable style={styled.checkbox} onPress={() => toggleCompleted({id: item.id})}>
                <Icon name={iconName} styles={styled.icon} />
              </Pressable>
              <View style={styled.body}>
                {
                  item.completed ? (
                    <Light style={styled.text}>{item.body}</Light>
                  ) : (
                    <TextInput              
                      multiline={true}
                      onChangeText={(text) => update(index, text)}
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
        cb: setTitle,
    },
    {
        name: 'remove',
        cb: removeList
    }
];


{/* <HeaderRight toggleShow={setShowOptions} options={[]}/> */}
  return (
    <>
      {DrawerScreen(title, () => <Options options={headerOptions} />)}    
      <View style={Styles.View}>        
          
          <View style={Styles.header}>           
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