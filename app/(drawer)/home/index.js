import {
  useEffect,
  useRef,
  useState,
 } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { BaseButton } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import {Picker} from '@react-native-picker/picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import RNPickerSelect from 'react-native-picker-select';
import { useMutation, useQuery } from '@tanstack/react-query';

import CustomModal from '../../../components/UI/modal/Modal';
import colors from '../../../components/UI/colors';
import styles from '../../../components/UI/styles';

import Icon from '../../../components/UI/icons';
import ListView from '../../../components/UI/List/View';

import Regular from '../../../components/UI/text/Regular';
import Bold from '../../../components/UI/text/Bold';

import Fetch from '../../../interfaces/fetch';

import { queryClient } from '../../../contexts/query-client';

import DrawerScreen from '../../../components/DrawerScreen';

import Home, { Observer } from '../../../components/UI/Details/Home';

// class ActionableObserver {
//   constructor() {
//     this.data = null;
//     this.observers = [];
//   }

//   get() {
//     return this.data;
//   }

//   subscribe(func) {
//     this.observers.push(func);
//   }

//   unsubscribe(inputFunc) {
//     this.observers.filter(func => func != inputFunc);
//   }

//   notify(data) {
//     this.data = data;
//     this.observers.forEach(func => func(data));
//   }
// }

// const Actionable = new ActionableObserver();

// const ActionableModal = () => {
//   const [item, setItem] = useState(null);
//   const [show, setShow] = useState(false);
//   const [actionPrompt, setActionPrompt] = useState(null);
//   const [selectedList, setSelectedList] = useState(null);
//   const [existingLists, setExistingLists] = useState(null);
//   const { showActionSheetWithOptions } = useActionSheet();

//   function chooseAction() {        
//     const options = ['Search Web', 'Start Convo', 'Create Note', 'Add To List', 'Cancel'];
//     const cancelButtonIndex = options.length - 1;
//     const destructiveButtonIndex = null;
//     const title = `What would you like to do with: ${item.headline}`;
//     const message = 'Pick an existing, or create a new List';

//     console.log(1, options);

//     showActionSheetWithOptions({
//         cancelButtonIndex,
//         destructiveButtonIndex,
//         message,
//         options,
//         title,
//       }, (selectedIndex) => {
//           console.log('selected', options[selectedIndex]);
//           // if (selectedIndex === 0) {

//           //     option.cb();
//           // }
//           // setPrompt(null);
//       });
//       console.log(2);
// }

// function chooseList() {
//   const options = ['Existing', 'New', 'Back', 'Cancel'];
//   const cancelButtonIndex = options.length - 1;
//   const destructiveButtonIndex = 2;
//   const title = 'Pick a List';
//   const message = 'Pick an existing, or create a new List';

  
  
//   showActionSheetWithOptions({
//       cancelButtonIndex,
//       destructiveButtonIndex,
//       options,
//       title,
//       message,
//     }, (selectedIndex) => {
//         console.log('selected', options[selectedIndex]);
//         if (selectedIndex === 0) {

//             option.cb();
//         }
//         setPrompt(null);
//     });
// }

//   useEffect(() => {
//     Actionable.subscribe((value) => {     
//       console.log('v', value);
//       setItem(value);
//     })
//     return () => {
//       Actionable.unsubscribe();
//     }
//   }, []);

//   useEffect(() => {    
//     if (actionPrompt === 'existingList') {
//       Fetch.get('lists/', {sortDirection: 'asc', sortProperty: 'title'})
//         .then(res => {
//           const [err, lists] = res;
//           if (!err) {
//             setExistingLists(lists.results)
//           }
//         })
//     } else {
//       setExistingLists(null);
//     }
//   }, [actionPrompt]);

//   useEffect(() => {
//     if (item === null) {
//       setExistingLists(null);
//       setSelectedList(null);
//       setActionPrompt(null);  
//     } else {
//       chooseAction();
//     }
//   }, [item]);
  
//   if (!item) {
//     return null;
//   }

//   const styled = StyleSheet.create({
//     icon: {
//       container: {
//         height: 100, 
//         width:100,       
//         marginBottom: 20, 
//         alignItems: 'center', 
//         justifyContent: 'center',
//         // ...styles.row,      
//         backgroundColor: colors.white,
//       },
//       image: {
//         color: colors.text,
//       }
//     }
//   });

//   const promptOptions = StyleSheet.create({
//     button: {
//       ...styles.centered,
//       borderWidth: 1,          
//       borderRadius: 8,
//       marginBottom: 12,
//       height: 44,
//       ...styles.centered,
//       backgroundColor: colors.white,
//   },
//   });

//   const webSearch = async () => {        
//     const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.headline)}`;    
//     await WebBrowser.openBrowserAsync(searchUrl);     
//     // show prompt if want to make note         
//     // getData();
//   };

//   const addToExistingList = () => {
//     Fetch.post(`queue/${item.uuid}/`, {type: 'list', target: selectedList})
//       .then(res => {
//         // console.log('res', res);
//         const [err, to] = res;
      
//         if (!err) {
//           redirect(to);        
//         }
//       })
//       .catch(err => {
//         console.warn('Add To Existing List Error: ', err);
//       });
//   };

//   const createListAsTitle = () => {
//     createList({title: item.headline});
//   };

//   const createListAsItem = () => {
//     createList({items: [item.headline]});
//   };

//   const createList = (data) => {
//     Fetch.post('lists/', data)
//     .then(res => {
//       const [err, list] = res;
//       if (!err) {
//         redirect(list);
//       }
//     })
//     .catch(err => {
//       console.warn('Create List Error: ', err);
//     });
//   };

//   const createConversion = (type) => {
//     Fetch.post(`queue/${item.uuid}/`, {type})
//     .then(res => {
//       if (!res.error) {
//         redirect(res);        
//       }
//     })
//     .catch(err => {
//       console.warn('Create Conversion Error: ', err);
//     });
//   };

//   const redirect = (to) => {
//     const typeMap = {
//       'Convo': 'convo',
//       'List': 'list',
//       'Note': 'note'
//     }

//     const target = `${typeMap[to.type]}?uuid=${to.uuid}`;       

//     // https://stackoverflow.com/a/77883629
//     // below regex is to compensate for know bug when using a router method and a dynamic route
//     router.push(target.replace(/\((.*?)\)/g, "[$1]"));
//   }
  
//   function close() {  
//     if (!show) {
//       setShow(true);
//     } else {      
//       setShow(false);
//       Actionable.notify(null);
//     }
//   }

//   return (<View style={{flex: 1}}></View>);

//   return (
//     <CustomModal
//         show={true}
//         toggleShow={close}
//       >
//         { !actionPrompt &&
//           <View style={{backgroundColor: colors.white, flex: 1, ...styles.centered}}>
//             <View style={{width: 240, height: 240, justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>            
//               <Pressable onPress={webSearch}>
//                 <View style={styled.icon.container}>
//                   <Regular>Search Web</Regular>
//                   <Icon name='webSearch' styles={styled.icon.image}/>
//                 </View>
//               </Pressable>
        
//               <Pressable onPress={createConversion.bind(null, 'convo')}>
//                 <View style={styled.icon.container}>
//                   <Regular>Start Convo</Regular>
//                   <Icon name='convoAdd' styles={styled.icon.image}/>
//                 </View>
//               </Pressable>
            
//               <Pressable onPress={createConversion.bind(null, 'note')}>
//                 <View style={styled.icon.container}>
//                   <Regular>Add Note</Regular>
//                   <Icon name='noteAdd' styles={styled.icon.image}/>
//                 </View>
//               </Pressable>
              
//               <Pressable onPress={setActionPrompt.bind(null, 'list')}>
//                 <View style={styled.icon.container}>
//                   <Regular>Add To List</Regular>
//                   <Icon name='listAdd' styles={styled.icon.image}/>
//                 </View>
//               </Pressable>

//             </View>  
//           </View>
//         }

//         {
//           actionPrompt === 'list' &&
//             <View style={{width: '100%'}}>
//                 <Pressable
//                     onPress={() => setActionPrompt('existingList')}
//                     style={{ ...promptOptions.button, backgroundColor: colors.black, borderColor: colors.black }}
//                 >
//                     <Bold style={{color: colors.white}}>Existing List</Bold>
//                 </Pressable>
//                 <Pressable
//                     onPress={() => setActionPrompt('createList')}
//                     style={{ ...promptOptions.button, backgroundColor: colors.black, borderColor: colors.black }}
//                 >
//                     <Bold style={{color: colors.white}}>New List</Bold>
//                 </Pressable>
//                 <Pressable style={promptOptions.button} onPress={() => setActionPrompt(null)}>
//                     <Bold>Back</Bold>
//                 </Pressable>
//             </View>
//         }


//         { actionPrompt === 'existingList' &&
//             <View style={{backgroundColor: 'white', width: '100%'}}>
//                 { !existingLists && 
//                   <View><Bold>Loading</Bold></View>
//                 }

//                 { existingLists && 
//                 <View>
//                   <View style={{...styles.row, ...styles.centered, backgroundColor: 'red'}}>
//                     <Regular>Add </Regular>
//                     <Bold>{item.headline}</Bold>
//                     <Regular> To List</Regular>
//                   </View>
//                   <Picker
//                     selectedValue={selectedList}
//                     style={{backgroundColor: 'green'}}
//                     onValueChange={(itemValue, itemIndex) =>
//                       setSelectedList(itemValue)
//                     }>
//                       { existingLists.map(list => {

//                         return (<Picker.Item key={list.uuid} label={list.title} value={list.uuid} />)
//                       })}
//                   </Picker>
//                   <Pressable
//                     onPress={addToExistingList}
//                     style={{ ...promptOptions.button, backgroundColor: colors.black, borderColor: colors.black }}
//                   >
//                     <Bold style={{color: colors.white}}>Add To List</Bold>
//                   </Pressable>
//                   <Pressable style={promptOptions.button} onPress={() => setActionPrompt('list')}>
//                       <Bold>Back</Bold>
//                   </Pressable>
//                 </View>
//                 }
//             </View>
//         }

//         { actionPrompt === 'createList' &&
//           <View style={{backgroundColor: 'white', width: '100%'}}>
//             <Pressable
//                     onPress={createListAsTitle}
//                     style={{ ...promptOptions.button, backgroundColor: colors.black, borderColor: colors.black }}
//                 >
//                     <Bold style={{color: colors.white}}>As List Title</Bold>
//                 </Pressable>
//                 <Pressable
//                     onPress={createListAsItem}
//                     style={{ ...promptOptions.button, backgroundColor: colors.black, borderColor: colors.black }}
//                 >
//                     <Bold style={{color: colors.white}}>As List Item</Bold>
//                 </Pressable>
//                 <Pressable style={promptOptions.button} onPress={() => setActionPrompt('list')}>
//                     <Bold>Back</Bold>
//                 </Pressable>
//           </View>
//         }
//       </CustomModal>
//   )
// };

const ItemTemplate = ({item}) => { 
  const onPress = () => {  
    Observer.notify(item);
  };
  const remove = async () => {
    await Fetch.remove(`queue/${item.uuid}/`);        
    queryClient.setQueryData(['queue'], oldData => oldData.filter(i => i.uuid !== item.uuid));        
  };

  const styled = StyleSheet.create({        
    content: {
      marginVertical: 2, 
      flexDirection: 'row',
      alignItems: 'center', 
      borderRightWidth: 4,
      borderRightColor: colors.removeHint,            
    },
    icon: {
      container: {
        minHeight: 44, 
        width:44,         
        marginRight: 0, 
        alignItems: 'center', 
        justifyContent: 'center',
        ...styles.row,      
      },
    },        
    info: {
      flexDirection: 'row',
      paddingRight: 8,
      paddingLeft: 20,
      // marginLeft: 8,
      paddingVertical: 12,
      backgroundColor: colors.lightWhite,      
      flex: 1,
    },
    itemDot: {
      marginRight: 10,
      color: colors.theme.text.medium
    },
    title: { fontSize: 14, letterSpacing: 0.1, color: colors.darkText },
  });

  const RenderUnderlayLeftActions = () => {
    const { percentOpen } = useSwipeableItemParams();

    const animStyle = useAnimatedStyle(
      () => ({
        opacity: percentOpen.value,
      }),
      [percentOpen]
    );

    return (
      <BaseButton
        style={{
          justifyContent: 'center', 
          alignItems: 'flex-end', 
        }} 
        
      >
        <Animated.View
          style={animStyle}>
            <View
              style={{                
                ...styles.row,
                paddingLeft: 8,
                backgroundColor: colors.remove,
              }}
            >
              <BaseButton onPress={remove}>
                <View style={styled.icon.container}>
                  <Icon name='trash' />
                </View>
              </BaseButton>
            </View>
        </Animated.View>
      </BaseButton>
    );
  };
  
  return (      
      <SwipeableItem
        key={item.id}
        item={item}
        renderUnderlayLeft={() => <RenderUnderlayLeftActions />}
        snapPointsLeft={[48]}
        overSwipe={20}              
      >         
      <Pressable onPress={onPress}>
        <View style={styled.content}>                
            <View style={styled.info}>                  
                <Regular style={styled.title}>{item.headline}</Regular>              
            </View>
        </View>
      </Pressable>
    </SwipeableItem>        
)};

export default function HomeView() { 
  const options = {
    actions: {
      placeholder: 'Create New Queue Item',
      talkUri: '',
    },
    createKey: 'body',
    filters: {
      placeholder: 'Search Queue',
    },
    ItemTemplate,
    storeKey: ['queue'],
    noRedirect: true, 
  };  

  return (
    <View style={{flex:1}}>      
      { DrawerScreen('Quick Queue') }
      <ListView options={{...options}} />
      <Home />
    </View>
  );
}
