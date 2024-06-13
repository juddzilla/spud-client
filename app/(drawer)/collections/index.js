import ListView from '../../../components/UI/List/View';

import {
    StyleSheet,
    View,
} from 'react-native';
import { Link } from 'expo-router';

import { RectButton } from 'react-native-gesture-handler';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import colors from '../../../components/UI/colors';
import styles from '../../../components/UI/styles';

import Icon from '../../../components/UI/icons';
import Regular from '../../../components/UI/text/Regular';
import Bold from '../../../components/UI/text/Bold';
import Light from '../../../components/UI/text/Light';;

import { relativeDate } from '../../../utils/dates';

import DrawerScreen from '../../../components/UI/View/DrawerScreen';

const ItemTemplate = ({ index, item }) => {
    if (!item) {
        return null;
    }

    const key = item.type.toLowerCase() + 's';

    function onPress() {
        const keys = [key, item.uuid];
        queryClient.setQueryData(['details'], { context: keys, title: item.title, type: item.type });
        queryClient.setQueryData(keys, { context: keys, ...item });
    }

    const remove = async () => {
        await Fetch.remove([key, item.uuid]);
        queryClient.setQueryData([key], old => {
            const oldCopy = JSON.parse(JSON.stringify(old));
            return oldCopy.filter(i => i.uuid !== item.uuid)
        });
    }

    const styled = StyleSheet.create({
        container: {
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
            color: item.selected ? colors.text : colors.theme.text.light,
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

    const RenderUnderlayLeftActions = () => {
        const { percentOpen } = useSwipeableItemParams();

        const animStyle = useAnimatedStyle(
            () => ({
                ...styles.centered,
                backgroundColor: colors.remove,
                height: '100%',
                width: 60,
                opacity: percentOpen.value,

            }),
            [percentOpen]
        );

        return (
            <RectButton
                onPress={remove}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    marginBottom: 2,
                }}
            >
                <Animated.View
                    style={{

                        ...animStyle
                    }}>
                    <Icon name='trash' />
                </Animated.View>
            </RectButton>
        );
    };

    return (
        <SwipeableItem
            key={item.id}
            item={item}
            renderUnderlayLeft={() => <RenderUnderlayLeftActions />}
            snapPointsLeft={[60]}
            overSwipe={20}
        >
            <View style={styled.row}>
                <Link href={`collections/${item.uuid}`}>
                    <View style={styled.content}>

                        <View style={styled.indexContainer}>

                            <Regular style={styled.index}>{index + 1} </Regular>
                        </View>
                        <View>
                            <Bold style={styled.title}>{item.title}</Bold>
                            <View style={styled.info}>
                                {item.subheadline &&
                                    <Regular style={styled.subtitle}>{item.subheadline}</Regular>
                                }
                                <Light style={styled.date}>{relativeDate(item.updated_at)}</Light>
                            </View>
                        </View>
                    </View>
                </Link>
            </View>
        </SwipeableItem>
    )
};

export default function Collections() {
    const options = { ItemTemplate };

    const styled = StyleSheet.create({
        backgroundColor: colors.collections,
        flex: 1,
    });

    return (
        <>
            <DrawerScreen />
            <View style={styled}>
                <ListView options={{ ...options }} />
            </View>
        </>
    );
}
