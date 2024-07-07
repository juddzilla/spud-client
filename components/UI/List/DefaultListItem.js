import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import SwipeableItem, { useSwipeableItemParams } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { router } from 'expo-router';
import { queryClient } from '../../../contexts/query-client';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import Fetch from '../../../interfaces/fetch';
import { relativeDate } from '../../../utils/dates';

import { fromModelName } from '../type';

const childrenMap = {
    Convo: 'Messages',
    List: 'List Items',
}

export default function DefaultListItem({ index, item }) {
    if (!item) {
        return null;
    }

    const key = fromModelName(item.type);

    function onPress() {
        if (!item.uuid) {
            return;
        }
        if (!queryClient.getQueryData([key, item.uuid])) {
            queryClient.setQueryData([key, item.uuid], item);
        }
        router.push(`${key}/${item.uuid}/`);
    }

    const remove = async () => {
        await Fetch.remove([key, item.uuid]);
        queryClient.setQueryData([key], old => {
            const oldCopy = JSON.parse(JSON.stringify(old));
            return {
                ...old,
                next: null,
                results: oldCopy.results.filter(i => i.uuid !== item.uuid),
            };
        });
    }

    const styled = StyleSheet.create({
        container: {
            ...styles.row,
            backgroundColor: colors.white,
            flex: 1,
            marginBottom: 16,

        },
        checkbox: {},
        content: {
            ...styles.row,
            alignItems: 'flex-start',
            backgroundColor: 'transparent',
            flex: 1,
            paddingLeft: 8,
        },
        date: {
            color: colors.theme.text.medium,
            fontSize: 12,
        },
        details: {
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 12,
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
            alignItems: 'flex-end',
            height: 24,
            marginTop: 14,
            width: 20,
        },
        info: {
            ...styles.row,
            flexWrap: 'wrap',
        },
        link: ({ pressed }) => ({
            backgroundColor: pressed ? 'orange' : 'rgba(242,242,242,0.4)',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            flex: 1,
            marginLeft: 4,
        }),
        placeholder: {
            backgroundColor: colors.white,
            flex: 3
        },
        row: {
            ...styles.row,
            backgroundColor: colors.white,
            flex: 1,
        },
        subtitle: {
            color: colors.theme.text.medium,
            fontSize: 12,
            marginRight: 6
        },
        title: {
            backgroundColor: 'transparent',
            color: colors.darkText,
            flexWrap: 'wrap',
            fontSize: 15,
            marginBottom: 4,
        },
    });

    const RenderUnderlayLeftActions = () => {
        const { percentOpen } = useSwipeableItemParams();

        const animStyle = useAnimatedStyle(
            () => ({
                ...styles.centered,
                // backgroundColor: colors.remove,
                // height: '100%',
                opacity: percentOpen.value,
                width: 60,

            }),
            [percentOpen]
        );

        return (
            <RectButton
                onPress={remove}
                style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    height: 60,
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
        <View>
            <SwipeableItem
                key={item.id}
                item={item}
                renderUnderlayLeft={() => <RenderUnderlayLeftActions />}
                snapPointsLeft={[60]}
                overSwipe={20}
            >
                <View style={styled.row}>
                    <View style={styled.container}>
                        <View style={styled.content}>
                            <View style={styled.indexContainer}>
                                <Regular style={styled.index}>{index + 1}</Regular>
                            </View>
                            <Pressable onPress={onPress} style={styled.link}>
                                {item.uuid ? (
                                    <View style={styled.details}>
                                        <Bold style={styled.title}>{item.title}</Bold>
                                        <View style={styled.info}>
                                            {Object.hasOwn(item, 'children_count') &&
                                                <>
                                                    <Regular style={styled.subtitle}>{`${item.children_count} ${childrenMap[item.type]}`}</Regular>
                                                    <Regular style={styled.date}>| </Regular>
                                                </>
                                            }
                                            <Light style={styled.date}>{relativeDate(item.updated_at)}</Light>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styled.details}>
                                        <View style={{ ...styled.title, ...styled.placeholder, height: 20, width: '50%', backgroundColor: styled.title.color }} />
                                        <View style={{ ...styled.info, width: '90%' }}>
                                            <View style={{ ...styled.subtitle, ...styled.placeholder, height: styled.subtitle.fontSize, backgroundColor: styled.subtitle.color }} />
                                            <View style={{ ...styled.date, ...styled.placeholder, height: styled.date.fontSize, backgroundColor: styled.date.color }} />
                                            <View style={{ ...styled.date, ...styled.placeholder, height: styled.date.fontSize, backgroundColor: styled.date.color }} />
                                        </View>
                                    </View>
                                )}
                            </Pressable>
                        </View>
                        {/* </Link> */}
                    </View>
                </View>
            </SwipeableItem>
        </View>
    )
}