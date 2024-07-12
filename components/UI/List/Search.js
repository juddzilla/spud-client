import { useEffect, useState } from 'react';
import { Alert, Pressable } from 'react-native';

import { useLocalSearchParams, useSegments } from 'expo-router';

import Icon from '../icons';

import { queryClient } from '../../../contexts/query-client';

import Fetch from '../../../interfaces/fetch';
import colors from '../colors';

export default function Search() {
    const [search, setSearch] = useState(null);
    const local = useLocalSearchParams();
    const segments = useSegments();
    const context = [segments[1], local.slug].filter(Boolean);

    useEffect(() => {
        update(search);
    }, [search]);


    function update(value) {
        const current = queryClient.getQueryData(context);

        if (!current) {
            return;
        }
        const params = { ...current.params, search: value };

        Fetch.get(context, params)
            .then(response =>
                queryClient.setQueryData(context, { ...response, params })
            );
    }

    function onPress() {
        const title = 'Search';
        const options = [
            {
                onPress: (text) => {
                    setSearch(text.trim());
                },
                style: 'default',
                text: 'Submit'
            },
            {
                style: 'cancel',
                text: 'Cancel'
            }
        ];

        if (search) {
            options.splice(1, 0, {
                onPress: () => setSearch(''),
                style: 'default',
                text: 'Clear'
            })
        }
        Alert.prompt(
            title,
            null,
            options,
            'plain-text',
            search,
        )
    }

    return (
        <Pressable onPress={onPress}>
            <Icon name='search' styles={{ size: 18, color: colors.darkText }} />
        </Pressable>
    );
}