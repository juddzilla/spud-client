import {
  useCallback,
  useEffect,
  useRef,
  useState,
 } from 'react';

import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { useNavigation, router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import DefaultListItem from './DefaultListItem';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

// import CustomModal from '../actions/Modal';
import Talk from '../actions/Talk';
import Sort from '../filtering/Sort';
import Search from '../filtering/Search';
import Bold from '../text/Bold';

import DrawerScreen from '../../../components/DrawerScreen';
import Fetch from '../../../interfaces/fetch';


export default function ListView({options}) {
  const {
    actions,
    createKey='title',
    detail,
    filters,
    ItemTemplate = DefaultListItem,    
    uri,
    viewTitle,
   } = options;

     const initialQuery = {
       page: 1,
       per: 20,
       search: '',    
     };
     if (Object.hasOwn(filters, 'sort')) {
       initialQuery.sortDirection = filters.sort.defaults.direction;
       initialQuery.sortProperty = filters.sort.defaults.property;
     }     
     const [initialLoadComplete, setInitialLoadComplete] = useState(false);
     const [list, setList] = useState([]);
     const [loading, setLoading] = useState(true);
    //  const [selected, setSelected] = useState([]);
     const [total, setTotal] = useState(null);
   
     const [query, setQuery] = useState(initialQuery);
     const [next, setNext] = useState(null);
     const [focus, setFocus] = useState(false);
     const [message, setMessage] = useState('');
   
     const unfocusedWidth = Dimensions.get('window').width-48-40;
     const focusedWidth = Dimensions.get('window').width-32;
     const widthAnim = useRef(new Animated.Value(unfocusedWidth)).current; // Initial 
   
     useEffect(() => {
       if (initialLoadComplete) {
        setNext('');
         getData();
       }
     }, [query]);
   
     useEffect(() => {
       let toValue = focus ? focusedWidth : unfocusedWidth
       Animated.timing(widthAnim, {
         toValue,
         duration: 90,
         useNativeDriver: false,
       }).start();
       
     }, [widthAnim, focus])
   
     useFocusEffect(
       useCallback(() => {
         getData();    
         return () => {
          // setInitialLoadComplete(false);
           setQuery(initialQuery);
         };
       }, [])
     );
   
     function getData() {
      setLoading(true);
       Fetch.get(uri, query)
       .then(([err, res]) => { 
         setInitialLoadComplete(true);     
         setLoading(false);   
         if (!err) {          
          setNext(res.next);
          setList(res.results);
          setTotal(res.count);
         }
       })
       .catch(err => {
        console.warn(`List ${uri} error: ${err}`);
      })
     }      
      
     function getNext() {
      if (next) {      
        setLoading(true);  
        Fetch.get(next)
        .then(([err, res]) => {             
          setLoading(false);
          if (!err) {
           setNext(res.next);
           setList([...list, ...res.results]);
          }      
          else {
            console.log('err', err);
          }
        })
        .catch(err => { console.warn(`List ${uri} error: ${err}`)})
      }            
     }

    function removeFromList(uuids) {
      const newList = list.filter(i => !uuids.includes(i.uuid));          
      setList(newList);
      setTotal(total - uuids.length);
    }
   
     const remove = (id) => {
       Fetch.remove(`${uri}${id}/`)
         .then(res => {
           const [err, success] = res;
           if (!err) {
            removeFromList([id]);             
           }
         });
     }

    //  const removeMany = () => {
    //   const uuids = selected.map(id => encodeURIComponent(id)).join(',');
    //   Fetch.remove(`${uri}?uuids=${uuids}/`)
    //   .then(res => {
    //     const [err, success] = res;
    //     if (!err) {
    //       removeFromList([...selected]);
    //       setSelected([]);
    //     }
    //   });
    //  }
   
     async function create(title) {        
       const request = await Fetch.post(uri, { [createKey]: title });
       const [err, res] = request;    
       if (err) {
         console.warn(`Host Error - POST ${uri} - ${JSON.stringify(err)}`)
       } else if (res) {
         if (detail) {
           router.push(`${detail}?uuid=${res.uuid}`);
         } else {
           setList([...list, res]);
         }
       }
     }
   
     function onRefresh() {   
        setNext(null);
        setQuery(initialQuery); 
      //  setEndOfList(false);
     }
   
     function update(params) {      
       setQuery({...query, ...params});
     }
   
     function onSubmitMessage() {
       // if (!hideModal) {
       //     toggleModal(true);
       // }        
       create(message);
       setMessage('');       
       // toggleModal(false); 
   }
   
     const ListEmptyComponent = () => {      
       const Empty = (props) => (
         <View style={{                
           flex: 1, 
           ...styles.centered
         }}>
           <View style={{          
             height: Dimensions.get('window').width - 32,
             width: Dimensions.get('window').width - 32,          
             ...styles.centered
           }}>
             {props.children}
           </View>
         </View>
       )
       
       if (!initialLoadComplete) {
         return (
           <Empty><Bold>Loading</Bold></Empty>  
         )
       }
       
       return (
         <Empty><Bold>Create Your First Below</Bold></Empty>
       )
     }

     const ListHeaderComponent = () => {
      if ([0, null].includes(total)) {
        return null;
      }
      
      return (
        <View style={{...styles.row, paddingLeft: 28, backgroundColor: colors.darkBg, height: 40, marginBottom: 4}}>                
            <Bold style={{fontSize: 12, color: colors.lightText}}>Showing {list.length} of {total}</Bold>
        </View>
      )
    };
   
     const textInputStyled = StyleSheet.create({    
       input: {
           container: {
               backgroundColor: 'white',
               flexDirection: 'row', 
               alignItems: 'center', 
               flex: 1,              
               borderWidth: 1,
               borderColor: colors.theme.text.lightest,
               borderRadius: 12,            
               height:  44,    
               zIndex: 10,
               position: 'absolute',
               left: 16,
               width: widthAnim,
           },
           field: {                    
               height: 44,    
               paddingHorizontal: 16,
               // backgroundColor: 'red',
               // marginRight: 0, mnmnm
               flex: 1,     
               color: colors.theme.inputs.dark.text.darkest,                            
           },
           icons: {
               leading: {
                   size:12, 
                   color: focus ? 'transparent' : colors.theme.inputs.dark.text.light, 
                   position: 'absolute',
                   zIndex: 1, 
                   left: 12,
               },
               trailing: {
                   size: 16, 
                   color: focus ? colors.darkestBg : '#d4d4d4',
                   zIndex: 1,
               }
           },
           send: {
               height: 40,
               width: 40,
               justifyContent: 'center',
               alignItems: 'center',
               // backgroundColor: colors.darkBg, 
               // borderRadius: 40,
               opacity: (focus && message.trim().length) ? 1 : 0,
               position: 'absolute', 
               right: 4
           },
       },
       modal: {
           container: {
               flex: 1,
               paddingTop: 100,
               paddingHorizontal: 16,
           },
           content: {
               fontSize: 36, 
               textAlign: 'center',
           }
       }
     });


    // function toggleSelected(uuid) {      
    //   const selectedIndex = selected.indexOf(uuid);
    //   if (selectedIndex === -1) {
    //     selected.push(uuid);
    //   } else {
    //     selected.splice(selectedIndex, 1);        
    //   }
    //   setSelected([...selected]);
    //   const newList = [...list];
    //   const itemIndex = newList.findIndex(item => item.uuid === uuid);      
    //   newList[itemIndex].selected = !newList[itemIndex].selected;
    //   setList(newList);
    // }    
   
     return (
       <View style={styles.View}>
         {DrawerScreen(viewTitle)}     
         <View style={styles.header}>   
           <View style={{paddingLeft:12, ...styles.row}}>
              {/* <Pressable
                onPress={removeMany}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: selected.length ? 1 : 0,
                }}
              >
                <Icon name={'trash'} styles={{size: 22, color: colors.sort.active }} />
              </Pressable>    */}
              <Search
                disabled={list.length === 0}
                placeholder={filters.placeholder} 
                value={query.search}
                update={update} 
              />
              { Object.hasOwn(filters, 'sort') &&
                <Sort
                  disabled={list.length === 0}
                  fields={filters.sort.fields}
                  query={{direction: query.sortDirection, property: query.sortProperty}} 
                  update={update}
                />
              } 
            
           </View> 
         </View>

         { (initialLoadComplete && loading) && 
          <View 
            style={{
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: Dimensions.get('window').width,  
              height: Dimensions.get('window').height -144,              
              backgroundColor: 'rgba(255,255,255,0.2)',              
              zIndex: 10
            }}>
              <View
                style={{         
                  ...styles.centered,                  
                  flex: 1,
                }}>
                <Bold>Loading</Bold>
              </View>
          </View>
         }
         
          <>
            <FlatList
              data={list}
              renderItem={ItemTemplate.bind(null, {remove})}
              keyExtractor={item => item.uuid}                      
              ListEmptyComponent={ListEmptyComponent}
              ListHeaderComponent={ListHeaderComponent}
              onRefresh={onRefresh}
              onEndReached={getNext}
              //if set to true, the UI will show a loading indicator
              refreshing={false}
            /> 
      
            <View style={styles.footer}>
              <Animated.View style={textInputStyled.input.container}>                            
                  <TextInput
                      value={message}
                      onBlur={() => setFocus(false)}
                      onChangeText={(text) => setMessage(text)}
                      onFocus={() => setFocus(true)}
                      placeholder={actions.placeholder || 'NEW'}
                      style={textInputStyled.input.field}
                      placeholderTextColor={colors.theme.inputs.dark.text.light}
                  />
                  <Pressable
                      onPress={onSubmitMessage}
                      style={textInputStyled.input.send}
                  >
                      <Icon name='send' styles={textInputStyled.input.icons.trailing} />
                  </Pressable>
              </Animated.View>  
              <View style={{ opacity: focus ? 0 : 1}}>
                <Talk />          
              </View>
            </View>
          </>  
       </View>       
     );
  
}
