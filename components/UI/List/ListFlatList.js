  import { useEffect } from 'react';
  import {
    Dimensions,
    FlatList,
    View,
  } from 'react-native';
  
  import {
    keepPreviousData,
    useQuery,
  } from '@tanstack/react-query';
  
  import colors from '../colors';
  
  import styles from '../styles';
  
  import Bold from '../text/Bold';
  
  import { queryClient } from '../../../contexts/query-client';
  import Fetch from '../../../interfaces/fetch';

export default function ListFlatList({filters, keys, renderItem}) {  
    const uri = `${keys[0]}/`;  
    const sortDefaults = (filters && Object.hasOwn(filters, 'sort')) ? filters.sort.defaults : {};    
    const initialData = {
      count: null, 
      next: null, 
      params: {
          page: 1,
          per: 20,
          search: '',  
      }, 
      results: []
    };

    if (Object.keys(sortDefaults).length) {
      initialData.params.sortDirection = sortDefaults.direction;
      initialData.params.sortProperty = sortDefaults.property;
    } 

    const DataQuery = useQuery({
      initialData,
      queryKey: keys,     
      queryFn: async () => {                                 
          const response =  await Fetch.get(uri, initialData.params);          
          return {...response, params: initialData.params};          
      },
      keepPreviousData: true,
      placeholderData: keepPreviousData,
    });

    useEffect(() => {
    
    }, [DataQuery.data]);

    function nextPage() {
      if (DataQuery.fetchStatus !== 'fetching' && DataQuery.data.next) {      
        Fetch.get(DataQuery.data.next)
          .then(response => {
            const results = [...DataQuery.data.results, ...response.results];
            queryClient.setQueryData(keys, {...response, results});
          });
      }    
    }
  
    function onRefresh() {    
      if (DataQuery.fetchStatus !== 'fetching') {
        DataQuery.refetch();
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
        );    

        if (DataQuery.data.params.search.trim().length > 0) {
        return (
            <Empty><Bold>No matches for "{DataQuery.data.params.search}"</Bold></Empty>
        ) 
        }
        
        return (
        <Empty><Bold>Create Your First Below</Bold></Empty>
        )
    };

  const ListHeaderComponent = () => {   
    if (!DataQuery.data || DataQuery.data.count === 0) {
        return null;
    }    

    let headerMessage = '';    
    
    if (DataQuery.data.count === null) {        
      headerMessage = 'Loading';      
    } else {              
      headerMessage = `Showing ${DataQuery.data.results.length} of ${DataQuery.data.count}`
    }

    return (
      <View style={{...styles.row, paddingLeft: 20, backgroundColor: colors.darkBg, height: 40, marginBottom: 4}}>
        <Bold style={{fontSize: 12, color: colors.lightText}}>{ headerMessage }</Bold>        
      </View>
    )
  };

  function onEndReached(e) {
    const threshold = 60;    
    if (e.distanceFromEnd && e.distanceFromEnd <= threshold) {
        nextPage();        
    }
  }

  function display() {    
    if (DataQuery.status === 'pending' || DataQuery.data && DataQuery.data.count === null) {
        return (
            <View>
                <Bold>Loading</Bold>
            </View>
        )
    }
    return (
        <FlatList
            data={DataQuery.data.results}
            renderItem={renderItem}
            initialNumToRender={20}
            keyExtractor={(item, index) => `${item.uuid}+${index}`}                      
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={ListHeaderComponent}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            //if set to true, the UI will show a loading indicator
            refreshing={false}
        />
    )
    
  }
  

  return (
    <View style={{flex: 1}}>
        {display()}
    </View>
  )
}