import {
Pressable,
StyleSheet,
View,
} from 'react-native';

import { router } from 'expo-router';
import { BaseButton } from 'react-native-gesture-handler';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import colors from '../colors';
import Icon from '../icons';

import Bold from '../text/Bold';
import Light from '../text/Light';

import styles from '../styles';

import { relativeDate } from '../../../utils/dates';

export default function DefaultListItem({remove}, {item}) {         
    const { type } = item;

    const styled = StyleSheet.create({
        pressable: {
            marginBottom: 2,
            marginLeft: 12,
            ...styles.row,
            padding: 12,
        },
        content: {
            flex: 1,
        },
        date: {
            color: colors.theme.text.medium,
            fontSize: 12, 
        },
        info: {
            ...styles.row,
        },
        subtitle: { fontSize: 12, color: colors.theme.text.medium, marginRight: 6 },
        title: { backgroundColor: 'transparent', fontSize: 16, color: colors.theme.text.dark, marginBottom: 6 },
    });

    function toDetail() {               
        const typeToRouteMap = {
            Collection: 'collections',
            Convo: 'convos',
            List: 'lists',
            Note: 'notes'
        };  

        if (!typeToRouteMap[type]) {
            return;
        }
        const route = `${typeToRouteMap[type]}/${item.uuid}`;            
        router.push(route);
    }

    const RenderUnderlayLeftActions = () => {
        const { percentOpen } = useSwipeableItemParams();

        const animStyle = useAnimatedStyle(
        () => ({
            opacity: percentOpen.value,
        }),
        [percentOpen]
        );

        return (
        <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-end', height: 64}} onPress={() => { remove(item.uuid)}}>
            <Animated.View
            style={{                
                backgroundColor: 'green',
                justifyContent: 'flex-end',
                // alignItems: 'flex-end',
                width: 60,
                // flex: 1,
                ...animStyle,
            }}>
            <Icon name='trash' styles={{transform: [{ translateX: -24 }]}} />
            </Animated.View>
        </BaseButton>
        );
    };

    const typeToIconMap = {
        Collection: 'collection',
        Convo: 'convo',
        List: 'list',
        Note: 'notes',
        Queue: 'queue',
    };

    return (      
        <SwipeableItem
            key={item.id}
            item={item}
            renderUnderlayLeft={() => <RenderUnderlayLeftActions />}
            snapPointsLeft={[60]}
            overSwipe={20}              
        >          
        <Pressable
            style={styled.pressable}
            onPress={toDetail} 
        >      
            <View style={styled.content}>
                <Bold style={styled.title}>{item.headline}</Bold>
                <View style={styled.info}>
                    { item.subheadline &&
                        <Light style={styled.subtitle}>{ item.subheadline }</Light>
                    }
                    <Light style={styled.date}>{ relativeDate(item.updated_at) }</Light>
                </View>
            </View>
        </Pressable>            
        </SwipeableItem>        
    )
};

