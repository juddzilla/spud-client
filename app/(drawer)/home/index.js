import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { BaseButton } from 'react-native-gesture-handler';
import { router } from 'expo-router';

import CustomModal from '../../../components/UI/actions/Modal';
import colors from '../../../components/UI/colors';
import styles from '../../../components/UI/styles';

import Icon from '../../../components/UI/icons';
import ListView from '../../../components/UI/List/View';

import Light from '../../../components/UI/text/Light';
import Regular from '../../../components/UI/text/Regular';


import Fetcher from '../../../interfaces/fetch';

const ItemTemplate = ({onPress, remove}, {item}) => { 
  // const [showOptions, setShowOptions] = useState(false);

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
    info: {
      flexDirection: 'row',
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
              <BaseButton onPress={() => { remove(item.uuid)}}>
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
        // renderUnderlayRight={() => <RenderUnderlayRightActions />}
        snapPointsLeft={[48]}
        // snapPointsRight={[160]}
        overSwipe={20}              
      >         
      <Pressable onPress={() => onPress(item)}>
        <View style={styled.content}>                
            <View style={styled.info}>                  
                {/* <Light style={styled.itemDot}>&#x25e6;</Light> */}
                <Regular style={styled.title}>{item.headline}</Regular>              
            </View>
        </View>
      </Pressable>
    </SwipeableItem>        
)};

export default function Lists() {  
  const [actionableItem, setActionableItem] = useState(null);
  const [actionPrompt, setActionPrompt] = useState(null);

  
  const options = {
    actions: {
      onPress: setActionableItem,
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

  const styled = StyleSheet.create({
    icon: {
      container: {
        height: 100, 
        width:100,       
        marginBottom: 20, 
        alignItems: 'center', 
        justifyContent: 'center',
        // ...styles.row,      
        backgroundColor: colors.white,
      },
      image: {
        color: colors.text,
      }
    }
  });

  const webSearch = async () => {        
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(actionableItem.headline)}`;    
    await WebBrowser.openBrowserAsync(searchUrl);     
    // show prompt if want to make note         
    // getData();
  };

  const createConversion = (type) => {
    Fetcher.post(`queue/${actionableItem.uuid}/`, {type})
    .then(res => {
      const [err, to] = res;
      
      if (!err) {
        const typeMap = {
          'Convo': 'convo',
          'List': 'list',
          'Note': 'note'
        }

        const target = `${typeMap[to.type]}?uuid=${to.uuid}`;          

        // https://stackoverflow.com/a/77883629
        // below regex is to compensate for know bug when using a router method and a dynamic route
        router.push(target.replace(/\((.*?)\)/g, "[$1]"));
      }
    })
  }

  return (
    <View style={{flex:1}}>
      <CustomModal
        show={actionableItem !== null}
        toggleShow={() => setActionableItem(null)}
      >
        <View style={{backgroundColor: colors.white, flex: 1, ...styles.centered}}>
          <View style={{width: 240, height: 240, justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>            
            <Pressable onPress={webSearch}>
              <View style={styled.icon.container}>
                <Regular>Search Web</Regular>
                <Icon name='webSearch' styles={styled.icon.image}/>
              </View>
            </Pressable>
      
            <Pressable onPress={createConversion.bind(null, 'convo')}>
              <View style={styled.icon.container}>
                <Regular>Start Convo</Regular>
                <Icon name='convoAdd' styles={styled.icon.image}/>
              </View>
            </Pressable>
          
            <Pressable onPress={createConversion.bind(null, 'note')}>
              <View style={styled.icon.container}>
                <Regular>Add Note</Regular>
                <Icon name='noteAdd' styles={styled.icon.image}/>
              </View>
            </Pressable>

            
            <Pressable onPress={createConversion.bind(null, 'list')}>
              <View style={styled.icon.container}>
                <Regular>Add To List</Regular>
                <Icon name='listAdd' styles={styled.icon.image}/>
              </View>
            </Pressable>

          </View>  
        </View>

      </CustomModal>
      <ListView options={{...options}} />
    </View>
  );
}
