// list of convos
import { useState, useEffect } from 'react';

import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useLocalSearchParams, router } from 'expo-router';
import { BaseButton } from 'react-native-gesture-handler';
import SwipeableItem, { OpenDirection, useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { TextInput } from 'react-native-gesture-handler';

import DrawerScreen from '../../../components/DrawerScreen';

import Sort from '../../../components/UI/List/Sort'
import Icon from '../../../components/UI/icons';;

import Fetch from '../../../interfaces/fetch';

import colors from '../colors';
import Bold from '../text/Bold';
import Light from '../text/Light';


export default function ListView(props) {
  const { defaultTitle, detail, nestingChildren, uri } = props.options;
  const local = useLocalSearchParams();
  
    
  const initialQuery = {
    page: 1,
    per: 20,
    search: '',
    sortProperty: 'updated',
    sortDirection: 'desc',
  }
  const [endOfList, setEndOfList] = useState(false);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState(initialQuery);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [total, setTotal] = useState(null);
  const [newName, setNewName] = useState('');
  const [focus, setFocus] = useState(false);

  useEffect(() => {    
    getData(query);
  }, [endOfList, query]);

  function getData() {      
      if (!endOfList) {
        Fetch.get(uri, query)
        .then(({ results, totalResultsCount }) => {            
            const newList = Array.isArray(results) ? results : results.children; 
          if (newList.length < query.per) {
            setEndOfList(true);
          }
          setList(newList);
          setTotal(totalResultsCount);
        })
        .catch(err => {})
      }
  }

  function remove(ids) {
    // make api request, onsuccess
    const newList = list.filter(i => !ids.includes(i.id));
    setList(newList);
  }

  function removeSelected() {
    remove(selected);
  }

  function headerRight() {
    if (!selected.length) {
      return null;
    }

    return (
      <Pressable onPress={removeSelected}>
        <Icon name="trash" />
      </Pressable>
    )
  }

  function create() {
    router.push(`${detail}/create`);
  }

  function onRefresh() {    
    setEndOfList(false);
  }

  function update(params) {
    setQuery({...query, ...params});
  }

  function onLongPress(index) {    
    const id = list[index].id;
    const selectedIndex = selected.indexOf(id);
    
    if (selectedIndex !== -1) {
      selected.splice(selectedIndex, 1);
    } else {
      selected.push(id);
    }
    
    setSelected([...selected]);
  }
  
  function onPress(type, id) {
    let route = '';
    if (nestingChildren) {
        route = `${nestingChildren}/${local.slug}/`;
    }

    const typeToRouteMap = {
        Collection: 'collections',
        Convo: 'convos',
        List: 'lists',
        Note: 'notes'
    };
    route += `${typeToRouteMap[type]}/${id}`;    
    router.push(route);
  }

  function onEndReached() {
    if (!endOfList) {
      update({ page: query.page + 1})
    }
  }

  

  function onFilterUpdate(text) {
    // debounce  
    setSearch(text);
    // update({ search: text });
  }

  const ListItem = ({ item }) => {
    const { id, subtitle, title, type } = item;

    const styled = StyleSheet.create({
      pressable: {
        backgroundColor: !selected.includes(item.id) ? 'white' : 'red',        
        // paddingHorizontal: 4,
        // paddingVertical: 8,
        marginVertical: 4,
        marginHorizontal: 4,
        // height: 44,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',     
        // overflow: 'hidden',
        
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
        // alignItems: 'center',
        flexDirection: 'row', 
      },
      info: {
        // flexDirection: 'row', 
        // alignItems: 'center',
        // paddingVertical: 12,
        paddingTop: 13,
        paddingBottom: 9,
      },
      icon: {
        container: {
          // backgroundColor: colors.darkestBg,
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

    const RenderRightActions = () => {
      const { percentOpen } = useSwipeableItemParams();

      const animStyle = useAnimatedStyle(
        () => ({
          opacity: percentOpen.value,
        }),
        [percentOpen]
      );

      return (
        <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-end', height: 64}} onPress={() => { remove([id])}}>
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
    
    const typeToIconMap = {
      Collection: 'collection',
      Convo: 'convo',
      List: 'list',
      Note: 'notes',
    };

    return (
      
        <SwipeableItem
          key={item.id}
          item={item}
          renderUnderlayLeft={() => <RenderRightActions />}
          snapPointsLeft={[48]}
          overSwipe={20}              
        >          
        <Pressable
            style={styled.pressable}
            onPress={() => onPress(type, id)} 
        >      
            <View style={styled.content}>
                <View style={styled.icon.container}>
                    <Icon name={typeToIconMap[type]} styles={styled.icon.image} />                        
                </View>
                <View style={styled.info}>
                    <Bold style={styled.title}>{title}</Bold>
                    <Light style={styled.subtitle}>{ subtitle || "Thse lsast bit on convo goes here..." }</Light>
                </View>
            </View>
        </Pressable>            
      </SwipeableItem>        
  )};

  return (
    <View style={{ flex: 1 }}>
      {DrawerScreen(defaultTitle, true, headerRight)}       
      <View style={{ paddingHorizontal: 20, paddingVertical: 0,  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>           
        <View 
          style={{
            backgroundColor: (focus || search.length) ? 'white' : colors.darkBg,              
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 8,
            paddingLeft: 32,
            marginRight: 12,
            paddingRight: 16,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>   
            <Icon name="search" styles={{size:16, color:'#d4d4d4', position: 'absolute', zIndex: 1, left: 10}} />
            <TextInput
              value={search}
              onBlur={() => setFocus(false)}
              onChangeText={onFilterUpdate}
              onFocus={() => setFocus(true)}
              placeholder={'placeholder'}
              style={{                    
                  height: 40,                      
                  marginRight: 0, 
                  flex: 1,
              }}
            />
          </View>
          <Sort query={query} update={update} />
      </View>

      <FlatList
        data={list}
        renderItem={ListItem}
        keyExtractor={item => item.id}                      
        onRefresh={onRefresh}
        //if set to true, the UI will show a loading indicator
        refreshing={false}
      /> 

      <View style={{
        backgroundColor: 'transparent',
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderTopWidth: 1,
        paddingLeft: 16,
        paddingRight: 16,
        paddingVertical: 10,                
        borderColor: colors.darkBg,
        borderLeftWidth: 1,
        borderWidth: 1,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}>          
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',                    
        }}>
          <View style={{
            flex: 1,
            marginRight: 16,
          }}>
                       
            <TextInput
              value={newName}
              onChangeText={(text) => { setNewName(text)}}
              style={{ 
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: colors.darkBg,
                borderRadius: 99,
                paddingHorizontal: 36,
                // paddingRight: 80,
                height: 48,                 
              }}
              placeholder='New'
              />
              <View style={{
                zIndex: 10,
                width: 44, 
                height: 48, 
                justifyContent: 'center', 
                alignItems: 'center', 
                position: 'absolute', 
                left: 0,
                top: 0,
              }}>
                <Icon name='plus' styles={{ color: colors.darkBg, size: 14 }}/>
              </View>
              <View style={{
                zIndex: 10,
                width: 44, 
                height: 48, 
                justifyContent: 'center', 
                alignItems: 'center', 
                position: 'absolute', 
                right: 0,
                top: 0,
              }}>
                <Icon name='send' styles={{ color: newName.length ? colors.darkestBg : 'transparent', size: 16 }}/>
              </View>
          </View>
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
    </View>
  );
}
