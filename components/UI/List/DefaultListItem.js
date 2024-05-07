import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import SwipeableItem, { useSwipeableItemParams } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { queryClient } from '../../../contexts/query-client';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import Fetch from '../../../interfaces/fetch';
import { relativeDate } from '../../../utils/dates';

const DefaultListItem = ({ index, item }) => {   
    if (!item) {
        return null;
    }

    const typeMap = {
        List: 'Lists',
        Convo: 'Convos',
        Note: 'Notes',
    };

    const keyMap = {
        List: 'lists',
        Convo: 'convos',
        Note: 'notes',
    };

    function onPress() {
        const keys = [keyMap[item.type], item.uuid];
        queryClient.setQueryData(['details'], { context: keys, data: item });
        queryClient.setQueryData(keys, { context: keys, data: item });
    }

    const remove = async () => {
        const type = typeMap[item.type];
        const key = keyMap[item.type];          
        await Fetch.remove(`${type.toLowerCase()}/${item.uuid}/`);        
        queryClient.setQueryData([key], oldData => oldData.filter(i => i.uuid !== item.uuid));        
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
        row : {
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
            style={ {
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

    // function onLongPress() {
    //     toggleSelected(uuid);
    // }

    return (      
        <SwipeableItem
            key={item.id}
            item={item}
            renderUnderlayLeft={() => <RenderUnderlayLeftActions />}
            snapPointsLeft={[60]}
            overSwipe={20}              
        >          
            <View style={styled.row}>            
                <Pressable
                    style={styled.container}
                    // onPress={() => DetailObservable.notify(item)} 
                    onPress={onPress}
                >      
                    <View style={styled.content}>
                        
                        <View style={styled.indexContainer}>

                            <Regular style={styled.index}>{ index+1 } </Regular>
                        </View>
                        <View>
                            <Bold style={styled.title}>{item.headline}</Bold>
                            <View style={styled.info}>
                                { item.subheadline &&
                                    <Regular style={styled.subtitle}>{ item.subheadline }</Regular>
                                }
                                <Light style={styled.date}>{ relativeDate(item.updated_at) }</Light>
                            </View>
                        </View>
                    </View>
                </Pressable>            

            </View>
        </SwipeableItem>        
    )
};

export default DefaultListItem;