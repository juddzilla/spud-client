// list of convos
import {
  useCallback,
  useEffect,
  useState,
 } from 'react';

import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BaseButton } from 'react-native-gesture-handler';
import SwipeableItem, { OpenDirection, useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';

import DrawerScreen from '../../../components/DrawerScreen';

import Sort from '../filtering/Sort';
import Search from '../filtering/Search';

import Talk from '../actions/Talk';
import Input from '../actions/Input';

import Fetch from '../../../interfaces/fetch';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import Bold from '../text/Bold';
import Regular from '../text/Regular';
import Light from '../text/Light';

import { relativeDate } from '../../../utils/dates';


export default function ListView({options}) {
  const {
    actions,
    createKey='title',
    defaultTitle,
    detail,
    filters,
    hasSwipeLTR,    
    hideSort=false,
    localSearch=false,
    nestingChildren,    
    subtitle='created_at',
    uri,
   } = options;
  const local = useLocalSearchParams();
  
  const initialQuery = {
    page: 1,
    per: 20,
    search: '',
    sortProperty: filters.sort.defaults.property,
    sortDirection: filters.sort.defaults.direction,
  }
  const [endOfList, setEndOfList] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState(initialQuery);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    getData();
  }, [query]);

  useFocusEffect(
    useCallback(() => {
      getData();    
      return () => {
        setQuery(initialQuery);
      };
    }, [])
  );

  function getData() {              
    // if (!endOfList) { TODO
    if (true) {
      Fetch.get(uri, query)
      .then(([err, res]) => { 
        setInitialLoadComplete(true);        
    
        if (res.results.length < query.per) {
          setEndOfList(true);
        }        
        setList(res.results);
        setTotal(res.total);
      })
      .catch(err => { console.warn(`List ${uri} error: ${err}`)})
    }      
  }

  const remove = (id) => {
    Fetch.remove(`${uri}${id}/`)
      .then(res => {
        const [err, success] = res;
        if (!err) {
          const newList = list.filter(i => i.uuid !== id);          
          setList(newList);
        }
      });
    // make api request, onsuccess
    
  }

  async function create(title) {        
    const request = await Fetch.post(uri, { [createKey]: title });
    const [err, res] = request;    
    if (err) {
      console.warn(`Host Error - POST ${uri} - ${JSON.stringify(err)}`)
    } else if (res) {
      if (detail) {
        router.push(`${detail}/${res.uuid}`);
      } else {
        setList([...list, res]);
      }
    }
  }
  function onRefresh() {    
    setEndOfList(false);
  }

  function update(params) {      
    setQuery({...query, ...params});
  }

  // function onLongPress(index) {    
  //   const id = list[index].id;
  //   const selectedIndex = selected.indexOf(id);
    
  //   if (selectedIndex !== -1) {
  //     selected.splice(selectedIndex, 1);
  //   } else {
  //     selected.push(id);
  //   }
    
  //   setSelected([...selected]);
  // }
  
  function onEndReached() {
    if (!endOfList) {
      update({ page: query.page + 1})
    }
  }

  let ListItem = null;

  if (uri === 'queue/') {
    ListItem = ({ item }) => {
      const { id, type } = item;
  
      const styled = StyleSheet.create({        
        content: {
          marginVertical: 1,
          marginHorizontal: 4,                  
          flexDirection: 'row',
          alignItems: 'center', 
          
          backgroundColor: 'white',
          
        },
        icon: {
          container: {
            minHeight: 44, 
            width:60, 
            marginRight: 0, 
            alignItems: 'center', 
            justifyContent: 'center',
          },
        },        
        info: {
          flexDirection: 'row',
          paddingLeft: 16,
          paddingRight: 8,
          paddingVertical: 10,
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
          <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-end', height: 44}} onPress={() => { remove(item.uuid)}}>
            <Animated.View
              style={{                
                backgroundColor: 'green',
                justifyContent: 'flex-end',
                // alignItems: 'flex-end',
                width: 60,
                // flex: 1,
                ...animStyle,
              }}>
              <Icon name='trash' styles={{transform: [{ translateX: -24 }]}} />
            </Animated.View>
          </BaseButton>
        );
      };
      
      const RenderUnderlayRightActions = () => {
        const { percentOpen } = useSwipeableItemParams();
  
        const animStyle = useAnimatedStyle(
          () => ({
            opacity: percentOpen.value,
          }),
          [percentOpen]
        );

        const webSearch = async () => {          
          remove(item.uuid)
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item[createKey])}`;
          await WebBrowser.openBrowserAsync(searchUrl);              
          getData();

          // 
        }
  
        return (
          <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-start'}}>
            <Animated.View
              style={{                
                ...styles.row,
                width: 136,
                ...styles.centered,          
                ...animStyle,
              }}>
                <View style={{...styles.row, 
                paddingLeft: 16,}}>
                  <BaseButton onPress={webSearch}>
                    <View style={styled.icon.container}>
                      <Icon name='webSearch' />
                    </View>
                  </BaseButton>                  
                  <View style={styled.icon.container}>
                    <Icon name='convoAdd' />
                  </View>
                </View>
                <View style={{...styles.row, 
                paddingLeft: 16,}}>
                  <View style={styled.icon.container}>
                    <Icon name='listAdd' />
                  </View>
                  <View style={styled.icon.container}>                  
                    <Icon name='noteAdd' />
                  </View>
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
            renderUnderlayRight={() => <RenderUnderlayRightActions />}
            snapPointsLeft={[60]}
            snapPointsRight={[136]}
            overSwipe={20}              
          >          
          <View style={styled.content}>                  
              <View style={styled.info}>                  
                  <View style={{ }}>
                    <Regular style={styled.title}>{item[createKey]}</Regular>
                  </View>
              </View>
          </View>
        </SwipeableItem>        
    )};
  } else {

    ListItem = ({ item }) => {
      const { id, type } = item;
  
      const styled = StyleSheet.create({
        pressable: {
          backgroundColor: 'white',
          marginVertical: 4,
          marginHorizontal: 4,        
          borderRadius: 2,
          flexDirection: 'row',
          alignItems: 'center', 
          
          shadowColor: colors.darkBg,
          shadowOffset: {
              width: 0,
              height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.00,
          elevation: 24,
        },
        content: {
          flexDirection: 'row', 
        },
        info: {
          paddingTop: 13,
          paddingBottom: 9,
        },
        icon: {
          container: {
            height: 44, 
            width:40, 
            marginRight: 0, 
            alignItems: 'center', 
            justifyContent: 'center',
          },
          image: { color: colors.darkText, size: 20 }
        },
        subtitle: { fontSize: 12, color: colors.lightText, },
        title: { backgroundColor: 'transparent', fontSize: 14, color: colors.darkText, marginBottom: 4 },
      });
  
      function toDetail() {          
        const typeToRouteMap = {
          Collection: 'collections',
          Convo: 'convos',
          List: 'lists',
          Note: 'notes'
        };  
    
        if (!typeToRouteMap[type]) {
          return;
          
        }
        let route = '';
        if (nestingChildren) {
            route = `${nestingChildren}/${local.slug}/`;
        }
    
      
        route += `${typeToRouteMap[type]}/${item.uuid}`;    
        router.push(route);
      }
  
      const RenderUnderlayLeftActions = () => {
        const { percentOpen } = useSwipeableItemParams();
  
        const animStyle = useAnimatedStyle(
          () => ({
            opacity: percentOpen.value,
          }),
          [percentOpen]
        );
  
        return (
          <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-end', height: 64}} onPress={() => { remove(id)}}>
            <Animated.View
              style={{                
                backgroundColor: 'green',
                justifyContent: 'flex-end',
                // alignItems: 'flex-end',
                width: 60,
                // flex: 1,
                ...animStyle,
              }}>
              <Icon name='trash' styles={{transform: [{ translateX: -24 }]}} />
            </Animated.View>
          </BaseButton>
        );
      };
      
      let RenderUnderlayRightActions = () => {};
  
      if (hasSwipeLTR) {      
        RenderUnderlayRightActions = () => {
          const { percentOpen } = useSwipeableItemParams();
    
          const animStyle = useAnimatedStyle(
            () => ({
              opacity: percentOpen.value,
            }),
            [percentOpen]
          );
    
          return (
            <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-start', height: 64}}>
              <Animated.View
                style={{                
                  flexDirection:'row',                
                  width: 180,
                  display: 'flex',                
                  ...animStyle,
                }}>
                  <View style={styles.row}>
                    <View style={{width: 60, height: 60, ...styles.centered}}>                  
                      <Icon name='convoAdd' styles={{}} />
                    </View>
                    <View style={{width: 60, height: 60, ...styles.centered}}>                  
                      <Icon name='listAdd' styles={{}} />
                    </View>
                    <View style={{width: 60, height: 60, ...styles.centered}}>                  
                      <Icon name='noteAdd' styles={{}} />
                    </View>
                  </View>
              </Animated.View>
            </BaseButton>
          );
        };
      }
  
      const typeToIconMap = {
        Collection: 'collection',
        Convo: 'convo',
        List: 'list',
        Note: 'notes',
        Queue: 'queue',
      };
  
      const subtitleMap = {
        children: `${item[subtitle]} Items`,
        created_at: relativeDate(item.created_at)
      };
      
      return (      
          <SwipeableItem
            key={item.id}
            item={item}
            renderUnderlayLeft={() => <RenderUnderlayLeftActions />}
            renderUnderlayRight={() => <RenderUnderlayRightActions />}
            snapPointsLeft={[60]}
            snapPointsRight={[180]}
            overSwipe={20}              
          >          
          <Pressable
              style={styled.pressable}
              onPress={toDetail} 
          >      
              <View style={styled.content}>
                  <View style={styled.icon.container}>
                      <Icon name={typeToIconMap[type]} styles={styled.icon.image} />                        
                  </View>
                  <View style={styled.info}>
                      <Bold style={styled.title}>{item[createKey]}</Bold>
                      <Light style={styled.subtitle}>{ subtitleMap[subtitle] }</Light>
                  </View>
              </View>
          </Pressable>            
        </SwipeableItem>        
    )};
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

  return (
    <View style={styles.View}>
      {DrawerScreen(defaultTitle)}     
      <View style={styles.header}>   
        { !hideSort &&
        <View style={{marginLeft: 16}}>
          <Sort
            disabled={list.length === 0}
            fields={filters.sort.fields}
            query={{direction: query.sortDirection, property: query.sortProperty}} 
            update={update}
          />
          </View>
        }        
        <Search
          disabled={list.length === 0}
          placeholder={filters.placeholder} 
          update={update} 
        />
      </View>

      <FlatList
        data={list}
        renderItem={ListItem}
        keyExtractor={item => item.uuid}                      
        ListEmptyComponent={ListEmptyComponent}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        //if set to true, the UI will show a loading indicator
        refreshing={false}
      /> 

      <View style={styles.footer}>          
        <Input onSubmit={create} placeholder={actions.placeholder}/>
        <Talk />          
      </View>
    </View>
  );
}
