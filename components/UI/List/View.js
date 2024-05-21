import { View } from 'react-native';

import ListFlatList from './ListFlatList';

import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';

import DefaultListItem from './DefaultListItem';
import CreateInput from './CreateInput';

import styles from '../styles';

import Sort from './Sort';
import Search from './Search';
import TalkButton from '../Talk/Button';

export default function ListView({options}) {  
  const {
    actions,
    filters,
    ItemTemplate = DefaultListItem,    
    noRedirect,
    storeKey, 
  } = options;

  
  function update(param) {
    // const params = {...DataQuery.data.params, ...param};
    // Fetch.get(uri, params)
    //   .then(response => queryClient.setQueryData(storeKey, response));
  }

  // function onRefresh() {    
  //   if (DataQuery.fetchStatus !== 'fetching') {
  //     DataQuery.refetch();
  //   }
  // }

  return (
    <View style={styles.View}>
      <View style={{...styles.header, paddingVertical: 8}}>   
        <Search            
          keys={storeKey}
          placeholder={filters.placeholder}          
        />
        { Object.hasOwn(filters, 'sort') &&
          <Sort     
            keys={storeKey}    
            fields={filters.sort.fields}
          />
        }        
      </View>
      <View style={{flex: 1, backgroundColor: 'yellow', paddingBottom: 0}}>
        <ListFlatList    
          filters={filters}      
          keys={storeKey}
          // nextPage={nextPage}
          // onRefresh={onRefresh}
          renderItem={ItemTemplate}
        />       
      
        <View style={{...styles.footer, backgroundColor: 'transparent', position: 'absolute', bottom: 0}}>
          <CreateInput
            keys={storeKey}
            noRedirect={noRedirect}
            placeholder={actions.placeholder}
            
          />
          <TalkButton keys={storeKey} />                  
        </View>
      </View>
    </View>       
  );  
}
