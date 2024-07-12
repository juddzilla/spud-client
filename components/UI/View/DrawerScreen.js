import { Drawer } from 'expo-router/drawer';
import { useSegments, useLocalSearchParams, useNavigation, router } from 'expo-router';
import { Pressable, TouchableOpacity, View } from 'react-native';
import Icon from '../icons';
import Search from '../List/Search';
import colors from '../colors';
import Light from '../text/Light';
import Regular from '../text/Regular';
import Black from '../text/Black';
import Bold from '../text/Bold';
import { colorway, hasSearch, singular } from '../type';

export default function DrawerScreen() {
    const local = useLocalSearchParams();
    const segments = useSegments();
    const navigation = useNavigation();

    const type = segments[1];
    const uuid = local.slug;

    const title = uuid ? singular(type) : 'Spud';

    function canGoBack() {
        return type !== 'queue';
    }

    function goBack() {
        if (canGoBack()) {
            return router.back();
        }

        router.setParams({ title: null, uuid: null });
    }

    function headerLeft() {
        let name = 'leftArrowLong';
        let onPress = goBack;

        if (!canGoBack()) {
            name = 'navicon';
            onPress = navigation.openDrawer;
        }
        return (
            <TouchableOpacity onPress={onPress}>
                <Icon name={name} styles={{ color: colors.darkText }} />
            </TouchableOpacity>
        )
    }

    function headerRight() {
        if (uuid) {
            return (
                <TouchableOpacity>
                    <Icon name='trash' styles={{ color: colors.darkText, size: 20 }} />
                </TouchableOpacity>
            )
        } else if (!hasSearch([type, uuid])) {
            return null;
        }

        return (<Search />)
    }

    return (
        <Drawer.Screen
            options={{
                headerTitle: () => (<Bold style={{ fontSize: 18, color: colors.darkText }}>{title}</Bold>),
                headerShown: true,
                headerStyle: { backgroundColor: colors.stone },
                // headerStyle: { backgroundColor: colorway(type) },
                headerLeft,
                headerRight,
            }}
        />
    )
}