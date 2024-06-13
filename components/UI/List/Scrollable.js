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
import colors from '../colors';

export default function Scrollable({ renderItem }) {
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

    const Component = renderItem;

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            {
                !items &&
                <ListEmptyComponent />
            }
            {
                items.map((item, index) => {
                    return (
                        <Component
                            key={`${type}-item-${index}`}
                            index={index}
                            item={item}
                        />
                    )
                })
            }
        </View>
    )
}