import { Drawer } from 'expo-router/drawer';
import { useLocalSearchParams, useNavigation, router } from 'expo-router';
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

const sectionColorMap = (section) => {
    const mapping = {
        collections: colors.university,
        convos: colors.infrared,
        lists: colors.brand,
        notes: colors.concord,
        queue: colors.tiffany,
    };

    return mapping[section];
};

const Heading = ({ context }) => {
    const local = useLocalSearchParams();

    const DataQuery = useQuery({
        enabled: false,
        queryKey: context.filter(Boolean),
    });

    const backgroundColor = sectionColorMap(context[0]);


    let subheadline = '';
    const title = (Object.hasOwn(local, 'title') && local.title !== 'null') ? local.title : context[0];

    if (DataQuery.data && Object.hasOwn(DataQuery.data, 'count')) {
        subheadline = `Showing ${DataQuery.data.results.length} of ${DataQuery.data.count}`
    } else if (DataQuery.data && DataQuery.data.results) {
        subheadline = `${DataQuery.data.results.length}`;
    }

    const widthConstant = Dimensions.get('window').width * 0.075;
    const slantConstant = 24;

    const styled = StyleSheet.create({
        container: {
            paddingTop: 24,
            backgroundColor,
        },
        content: {
            paddingHorizontal: 20,
            paddingBottom: widthConstant / 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        action: {
            backgroundColor: colors.lightWhite,
            borderRadius: 16,
            ...styles.centered,
            paddingVertical: 18,
            paddingHorizontal: 30,
        },
        curve: {
            backgroundColor,
            flex: 1,
            flexDirection: 'row',
        },
        slant: {
            width: 0,
            height: 0,
            borderBottomWidth: slantConstant,
            borderBottomColor: 'white',
            borderLeftWidth: slantConstant,
            borderLeftColor: 'transparent',
        }
    });


    return (
        <View style={styled.container} >
            <View style={styled.content}>
                <View style={{ flex: 1 }}>
                    <Bold style={{ fontSize: 24, textTransform: 'capitalize' }}>{title}</Bold>
                    <Light style={{ fontSize: 12 }}>{subheadline}</Light>
                </View>

                {!local.uuid &&
                    <View style={{ marginLeft: 16 }}>
                        <Pressable style={styled.action}>
                            <Bold style={{ fontSize: 12 }}>Add New</Bold>
                        </Pressable>
                    </View>
                }

            </View>
            <View style={styled.curve}>
                <View style={styled.slant}></View>
                <View style={{ flex: 1, height: 24, backgroundColor: 'white' }}></View>
            </View>
        </View>
    );
};

export default function ViewHead({ context }) {
    const navigation = useNavigation();

    const section = context[0];
    const uuid = context[1];
    const drawerTitle = uuid ? section : 'Spud';

    function canGoBack() {
        return section !== 'home';
    }

    function goBack() {
        if (canGoBack()) {
            return router.back();
        }

        router.setParams({ title: null, uuid: null });
    }

    return (
        <>
            <Drawer.Screen
                options={{
                    title: drawerTitle,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: sectionColorMap(section),
                        // height: 100,
                        borderBottomColor: 'transparent',
                        borderBottomWidth: 0,
                        shadowColor: 'transparent',
                        shadowOpacity: 0,
                        shadowOffset: { height: 0, width: 0 }
                    },
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
            <Heading context={context} />
        </>
    )
}