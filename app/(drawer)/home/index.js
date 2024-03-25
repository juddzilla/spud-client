import { StyleSheet, View } from 'react-native';

import SwipeableItem, { OpenDirection, useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { BaseButton } from 'react-native-gesture-handler';

import colors from '../../../components/UI/colors';
import styles from '../../../components/UI/styles';

import Icon from '../../../components/UI/icons';
import ListView from '../../../components/UI/List/View';

import Regular from '../../../components/UI/text/Regular';

const ItemTemplate = ({remove},{item}) => {
  const styled = StyleSheet.create({        
    content: {
      marginVertical: 1,
      // marginHorizontal: 4,                  
      marginLeft: 16,
      flexDirection: 'row',
      alignItems: 'center', 
      
      backgroundColor: 'white',
      borderRightWidth: 4,
      borderRightColor: colors.removeHint,
      
    },
    icon: {
      container: {
        minHeight: 44, 
        width:60, 
        marginRight: 0, 
        alignItems: 'center', 
        justifyContent: 'center',
      },
    },        
    info: {
      flexDirection: 'row',
      paddingLeft: 12,
      paddingRight: 8,
      paddingVertical: 12,
    },
    title: { fontSize: 14, letterSpacing: 0.1, color: colors.darkText },
  });

  const RenderUnderlayLeftActions = () => {
    const { percentOpen } = useSwipeableItemParams();

    const animStyle = useAnimatedStyle(
      () => ({
        opacity: percentOpen.value,
      }),
      [percentOpen]
    );

    return (
      <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-end', height: 44}} onPress={() => { remove(item.uuid)}}>
        <Animated.View
          style={{                
            backgroundColor: 'green',
            justifyContent: 'flex-end',            
            width: 60,
            ...animStyle,
          }}>
          <Icon name='trash' styles={{transform: [{ translateX: -24 }]}} />
        </Animated.View>
      </BaseButton>
    );
  };
  
  const RenderUnderlayRightActions = () => {
    const { percentOpen } = useSwipeableItemParams();

    const animStyle = useAnimatedStyle(
      () => ({
        opacity: percentOpen.value,
      }),
      [percentOpen]
    );

    const webSearch = async () => {          
      remove(item.uuid)
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item[createKey])}`;
      await WebBrowser.openBrowserAsync(searchUrl);              
      getData();
    }

    return (
      <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-start'}}>
        <Animated.View
          style={{                
            ...styles.row,
            width: 136,
            ...styles.centered,          
            ...animStyle,
          }}>
            <View style={{...styles.row, 
            paddingLeft: 16,}}>
              <BaseButton onPress={webSearch}>
                <View style={styled.icon.container}>
                  <Icon name='webSearch' />
                </View>
              </BaseButton>                  
              <View style={styled.icon.container}>
                <Icon name='convoAdd' />
              </View>
            </View>
            <View style={{...styles.row, 
            paddingLeft: 16,}}>
              <View style={styled.icon.container}>
                <Icon name='listAdd' />
              </View>
              <View style={styled.icon.container}>                  
                <Icon name='noteAdd' />
              </View>
            </View>
        </Animated.View>
      </BaseButton>
    );
  };

  return (      
      <SwipeableItem
        key={item.id}
        item={item}
        renderUnderlayLeft={() => <RenderUnderlayLeftActions />}
        renderUnderlayRight={() => <RenderUnderlayRightActions />}
        snapPointsLeft={[60]}
        snapPointsRight={[136]}
        overSwipe={20}              
      >          
      <View style={styled.content}>                  
          <View style={styled.info}>                  
              <View style={{ }}>
                <Regular style={styled.title}>{item.headline}</Regular>
              </View>
          </View>
      </View>
    </SwipeableItem>        
)};

export default function Lists() {  
  const options = {
    actions: {
      placeholder: 'Create New Queue Item',
      talkUri: '',
    },
    createKey: 'body',
    filters: {
      placeholder: 'Search Queue',
    },
    ItemTemplate,
    uri: 'queue/',
    viewTitle: 'Quick Queue',    
  };

  return (<ListView options={{...options}} />);
}
