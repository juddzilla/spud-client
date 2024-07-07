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

import { useLocalSearchParams, useSegments } from 'expo-router';

import { listSort } from '../type';

export default function ListFlatList({ renderItem }) {
  const [items, setItems] = useState([]);

  const local = useLocalSearchParams();
  const segments = useSegments();

  const type = segments[1];
  const uuid = local.slug;

  const context = [type, uuid].filter(Boolean);
  const sort = listSort(type);

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

  if (sort) {
    initialData.params.sortDirection = sort.defaults.direction;
    initialData.params.sortProperty = sort.defaults.property;
  }

  const DataQuery = useQuery({
    initialData,
    queryKey: context,
    queryFn: async () => {
      const response = await Fetch.get(context, initialData.params);
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
  console.log("ddd");
  const ListEmptyComponent = () => {
    console.log("ListEmptyComponent 0");
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

    console.log("ListEmptyComponent", DataQuery.status);

    if (DataQuery.status === 'pending') {
      return (
        <Empty><Bold>LLLLERDING</Bold></Empty>
      )
    }


    if (DataQuery.data.params && DataQuery.data.params.search.trim().length > 0) {
      console.log("ListEmptyComponent 2");
      return (
        <Empty><Bold>No matches for "{DataQuery.data.params.search}"</Bold></Empty>
      )
    }
    console.log("ListEmptyComponent 3");

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
        ListEmptyComponent={ListEmptyComponent}
        onRefresh={onRefresh}
        // onEndReached={onEndReached}
        // onEndReachedThreshold={0.1}
        //if set to true, the UI will show a loading indicator
        refreshing={false}
      />
    </View>
  )
}