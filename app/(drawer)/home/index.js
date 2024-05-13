import { Pressable, StyleSheet, View } from 'react-native';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { BaseButton } from 'react-native-gesture-handler';
import colors from '../../../components/UI/colors';
import styles from '../../../components/UI/styles';

import Icon from '../../../components/UI/icons';
import ListView from '../../../components/UI/List/View';

import Light from '../../../components/UI/text/Light';
import Regular from '../../../components/UI/text/Regular';

import Fetch from '../../../interfaces/fetch';

import { queryClient } from '../../../contexts/query-client';

import DrawerScreen from '../../../components/DrawerScreen';

import Home, { Observer } from '../../../components/UI/Details/Home';

const ItemTemplate = ({index, item}) => { 
  const onPress = () => {  
    Observer.notify(item);
  };
  const remove = async () => {
    await Fetch.remove(`queue/${item.uuid}/`);        
    queryClient.setQueryData(['queue'], oldData => oldData.filter(i => i.uuid !== item.uuid));        
  };

  const styled = StyleSheet.create({        
    content: {
      marginVertical: 2, 
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
    indexContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 24,
      minWidth: 16,      
      
    },
    index: {
      color: colors.darkText,
      fontSize: 10,
      letterSpacing: 0.1,
    },    
    info: {
      ...styles.row,
      paddingRight: 8,
      paddingLeft: 20,
      // marginLeft: 8,
      paddingVertical: 12,
      backgroundColor: colors.lightWhite,      
      flex: 1,
    },
    itemDot: {
      marginRight: 10,
      color: colors.theme.text.medium
    },
    title: {
      color: colors.darkText,
      fontSize: 14,
      letterSpacing: 0.1,
    },    
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
      <BaseButton
        style={{
          justifyContent: 'center', 
          alignItems: 'flex-end', 
        }} 
        
      >
        <Animated.View
          style={animStyle}>
            <View
              style={{                
                ...styles.row,
                paddingLeft: 8,
                backgroundColor: colors.remove,
              }}
            >
              <BaseButton onPress={remove}>
                <View style={styled.icon.container}>
                  <Icon name='trash' />
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
        snapPointsLeft={[48]}
        overSwipe={20}              
      >         
      <Pressable onPress={onPress}>
        <View style={styled.content}>                
            <View style={styled.info}>  
                <View style={styled.indexContainer}>
                  <Light style={styled.index}>{ index+1 }</Light>
                </View>  
                <Regular style={styled.title}>{item.headline}</Regular>              
            </View>
        </View>
      </Pressable>
    </SwipeableItem>        
)};

export default function HomeView() { 
  const options = {
    actions: {
      placeholder: 'Create New Queue Item',
      
    },
    filters: {
      placeholder: 'Search Queue',
    },
    ItemTemplate,
    noRedirect: true,
    storeKey: ['queue'],
    talk: {
      message: 'Tell us how youd like us to add, modify, or delete Quick Queue items',
      view: 'home',
    }
  };  

  return (
    <View style={{flex:1}}>      
      { DrawerScreen('Quick Queue') }
      <ListView options={{...options}} />
      {/* <Home /> */}
    </View>
  );
}
