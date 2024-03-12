// list with list items
// do items have meta context?
// add to list via voice
// importance
// list timeline view

import { useEffect, useState } from 'react';
import { Animated, FlatList, Pressable, Modal, StyleSheet, Switch, TextInput, View } from 'react-native';
import DrawerScreen from '../../../components/DrawerScreen';

import { BaseButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Fetch from '../../../interfaces/fetch';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Icon from '../icons';
import colors from '../colors';

export default function List() {
  // id or new
  // 
  const [title, setTitle] = useState('List');
  const [listItems, setListItems] = useState([]);
  const [active, setActive] = useState(null);
  const [edittingIndex, setEdittingIndex] = useState(null);
  const [creating, setCreating] = useState('');
  const [sort, setSort] = useState({ property: 'order', direction: 'desc' });
  const [focus, setFocus] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [listType, setListType] = useState('unordered');

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });


  useEffect(() => {
    Fetch.get('list')
    .then(res => {
      setListItems(res.children);
      setTitle(res.title);
    })
    .catch(err => { console.warn('List Error', err)});
  }, []);

  function toggleCompleted({id, index}) {        
      if (listItems[index].id === id) {
        const newListItems = [...listItems];
        newListItems[index].completed = !newListItems[index].completed;
        setListItems(newListItems)
      }
  }

  function remove(ids) {
    // make api request, onsuccess
    const newList = listItems.filter(i => !ids.includes(i.id));
    setListItems(newList);
  }

  function update(index, text) {
    const newListItems = [...listItems];
    newListItems[index].body = text;
    setListItems(newListItems)
  }

  const ListItem = ({ index, item}) => {
    const styled = StyleSheet.create({
      container: {
        backgroundColor: item.completed ? '#f8fafc' : 'white',
        flexDirection: 'row',
        // alignItems: 'center',
        // paddingVertical: 10,
        // paddingBottom: 8,
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
        // color: 'red',
      },
      icon: {
        color: item.completed ? colors.lightText : colors.text,
        // marginRight: 8,
      },
      body: {
        paddingTop: 10,
        // backgroundColor: 'blue',
      },
      input: {
        color: colors.text,
        fontFamily: 'Inter-Bold',             
        // minHeight: 44,
        // paddingTop: 13,
        // paddingVertical: 8,
        paddingRight: 0,
        // lineHeight: 16,
        // backgroundColor: 'red'
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

  const iconName = item.completed ? 'checkedOutline' : 'checkOutline';

  const renderRightActions = (progress, dragX) => {
    // const transform = dragX.interpolate({
    //   inputRange: [0, 30, 60, 61],
    //   outputRange: [-10, 0, 0, -301],
    // });

    // console.log('transform',transform);

    return (
      <BaseButton style={{alignItems: 'center', justifyContent: 'center'}} onPress={() => { remove([item.id])}}>
        <Animated.View
          style={{
            // transform: [{ translateX: transform }],
            justifyContent: 'center',
            alignItems: 'center',
            width: 60,
          }}>
          <Icon name='trash' styles={{transform: [{ translateX: -4 }, { translateY: -3 }]}} />
        </Animated.View>
      </BaseButton>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styled.container}>
        <Pressable style={styled.checkbox} onPress={() => toggleCompleted({id: item.id, index})}>
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
      </Swipeable>
    )
  };

  function create() {
    if (!creating.trim().length) {
      return;
    }
    setListItems([...listItems, { id: `ss23w2323${listItems.length}`, body: creating.trim(), updated: `34534535${listItems.length}`}])
    setCreating('');
  }


  function Sort() {
    const iconsMap = {
      order: {
        asc: 'numericSortAsc',
        desc: 'numericSortDesc',
        inactive: 'numericSortInactive'
      },
      updated: {
        asc: 'dateAsc',
        desc: 'dateDesc',
        inactive: 'dateInactive'
      }
    };
  
    const sortIcon = (property) => {
      const active = sort.property === property;
      const activeColor = '#000';
      const inactiveColor = '#d4d4d8';
      let color = inactiveColor;
      let name = iconsMap[property].inactive
      let size = 22;
      
      if (active) {
        color = activeColor;
        name = sort.direction === 'asc' ? iconsMap[property].asc : iconsMap[property].desc;
        size = 24;
      }
  
      return { color, name, size };
    };
  
    function chooseSort(property) {
      let direction = 'desc';
      if (sort.property === property) {
        direction = ['asc', 'desc'].filter(dir => dir !== sort.direction)[0];        
      }
      // setSort({ property, direction });
      setSort({ property, direction });
    }
 
    return (
      (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              { Object.keys(iconsMap).map(property => {
              const properties = sortIcon(property);
              // console.log('properties', properties);
              return (
                  <Pressable
                    key={property}
                    onPress={() => chooseSort(property)}
                    style={{ width: 48, height: 64, alignItems: 'center', justifyContent: 'center'}}
                  >
                    <Icon name={properties.name} styles={{size: properties.size, color: properties.color }} />
                  </Pressable>
              )
              })}          
          </View>          
      )
    )
  }

  function headerRight() {
    return (
      <>
        <Modal

          transparent={true}
          visible={showOptions}
          onRequestClose={() => {
            
            setShowOptions(!showOptions);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>              
              <Bold style={styles.modalText}>Delete</Bold>
              <Bold style={styles.modalText}>Rename</Bold>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setShowOptions(!showOptions)}>
                <Bold style={styles.textStyle}>Hide Modal</Bold>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable onPress={ () => setShowOptions(!showOptions)}>
          <Icon name='dots' />
        </Pressable>
      </>
    )
  }

  return (
    <>
      <View style={{ flex: 1}}>
        
        {DrawerScreen(title, true, headerRight)}
        <Sort />
        <FlatList
            data={listItems}
            renderItem={ListItem}
            keyExtractor={item => item.id}   
            style={{ flex: 1 }}
            // ListHeaderComponent={ListHeaderComponent}
            
            //if set to true, the UI will show a loading indicator
            
          />           
      </View>
      
      <View style={{
        backgroundColor: 'transparent',
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        // paddingHorizontal: 32, 
        paddingLeft: 32,
        paddingRight: 16,
        paddingVertical: 12,
        borderTopWidth: 0,        
        borderTopColor: colors.darkBg,
      }}>          
        <View style={{
            backgroundColor: focus ? 'white' : colors.darkBg,
            
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 32,
            paddingLeft: 32,
            marginRight: 12,
            paddingRight: 16,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>   
            <Icon name='plus' styles={{size:16, color:'#d4d4d4', position: 'absolute', zIndex: 1, left: 12}} />
            <TextInput
                value={creating}
                onBlur={() => setFocus(false)}
                onChangeText={(text) => setCreating(text)}
                onFocus={() => setFocus(true)}
                placeholder='Create New List Item'
                style={{                    
                    height: 48,                      
                    marginRight: 0, 
                    flex: 1,
                    paddingRight: 48,
                }}
            />
            <Pressable
              onPress={create}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.darkBg, 
                borderRadius: 40,
                opacity: (focus && creating.trim().length) ? 1 : 0,
                position: 'absolute', 
                right: 4
              }}
            >

              <Icon name='send' styles={{size:16, color: focus ? colors.darkestBg : '#d4d4d4', zIndex: 1}} />
            </Pressable>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',          
        }}>
          <Pressable            
            onPress={() => {}}
            style={({ pressed }) => ({
              backgroundColor: colors.brand,
              borderWidth: 1, 
              borderColor: pressed ? 'black' : 'white',  
              width: 64, 
              height: 64, 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: 100,
              shadowColor: colors.darkestBg,
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,

              elevation: 10,
            })}>
            <Icon name='mic' styles={{size: 30, color: 'white' }} />
          </Pressable>
        </View>     
      </View>
    </>
  )
}