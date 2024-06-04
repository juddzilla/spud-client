import {
    useEffect
} from 'react';

import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useNavigation } from 'expo-router';
import { useSegments } from 'expo-router';

import { queryClient } from '../../contexts/query-client';
import { useQuery } from '@tanstack/react-query';
import colors from './colors';

export default function GlobalHeader({ keys, title }) {
    const insets = useSafeAreaInsets();

    const DataQuery = useQuery({
        enabled: false,
        queryKey: keys,
    });

    let subheadline = '';

    if (DataQuery.data && Object.hasOwn(DataQuery.data, 'count')) {
        subheadline = `Showing ${DataQuery.data.results.length} of ${DataQuery.data.count}`
    } else if (DataQuery.data && DataQuery.data.results) {
        subheadline = `${DataQuery.data.results.length}`;
    }

    const styled = StyleSheet.create({
        container: {
            paddingTop: insets.top * 0.25,
            paddingLeft: 24,
            height: Dimensions.get('window').width * 0.33,
            backgroundColor: colors.brand,
        }
    });
    return (
        <View style={styled.container} >

            <View style={{}} onLayout={({ nativeEvent }) => { console.log("nativsEvent", nativeEvent.layout.height) }}>
                <Text style={{ fontSize: 36 }}>{title || 'Global HEader'}</Text>

                <Text style={{ fontSize: 18 }}>{subheadline}</Text>
            </View>
        </View>
    )
}