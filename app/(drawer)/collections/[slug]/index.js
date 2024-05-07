// list of convos
import ListView from '../../../../components/UI/List/View';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { BaseButton } from 'react-native-gesture-handler';
import SwipeableItem, { OpenDirection, useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import colors from '../../../../components/UI/colors';
import styles from '../../../../components/UI/styles';

import Icon from '../../../../components/UI/icons';
import Bold from '../../../../components/UI/text/Bold';
import Light from '../../../../components/UI/text/Light';

const ItemTemplate = ({remove}, {item}) => {
  const local = useLocalSearchParams();

  
  const { id, type } = item;

  const styled = StyleSheet.create({
    pressable: {
      backgroundColor: 'white',
      marginVertical: 4,
      marginHorizontal: 4,        
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
    const route = `collections/${local.uuid}/${typeToRouteMap[type]}/${item.uuid}`;
    
    // return;
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
      <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-end', height: 64}} onPress={() => { remove(id)}}>
        <Animated.View
          style={{                
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
              <View style={styled.icon.container}>
                  <Icon name={typeToIconMap[type]} styles={styled.icon.image} />                        
              </View>
              <View style={styled.info}>
                  <Bold style={styled.title}>{item.headline}</Bold>
                  <Light style={styled.subtitle}>{ item.subheadline } Items</Light>
              </View>
          </View>
      </Pressable>            
    </SwipeableItem>        
)};

export default function Collection() {  
  const options = {
    actions: {
      placeholder: 'Create Collections',
      talkUri: '',
    },
    filters: {
      placeholder: 'Search Collections',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['title', 'updated_at'],
      },
    },    
    ItemTemplate,
    uri: `collections/${local.slug}`,
  };

  return (<ListView options={{...options}} />);
}
