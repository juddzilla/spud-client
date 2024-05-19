import {
  View,
} from 'react-native';

import ListFlatList from './ListFlatList';

import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';

import DefaultListItem from './DefaultListItem';
import CreateInput from './CreateInput';

import styles from '../styles';

import Sort from '../filtering/Sort';
import Search from '../filtering/Search';
import TalkButton from '../Talk/Button';

import { queryClient } from '../../../contexts/query-client';
import Fetch from '../../../interfaces/fetch';

export default function ListView({options}) {  
  const {
    actions,
    filters,
    ItemTemplate = DefaultListItem,    
    noRedirect,
    storeKey, 
  } = options;

  const uri = `${storeKey[0]}/`;  
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
    queryKey: storeKey,     
    queryFn: async () => {                                 
        return await Fetch.get(uri, initialData.params);
    },
    keepPreviousData: true,
    placeholderData: keepPreviousData,
  });

  function nextPage() {
    if (DataQuery.fetchStatus !== 'fetching' && DataQuery.data.next) {      
      Fetch.get(DataQuery.data.next)
        .then(response => {
          const results = [...DataQuery.data.results, ...response.results];
          queryClient.setQueryData(storeKey, {...response, results});
        });
    }    
  }

  function update(param) {
    const params = {...DataQuery.data.params, ...param};
    Fetch.get(uri, params)
      .then(response => queryClient.setQueryData(storeKey, response));
  }

  function onRefresh() {    
    if (DataQuery.fetchStatus !== 'fetching') {
      DataQuery.refetch();
    }
  }

  return (
    <View style={styles.View}>
      <View style={{...styles.header, paddingVertical: 8}}>   
        <Search            
          keys={storeKey}
          placeholder={filters.placeholder}
          update={update}
        />
        { Object.hasOwn(filters, 'sort') &&
          <Sort     
            keys={storeKey}    
            fields={filters.sort.fields}      
            update={update}        
          />
        }        
      </View>
      <View style={{flex: 1}}>
        <ListFlatList          
          keys={storeKey}
          nextPage={nextPage}
          onRefresh={onRefresh}
          renderItem={ItemTemplate}
        />       
      
      </View>
      <View style={{...styles.footer}}>
        <CreateInput
          keys={storeKey}
          noRedirect={noRedirect}
          placeholder={actions.placeholder}
          
        />
        <TalkButton keys={storeKey} />                  
      </View>
    </View>       
  );  
}
