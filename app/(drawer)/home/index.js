import { StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { BaseButton } from 'react-native-gesture-handler';
import { router } from 'expo-router';

import colors from '../../../components/UI/colors';
import styles from '../../../components/UI/styles';

import Icon from '../../../components/UI/icons';
import ListView from '../../../components/UI/List/View';

import Light from '../../../components/UI/text/Light';
import Regular from '../../../components/UI/text/Regular';


import Fetcher from '../../../interfaces/fetch';

const ItemTemplate = ({remove},{item}) => {  
  const styled = StyleSheet.create({        
    content: {
      marginVertical: 1,                  
      marginLeft: 16,
      flexDirection: 'row',
      alignItems: 'center', 
      borderRightWidth: 4,
      borderRightColor: colors.removeHint,
      
    },
    icon: {
      container: {
        minHeight: 44, 
        width:44, 
        marginRight: 0, 
        alignItems: 'center', 
        justifyContent: 'center',
        ...styles.row,

      },
    },        
    info: {
      flexDirection: 'row',
      paddingRight: 8,
      paddingVertical: 12,
    },
    itemDot: {
      marginRight: 10,
      color: colors.theme.text.medium
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
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.headline)}`;
      await WebBrowser.openBrowserAsync(searchUrl);     
      // show prompt if want to make note         
      getData();
    };

    const createConversion = (type) => {
      Fetcher.post(`queue/${item.uuid}/`, {type})
      .then(res => {
        const [err, to] = res;
        console.log('err', err);
        console.log('item', to);
        if (!err) {
          const typeMap = {
            'Convo': 'convos',
            'List': 'lists',
            'Note': 'notes'
          }

          const target = `./${typeMap[to.type]}/${to.uuid}`;
          console.log('target', target);

          router.navigate(target);
        }
      })
    }

    return (
      <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-start'}}>
        <Animated.View
          style={{                
            ...styles.row,
            width: 260,
            ...styles.centered,          
            ...animStyle,
          }}>
            <View
          style={{                
            ...styles.row,
            // width: 540,
            // ...styles.centered,          
          }}>

            <BaseButton onPress={webSearch}>
                <View style={styled.icon.container}>
                  <Icon name='webSearch' />
                </View>
              </BaseButton>    
              <BaseButton onPress={() => createConversion('convo')}>
                <View style={styled.icon.container}>
                  <Icon name='convoAdd' />
                </View>
              </BaseButton>
              <BaseButton onPress={() => createConversion('note')}>
                <View style={styled.icon.container}>
                <Icon name='noteAdd' />
                </View>
              </BaseButton>
              <BaseButton onPress={() => createConversion('list')}>
                <View style={styled.icon.container}>
                <Icon name='listAdd' />
                </View>
              </BaseButton>
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
        snapPointsRight={[164]}
        overSwipe={20}              
      >          
      <View style={styled.content}>                  
          <View style={styled.info}>                  
              <Light style={styled.itemDot}>&#x25e6;</Light>
              <Regular style={styled.title}>{item.headline}</Regular>              
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
