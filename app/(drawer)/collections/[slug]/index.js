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
import { Link } from 'expo-router';

import { BaseButton, RectButton } from 'react-native-gesture-handler';
import SwipeableItem, { OpenDirection, useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { queryClient } from '../../../../contexts/query-client';
import colors from '../../../../components/UI/colors';
import styles from '../../../../components/UI/styles';

import Icon from '../../../../components/UI/icons';
import Bold from '../../../../components/UI/text/Bold';
import Regular from '../../../../components/UI/text/Regular';
import Light from '../../../../components/UI/text/Light';

import { relativeDate } from '../../../../utils/dates';
// const ItemTemplate = ({remove}, {item}) => {
//   const local = useLocalSearchParams();

  
//   const { id, type } = item;

//   const styled = StyleSheet.create({
//     pressable: {
//       backgroundColor: 'white',
//       marginVertical: 4,
//       marginHorizontal: 4,        
//       borderRadius: 2,
//       flexDirection: 'row',
//       alignItems: 'center', 
      
//       shadowColor: colors.darkBg,
//       shadowOffset: {
//           width: 0,
//           height: 12,
//       },
//       shadowOpacity: 0.58,
//       shadowRadius: 16.00,
//       elevation: 24,
//     },
//     content: {
//       flexDirection: 'row', 
//     },
//     info: {
//       paddingTop: 13,
//       paddingBottom: 9,
//     },
//     icon: {
//       container: {
//         height: 44, 
//         width:40, 
//         marginRight: 0, 
//         alignItems: 'center', 
//         justifyContent: 'center',
//       },
//       image: { color: colors.darkText, size: 20 }
//     },
//     subtitle: { fontSize: 12, color: colors.lightText, },
//     title: { backgroundColor: 'transparent', fontSize: 14, color: colors.darkText, marginBottom: 4 },
//   });

//   function toDetail() {          
//     const typeToRouteMap = {
//       Collection: 'collections',
//       Convo: 'convos',
//       List: 'lists',
//       Note: 'notes'
//     };  

//     if (!typeToRouteMap[type]) {
//       return;
      
//     }
//     const route = `collections/${local.uuid}/${typeToRouteMap[type]}/${item.uuid}`;
    
//     // return;
//     router.push(route);
//   }

//   const RenderUnderlayLeftActions = () => {
//     const { percentOpen } = useSwipeableItemParams();

//     const animStyle = useAnimatedStyle(
//       () => ({
//         opacity: percentOpen.value,
//       }),
//       [percentOpen]
//     );

//     return (
//       <BaseButton style={{ justifyContent: 'center', alignItems: 'flex-end', height: 64}} onPress={() => { remove(id)}}>
//         <Animated.View
//           style={{                
//             justifyContent: 'flex-end',
//             // alignItems: 'flex-end',
//             width: 60,
//             // flex: 1,
//             ...animStyle,
//           }}>
//           <Icon name='trash' styles={{transform: [{ translateX: -24 }]}} />
//         </Animated.View>
//       </BaseButton>
//     );
//   };
  

//   const typeToIconMap = {
//     Collection: 'collection',
//     Convo: 'convo',
//     List: 'list',
//     Note: 'notes',
//   };
  
//   return (      
//       <SwipeableItem
//         key={item.id}
//         item={item}
//         renderUnderlayLeft={() => <RenderUnderlayLeftActions />}
//         snapPointsLeft={[60]}
//         overSwipe={20}              
//       >          
//       <Pressable
//           style={styled.pressable}
//           onPress={toDetail} 
//       >      
//           <View style={styled.content}>
//               <View style={styled.icon.container}>
//                   <Icon name={typeToIconMap[type]} styles={styled.icon.image} />                        
//               </View>
//               <View style={styled.info}>
//                   <Bold style={styled.title}>{item.headline}</Bold>
//                   <Light style={styled.subtitle}>{ item.subheadline } Items</Light>
//               </View>
//           </View>
//       </Pressable>            
//     </SwipeableItem>        
// )};


const ItemTemplate = ({ index, item }) => {    
  console.log('IIIIT');
  if (!item) {
      return null;
  }
  console.log('item222',item);
  const key = item.type.toLowerCase()+'s';

  function onPress() {
      const keys = [key, item.related_item.uuid];
      queryClient.setQueryData(['details'], { context: keys, title: item.title, type: item.type });        
      queryClient.setQueryData(keys, { context: keys, ...item.related_item });        
  }

  const remove = async () => {                
      await Fetch.remove(`${key}/${item.uuid}/`);        
      queryClient.setQueryData([key], old => {
          const oldCopy = JSON.parse(JSON.stringify(old));            
          return oldCopy.filter(i => i.uuid !== item.uuid)
      });        
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
                onPress={onPress}
            >   
                <View style={styled.content}>
                
                <View style={styled.indexContainer}>

                    <Regular style={styled.index}>{ index+1 } </Regular>
                </View>
                <View>
                    <Bold style={styled.title}>{item.related_item.title}</Bold>
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
export default function Collection() {  
  console.log("1111");
  const local = useLocalSearchParams();
  console.log('local', local);
  const options = {
    actions: {
      placeholder: 'Create Collections',
      
    },
    filters: {
      placeholder: 'Search Collections',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['title', 'updated_at'],
      },
    },    
    storeKey: ['collections', local.slug],
    ItemTemplate,
  };
  // return (
  //   <View>
  //     <Bold>Colleciton</Bold>
  //   </View>
  // )
  return (<ListView options={{...options}} />);
}
