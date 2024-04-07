import {
Pressable,
StyleSheet,
View,
} from 'react-native';

import { router, useNavigation } from 'expo-router';
import { BaseButton, RectButton } from 'react-native-gesture-handler';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import colors from '../colors';
import Icon from '../icons';

import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import styles from '../styles';

import { relativeDate } from '../../../utils/dates';

export default function DefaultListItem({remove}, {item}) {         
    const { type } = item;
    
    const styled = StyleSheet.create({
        container: {
            // marginBottom: 2,
            ...styles.row,
            padding: 12,            
            // marginLeft: 12,
            // backgroundColor: 'white', 
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
        },
        date: {
            color: colors.theme.text.medium,
            fontSize: 12, 
        },
        icon: {
            color: item.selected ? colors.text : colors.theme.text.light,    
            size: 15,    
          },
        info: {
            ...styles.row,
            flexWrap: 'wrap',
        },
        row : {
            // backgroundColor: item.selected ? colors.lightWhite : 'transparent',
            backgroundColor: colors.lightWhite,
            ...styles.row,
            // paddingHorizontal: 4,
            marginBottom: 2,
        },
        subtitle: { fontSize: 12, color: colors.theme.text.medium, marginRight: 6 },
        title: { flexWrap: 'wrap', backgroundColor: 'transparent', fontSize: 16, color: colors.theme.text.dark, marginBottom: 4 },
    });

    function toDetail() {               
        const typeToRouteMap = {
            Collection: 'collections',
            Convo: 'convo',
            List: 'list',
            Note: 'note'
        };  

        if (!typeToRouteMap[type]) {
            return;
        }

        const route = `/${typeToRouteMap[type]}?uuid=${item.uuid}`;        
        console.log('item', route);
        router.push(route);
    }

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
            onPress={() => { remove(item.uuid)}}
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
                onPress={toDetail} 
            >      
                <View style={styled.content}>
                    <Bold style={styled.title}>{item.headline}</Bold>
                    <View style={styled.info}>
                        { item.subheadline &&
                            <Regular style={styled.subtitle}>{ item.subheadline }</Regular>
                        }
                        <Light style={styled.date}>{ relativeDate(item.updated_at) }</Light>
                    </View>
                </View>
            </Pressable>            

        </View>
        </SwipeableItem>        
    )
};

