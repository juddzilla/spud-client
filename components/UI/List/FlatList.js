import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  View,
} from 'react-native';

import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';

import styles from '../styles';
import Bold from '../text/Bold';
import { queryClient } from '../../../contexts/query-client';
import Fetch from '../../../interfaces/fetch';

import ViewHead from '../View/Header';

export default function ListFlatList({ filters, context, renderItem }) {
  const [items, setItems] = useState([]);
  const uri = context.join('/') + '/';

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
    queryKey: context,
    queryFn: async () => {
      const response = await Fetch.get(uri, initialData.params);
      return { ...response, params: initialData.params };
    },
    keepPreviousData: true,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (DataQuery.data) {
      setItems(DataQuery.data.results);
    }
  }, [DataQuery.data])

  function nextPage() {
    if (DataQuery.fetchStatus !== 'fetching' && DataQuery.data.next) {
      Fetch.get(DataQuery.data.next)
        .then(response => {
          const results = [...DataQuery.data.results, ...response.results];
          queryClient.setQueryData(context, { ...response, results });
        });
    }
  }

  function onRefresh() {
    if (DataQuery.fetchStatus !== 'fetching') {
      // DataQuery.refetch();
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

    if (DataQuery.status === 'pending') {
      return (
        <Empty><Bold>LLLLERDING</Bold></Empty>
      )
    }

    if (DataQuery.data.params && DataQuery.data.params.search.trim().length > 0) {
      return (
        <Empty><Bold>No matches for "{DataQuery.data.params.search}"</Bold></Empty>
      )
    }

    return (
      <Empty><Bold>Create Your First Below</Bold></Empty>
    )
  };

  function onEndReached(e) {
    const threshold = 60;
    if (e.distanceFromEnd && e.distanceFromEnd <= threshold) {
      nextPage();
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* {display()} */}
      <FlatList
        data={items}
        renderItem={renderItem}
        initialNumToRender={20}
        keyExtractor={(item, index) => `${item.uuid}+${index}`}
        // ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={() => <ViewHead context={context} />}
        onRefresh={onRefresh}
        // onEndReached={onEndReached}
        // onEndReachedThreshold={0.1}
        //if set to true, the UI will show a loading indicator
        refreshing={false}
      />
    </View>
  )
}