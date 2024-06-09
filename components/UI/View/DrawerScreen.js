import { Drawer } from 'expo-router/drawer';
import { useSegments, useLocalSearchParams, useNavigation, router } from 'expo-router';
import {
    TouchableOpacity, Dimensions,
    Pressable,
    StyleSheet, View
} from 'react-native';
import Icon from '../icons';
import colors from '../colors';
import { useQuery, } from '@tanstack/react-query';
import Bold from '../text/Bold';
import Light from '../text/Light';
import styles from '../styles';

import { titleNameMap } from './title';

import { typeColorMap } from './styles';
export default function DrawerScreen() {
    const local = useLocalSearchParams();
    const segments = useSegments();
    const navigation = useNavigation();

    const section = segments[1];
    const uuid = local.slug;
    const drawerTitle = uuid ? titleNameMap[section] : 'Spud';

    function canGoBack() {
        return section !== 'queue';
    }

    function goBack() {
        if (canGoBack()) {
            return router.back();
        }

        router.setParams({ title: null, uuid: null });
    }

    return (
        <Drawer.Screen
            options={{
                title: drawerTitle,
                headerShown: true,
                headerStyle: { backgroundColor: typeColorMap(section) },
                headerLeft: () => {
                    if (!canGoBack()) {
                        return (
                            <TouchableOpacity onPress={navigation.openDrawer}>
                                <Icon name="navicon" />
                            </TouchableOpacity>
                        )
                    }
                    return (
                        <TouchableOpacity onPress={goBack}>
                            <Icon name="leftArrowLong" />
                        </TouchableOpacity>
                    )
                },
                // headerRight: headerRight || null,
            }}
        />
    )
}