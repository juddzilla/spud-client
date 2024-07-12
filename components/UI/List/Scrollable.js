import { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
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

import { colorway, listSort } from '../type';
import ViewHeading from './Header';

import colors from '../colors';

export default function Scrollable({ renderItem }) {
    const [items, setItems] = useState([]);

    const local = useLocalSearchParams();
    const segments = useSegments();
    const backgroundColor = 'transparent';
    // const backgroundColor = colorway(segments[1]);

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
                    const current = queryClient.getQueryData(context);
                    const params = { ...current.params, page: current.params.page + 1 };
                    console.log('p', params);
                    queryClient.setQueryData(context, { ...response, params, results });
                });
        }
    }

    function onRefresh() {
        if (DataQuery.fetchStatus !== 'fetching') {
            // DataQuery.refetch();
        }
    }

    function onScroll({ nativeEvent }) {
        const threshold = 0;

        const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
            return layoutMeasurement.height + contentOffset.y >=
                contentSize.height - threshold;
        };

        if (isCloseToBottom(nativeEvent)) {
            nextPage();
        }
    }


    const Container = (props) => (
        <View
            style={{ flex: 1, }}
        >
            {props.children}
        </View>
    );

    const slantConstant = 16;
    const styled = StyleSheet.create({
        slant: {
            width: 0,
            height: 0,
            borderBottomWidth: slantConstant,
            borderBottomColor: colors.white,
            borderLeftWidth: slantConstant,
            borderLeftColor: 'transparent',
        },
        shape: {
            backgroundColor,
            flexDirection: 'row',
            height: slantConstant,
            overflow: 'hidden',
        },
        solid: {
            backgroundColor: colors.white,
            height: slantConstant,
            flex: 1,
        },
    });

    const Component = renderItem;

    const rendering = () => {
        if (DataQuery.status === 'pending') {
            return (
                <Container>
                    {
                        Array
                            .from({ length: 20 }, (v, i) => ({ index: i }))
                            .map((item, index) => {
                                return (
                                    <Component
                                        key={`${type}-item-${index}`}
                                        index={index}
                                        item={item}
                                    />
                                )
                            })
                    }
                </Container>
            )
        } else if (!items || items.length === 0) {
            const displayText = (DataQuery.data.params && DataQuery.data.params.search && DataQuery.data.params.search.trim().length > 0) ? `No matches for "${DataQuery.data.params.search}"` : "Create Your First Below";

            return (
                <Container>
                    <View style={{
                        flex: 1,
                        ...styles.centered
                    }}>
                        <View style={{
                            height: Dimensions.get('window').width - 32,
                            width: Dimensions.get('window').width - 32,
                            ...styles.centered
                        }}>
                            <Bold>{displayText}</Bold>
                        </View>
                    </View>
                </Container>
            )
        }

        return (
            <Container>
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
            </Container>
        )
    };

    return (
        <ScrollView
            stickyHeaderIndices={[1]}
            onMomentumScrollEnd={onScroll}
            scrollEventThrottle={16}
            style={{ flex: 1, backgroundColor }}
        >
            <View style={{ height: 24, backgroundColor }} />
            <ViewHeading />
            {/* <View style={styled.shape}>
                <View style={styled.slant}></View>
                <View style={styled.solid}></View>
            </View> */}
            {rendering()}
        </ScrollView>
    )

    // if (true) {
    // if (DataQuery.status === 'pending') {
    //     return (
    //         <Container>
    //             {
    //                 Array
    //                     .from({ length: 20 }, (v, i) => ({ index: i }))
    //                     .map((item, index) => {
    //                         return (
    //                             <Component
    //                                 key={`${type}-item-${index}`}
    //                                 index={index}
    //                                 item={item}
    //                             />
    //                         )
    //                     })
    //             }
    //         </Container>
    //     )
    //     // } else if (true) {
    // } else if (!items || items.length === 0) {
    //     const displayText = (DataQuery.data.params && DataQuery.data.params.search.trim().length > 0) ? `No matches for "${DataQuery.data.params.search}"` : "Create Your First Below";

    //     return (
    //         <Container>
    //             <View style={{
    //                 flex: 1,
    //                 ...styles.centered
    //             }}>
    //                 <View style={{
    //                     height: Dimensions.get('window').width - 32,
    //                     width: Dimensions.get('window').width - 32,
    //                     ...styles.centered
    //                 }}>
    //                     <Bold>{displayText}</Bold>
    //                 </View>
    //             </View>
    //         </Container>
    //     )
    // }


    // return (
    //     <Container>
    //         {
    //             items.map((item, index) => {
    //                 return (
    //                     <Component
    //                         key={`${type}-item-${index}`}
    //                         index={index}
    //                         item={item}
    //                     />
    //                 )
    //             })
    //         }
    //     </Container>
    // )
}