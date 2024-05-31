import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import { queryClient } from '../../../contexts/query-client';

import { useDebouncedValue } from '../../../utils/debounce';

import Fetch from '../../../interfaces/fetch';

export default function Search({ keys }) {
    const [disabled, setDisabled] = useState(true);
    const [focused, setFocused] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebouncedValue(search, 500);
    const uri = `${keys[0]}/`;
    const inputRef = useRef();

    const DataQuery = useQuery({
        enabled: false,
        queryKey: keys,
    });

    useEffect(() => {
        if (DataQuery.data) {
            setDisabled(search.trim().length === 0 && DataQuery.data.results.length === 0);
        }
    }, [DataQuery.data]);

    let height = 32;
    let searchIconSize = 12;

    useEffect(() => {
        if (search.trim().length && search !== DataQuery.data.params.search) {
            update({ search });
        }
    }, [debouncedSearch]);

    useEffect(() => {
        if (focused) {
            inputRef.current.focus();
        }
    }, [focused])

    const focusedOrHasSearch = focused || search.trim().length > 0;

    const style = StyleSheet.create({
        container: {
            ...styles.row,
            backgroundColor: focusedOrHasSearch ? colors.lightWhite : 'transparent',

            borderWidth: 1,
            // borderRadius: height / 2,
            borderRadius: height / 2,
            overflow: 'hidden',
            borderColor: focusedOrHasSearch ? colors.darkText : colors.white,


            // flex: 1,
            justifyContent: 'space-between',
            marginRight: 8,

        },
        search: {
            color: focusedOrHasSearch ? colors.darkText : colors.sort.inactive,
            size: searchIconSize,
        },
        icon: {
            container: {
                height,
                width: height,
                ...styles.centered,
                // backgroundColor: 'red',
                // borderWidth: 1,
                borderColor: focusedOrHasSearch ? colors.darkText : colors.white,
            },
        },
        input: {
            height,
            marginRight: 0,
            color: colors.darkText,
            paddingLeft: 18,
            paddingRight: 44,
            position: focused ? 'relative' : 'absolute',
            opacity: focused ? 1 : 0,
            // flex: 1,
        },
        close: {
            button: {
                height,
                width: height,
                position: 'absolute',
                right: 0,
                ...styles.centered,
            },
            icon: {
                color: disabled ? colors.button.disabled : colors.button.enabled,
                size: 18,
            },
        },
    });

    function clearSearch() {
        setSearch('');
        update({ search: '' });
    }

    function update(param) {
        if (DataQuery.status === 'pending') {
            return;
        }
        const params = { ...DataQuery.data.params, ...param };
        Fetch.get(uri, params)
            .then(response => queryClient.setQueryData(keys, response));
    }

    return (
        <View style={style.container}>
            <TextInput
                editable={!!disabled === false}
                onBlur={() => setFocused(false)}
                onChangeText={setSearch}
                onFocus={() => setFocused(true)}
                placeholder='Search'
                placeholderTextColor={colors.darkText}
                ref={inputRef}
                style={style.input}
                value={search}
            />
            <View style={style.icon.container}>
                {search.trim().length > 0 ?
                    (<Pressable
                        onPress={clearSearch}
                        style={style.close.button}>
                        <Icon name='close' styles={style.close.icon} />
                    </Pressable>) :
                    (<Pressable onPress={() => setFocused(true)}>
                        <Icon name='search' styles={style.search} />
                    </Pressable>)
                }
            </View>
        </View>
    )
}