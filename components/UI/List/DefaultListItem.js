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

import { relativeDate } from '../../../utils/dates';

export default function DefaultListItem({remove}, {item}) { 
    const { type } = item;

    const styled = StyleSheet.create({
        pressable: {
            backgroundColor: 'white',
            borderRightWidth: 4,
            borderRightColor: colors.removeHint,
            marginVertical: 4,
            marginLeft: 16,
            borderRadius: 2,
            flexDirection: 'row',
            alignItems: 'center', 
            
            shadowColor: colors.darkBg,
            shadowOffset: {
                width: 0,
                height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.00,
            elevation: 24,
        },
        content: {
            flexDirection: 'row',             
        },
        info: {
            paddingTop: 13,
            paddingBottom: 9,
        },
        icon: {
        container: {
            height: 44, 
            width:40, 
            marginRight: 0, 
            alignItems: 'center', 
            justifyContent: 'center',
        },
        image: { color: colors.darkText, size: 20 }
        },
        subtitle: { fontSize: 12, color: colors.lightText, },
        title: { backgroundColor: 'transparent', fontSize: 14, color: colors.darkText, marginBottom: 4 },
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

    const subtitleMap = {
        children_count: `${item.children_count} Items`,
        created_at: relativeDate(item.created_at)
    };

    const subheadline = Object.hasOwn(item, 'children_count') ? subtitleMap.children_count : subtitleMap.created_at;

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
                <View style={styled.icon.container}>
                    <Icon name={typeToIconMap[type]} styles={styled.icon.image} />                        
                </View>
                <View style={styled.info}>
                    <Bold style={styled.title}>{item.headline}</Bold>
                    <Light style={styled.subtitle}>{ subheadline }</Light>
                </View>
            </View>
        </Pressable>            
        </SwipeableItem>        
    )
};

