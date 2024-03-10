// list of convos
import { useState, useEffect } from 'react';
import { FontAwesome, Ionicons, MaterialCommunityIcons,  } from '@expo/vector-icons';
import {
  Pressable,
  TextInput,
  View,
} from 'react-native';

import { router } from 'expo-router';

import DrawerScreen from '../../../components/DrawerScreen';

import Regular from '../../../components/UI/text/Regular';
import ListTable from '../../../components/UI/List/Table';
import Fetch from '../../../interfaces/fetch';


export default function Convos() {
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

  useEffect(() => {    
    getData(query);
  }, [endOfList, query]);


  function getData() {      
      if (!endOfList) {
        Fetch.get('convos', query)
        .then(({ results, totalResultsCount }) => {           
          if (results.length < query.per) {
            setEndOfList(true);
          }
          setList(results);
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

    // return {
    //   onPress: () => {},
    //   icon: {
    //     name: 'trash',
    //     size: 24,
    //     color: 'black'
    //   },
    // };
    return (
      <Pressable onPress={removeSelected}>
        <FontAwesome name="trash" size={24} color="black" />
      </Pressable>
    )
  }

  function create() {}

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
  
  function onPress(id) {
    router.push(`/convos/${id}`);
  }

  function onEndReached() {
    if (!endOfList) {
      update({ page: query.page + 1})
    }
  }

  function ListHeaderComponent() {
    const iconsMap = {
      name: {
        asc: 'sort-alphabetical-ascending',
        desc: 'sort-alphabetical-descending',
        inactive: 'sort-alphabetical-variant'
      },
      updated: {
        asc: 'sort-calendar-descending',
        desc: 'sort-calendar-ascending',
        // above 2 icons are named incorrectly at the source. above is visually correct.
        inactive: 'calendar-range'
      }
    };
  
    const sortIcon = (property) => {
      const active = query.sortProperty === property;
      const activeColor = '#000';
      const inactiveColor = '#d4d4d8';
      let color = inactiveColor;
      let name = iconsMap[property].inactive
      let size = 22;
      
      if (active) {
        color = activeColor;
        name = query.sortDirection === 'asc' ? iconsMap[property].asc : iconsMap[property].desc;
        size = 24;
      }
  
      return { color, name, size };
    };
  
    function chooseSort(property) {
      let direction = 'desc';
      if (query.sortProperty === property) {
        direction = ['asc', 'desc'].filter(dir => dir !== query.sortDirection)[0];        
      }
      // setSort({ property, direction });
      update({ sortProperty: property, sortDirection: direction});
    }

    return (
      (
        <View style={{ paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            { total &&            
              <Regular>{ list.length } of { total }</Regular>
            }
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            { Object.keys(iconsMap).map(property => {
              const properties = sortIcon(property);
              return (
                <Pressable
                  key={property}
                  onPress={() => chooseSort(property)}
                  style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center'}}>
                  <MaterialCommunityIcons name={properties.name} size={properties.size} color={properties.color} />
                </Pressable>
              )
            })}          
          </View>
      </View>
      )
    )
  };

  function Actions() {
    function onFilterUpdate(text) {
      // debounce  
      setSearch(text);
      // update({ search: text });
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 12 }}>          
        <View style={{
          backgroundColor: '#f4f4f5',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderRadius: 4,
          paddingLeft: 32,
          marginRight: 12,
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
          <FontAwesome name="search" size={16} color="#d4d4d4" style={{position: 'absolute', zIndex: 1, left: 10}}/>
          <TextInput style={{
            height: 40,                      
            marginRight: 0, 
            flex: 1,          
          }}
          placeholder='Search'
          value={search}
          onChangeText={onFilterUpdate} />  
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 8, overflow: 'hidden', }}>
          <Pressable            
            onPress={() => {}}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', }}>
            <MaterialCommunityIcons name='plus-circle-outline' size={24} color='black' />
          </Pressable>
        </View>     
      </View>
    )
  }

  return (
    <>
      {DrawerScreen('Conversations', true, headerRight)}

      {/* <View style={{position: 'absolute'}}>
        <Ionicons name="chatbox-ellipses" size={180} color="#cbd5e1" style={{ position: 'absolute', zIndex: -1, left: -10, top: -78}}/>        
      </View> */}      
      {ListTable({
        list,
        ListHeaderComponent,
        onEndReached,
        onLongPress,
        onPress,
        onRefresh,        
        selected,
      })}
      {Actions()}
    </>
  )

  // return ListTable({
  //   list,
  //   query,
  //   refresh,
  //   remove,
  //   update,
  //  });
}
