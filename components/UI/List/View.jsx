import {
  useCallback,
  useEffect,
  useState,
 } from 'react';

import {
  Dimensions,
  FlatList,
  View,
} from 'react-native';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import DrawerScreen from '../../../components/DrawerScreen';

import Sort from '../filtering/Sort';
import Search from '../filtering/Search';

import Talk from '../actions/Talk';
import Input from '../actions/Input';

import Fetch from '../../../interfaces/fetch';

import styles from '../styles';

import Bold from '../text/Bold';

import DefaultListItem from './DefaultListItem';

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
      {DrawerScreen(viewTitle)}     
      <View style={styles.header}>   
        { Object.hasOwn(filters, 'sort') &&
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
        renderItem={ItemTemplate.bind(null, {remove})}
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
