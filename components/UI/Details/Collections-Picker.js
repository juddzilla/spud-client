import { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import { queryClient } from '../../../contexts/query-client';
import { DetailStyles } from './styles';

import { CollectionsContext } from '../../../contexts/collections';

import Fetch from '../../../interfaces/fetch';

import Regular from '../text/Regular';
import Bold from '../text/Bold';
import Light from '../text/Light';

import colors from '../colors';
import styles from '../styles';

export default function CollectionsPicker() {
    const [data, setData] = useState([]);
    const insets = useSafeAreaInsets();
    const context = ['collections'];
    // const queryKey = ['details'];
    const { showCollections, setShowCollections } = useContext(CollectionsContext);

    const windowWidth = Dimensions.get('window').width;
    const collectionsView = useRef(new Animated.Value((windowWidth / 2))).current;

    const CollectionQuery = useQuery({
        enabled: false,
        queryKey: context,
        queryFn: async () => {
            const response = await Fetch.get(context);
            return response;
        },
    });

    useEffect(() => {
        const detail = queryClient.getQueryData(['details']);
        if (CollectionQuery.data && detail.context.length) {
            const active = queryClient.getQueryData(detail.context);
            const newData = CollectionQuery.data.results.map(j => ({
                id: j.id,
                uuid: j.uuid,
                selected: active.collections.includes(j.id),
                title: j.title,
            }));
            setData(newData);
        }
    }, [CollectionQuery.data])

    useEffect(() => {
        const op = showCollections ? slideIn : slideOut;
        if (showCollections) {
            CollectionQuery.refetch();
        }
        op();
    }, [showCollections]);

    const slideIn = () => {
        Animated.timing(collectionsView, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
        }).start();
    };

    const slideOut = () => {
        Animated.timing(collectionsView, {
            toValue: windowWidth,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };


    const styled = StyleSheet.create({
        collections: {
            ...DetailStyles.section,
            borderWidth: 1,
            flexDirection: 'column',
            top: insets.top, // + 40 + 56, 
            paddingBottom: insets.bottom,
            position: 'absolute',
            height: Dimensions.get('window').height - ((insets.bottom + insets.top) * 2),
            width: windowWidth,
            zIndex: 100,
        },
        container: {
            backgroundColor: 'white',
            ...styles.row,
            padding: 12,
            paddingLeft: 0,
            flex: 1,
        },
        checkbox: {
            alignItems: 'center',
            height: 40,
            justifyContent: 'center',
            width: 40,
            top: 1,
        },
        content: {
            flex: 1,
            paddingLeft: 8,
            ...styles.row,
            // backgroundColor: 'green', 
            alignItems: 'flex-start',
        },
        date: {
            color: colors.theme.text.medium,
            fontSize: 12,
        },
        icon: {
            color: colors.text,
            size: 15,
        },
        index: {
            fontSize: 12,
            color: colors.theme.text.light,
        },
        indexContainer: {
            width: 34,
            alignItems: 'flex-end',
            paddingRight: 8,
            paddingTop: 2,
        },
        info: {
            ...styles.row,
            flexWrap: 'wrap',
        },
        row: {
            backgroundColor: colors.white,
            ...styles.row,
            marginBottom: 2,
        },
        subtitle: { fontSize: 12, color: colors.theme.text.medium, marginRight: 6 },
        title: { flexWrap: 'wrap', backgroundColor: 'transparent', fontSize: 16, color: colors.theme.text.dark, marginBottom: 4 },
    });

    function onPress(uuid) {
        const detail = queryClient.getQueryData(['details']);
        const newData = data.map(j => ({
            ...j,
            selected: j.uuid === uuid ? !j.selected : j.selected,
        }));
        setData(newData);
        const uri = `${[...detail.context, 'collections', uuid].join('/') + '/'}`;
        Fetch.post(uri)
            .then(response => {
                console.log('RESP', response);
            });
    }

    const ListItem = ({ index, item }) => {
        return (
            <View style={styled.row}>
                <Pressable
                    style={styled.container}
                    onPress={() => onPress(item.uuid)}
                >
                    <View style={styled.content}>

                        <View>
                            <Bold style={styled.title}>{item.title}</Bold>
                            <Regular>Selected: {`${item.selected}`}</Regular>
                        </View>
                    </View>
                </Pressable>

            </View>
        )
    };

    return (
        <Animated.View
            style={[
                styled.collections,
                { transform: [{ translateX: collectionsView }] },
            ]}>
            <View style={styled.container}>
                <FlatList
                    data={data}
                    renderItem={ListItem}
                    initialNumToRender={20}
                    keyExtractor={(item, index) => `${item.uuid}+${index}`}
                // ListEmptyComponent={ListEmptyComponent}
                // ListHeaderComponent={ListHeaderComponent}
                // onRefresh={onRefresh}
                // onEndReached={onEndReached}
                // onEndReachedThreshold={0.1}
                // //if set to true, the UI will show a loading indicator
                // refreshing={false}
                />
            </View>
        </Animated.View>
    )
}