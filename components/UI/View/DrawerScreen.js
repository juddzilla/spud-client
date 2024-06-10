import { Drawer } from 'expo-router/drawer';
import { useSegments, useLocalSearchParams, useNavigation, router } from 'expo-router';
import {
    Alert,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import Icon from '../icons';
import colors from '../colors';
import { useQuery, } from '@tanstack/react-query';
import Bold from '../text/Bold';
import Light from '../text/Light';
import styles from '../styles';
import Search from '../List/Search';

import { drawerTitle, hasSearch } from '../type';
import { colorway } from '../type';


export default function DrawerScreen() {
    const local = useLocalSearchParams();
    const segments = useSegments();
    const navigation = useNavigation();

    const type = segments[1];
    const uuid = local.slug;

    const title = uuid ? drawerTitle[type] : 'Spud';

    function canGoBack() {
        return type !== 'queue';
    }

    function goBack() {
        if (canGoBack()) {
            return router.back();
        }

        router.setParams({ title: null, uuid: null });
    }

    function headerRight() {
        if (!hasSearch([type, uuid])) {
            return null;
        }


        return (<Search />)
    }

    return (
        <Drawer.Screen
            options={{
                title,
                headerShown: true,
                headerStyle: { backgroundColor: colorway(type) },
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
                headerRight,
            }}
        />
    )
}