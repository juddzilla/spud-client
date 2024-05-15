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

export default function ListFlatList({keys, nextPage, onRefresh, renderItem}) {  
    const Query = queryClient.getQueryData(keys);
    
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

        if (Query.params.search.trim().length > 0) {
        return (
            <Empty><Bold>No matches for "{Query.params.search}"</Bold></Empty>
        ) 
        }
        
        return (
        <Empty><Bold>Create Your First Below</Bold></Empty>
        )
    };

  const ListHeaderComponent = () => {   
    if (Query.count === 0) {
        return null;
    }    

    let headerMessage = '';    
    if (Query.count === null) {        
        headerMessage = 'Loading';      
    } else {        
      headerMessage = `Showing ${Query.results.length} of ${Query.count}`
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
    if (Query.count === null) {
        return (
            <View>
                <Bold>Loading</Bold>
            </View>
        )
    }
    return (
        <FlatList
            data={Query.results}
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