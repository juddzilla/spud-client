// list of convos
import { useState, useEffect } from 'react';

import {
  Pressable,
  View,
} from 'react-native';

import { useLocalSearchParams, useGlobalSearchParams, router } from 'expo-router';

import SearchBar from '../SearchInputWithIcon';

import DrawerScreen from '../../../components/DrawerScreen';

import Regular from '../../../components/UI/text/Regular';
import ListTable from '../../../components/UI/List/Table';
import Sort from '../../../components/UI/List/Sort'
import Icon from '../../../components/UI/icons';;
import Fetch from '../../../interfaces/fetch';
import colors from '../colors';
import Bold from '../text/Bold';
export default function ListView(props) {
    const { defaultTitle, detail, nestingChildren, uri } = props.options;
    const local = useLocalSearchParams();
    const global =  useGlobalSearchParams();
    console.log('local',local ,global);
    
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
        Fetch.get(uri, query)
        .then(({ results, totalResultsCount }) => {  
            console.log('res', results);

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
    console.log('nestingChildren',nestingChildren);

    const typeToRouteMap = {
        Collection: 'collections',
        Convo: 'convos',
        List: 'lists',
        Note: 'notes'
    };
    route += `${typeToRouteMap[type]}/${id}`;
    console.log('ROUTE', route);
    router.push(route);
  }

  function onEndReached() {
    if (!endOfList) {
      update({ page: query.page + 1})
    }
  }

  function ListHeaderComponent() {
    return (
      (
        <>
          <View style={{ paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <Pressable onPress={create} style={{ paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1 }}>
              <Bold>Creat enew</Bold>
            </Pressable>
            <Sort query={query} update={update} />
          </View>
          
        </>
      )
    )
  };

  function Actions() {
    function onFilterUpdate(text) {
      // debounce  
      setSearch(text);
      // update({ search: text });
    }
    // colors.lightBg
    return (
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
        <SearchBar               
          placeholder='Seafrch'
          value={search}
          onChangeText={onFilterUpdate}
        />
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
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {DrawerScreen(defaultTitle, true, headerRight)}       
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
    </View>
  );
}
