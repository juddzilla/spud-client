import { useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View } from 'react-native';

import colors from '../colors';
import Icon from '../icons';
import Bold from '../text/Bold';

import styles from '../styles';

export default function TalkButton({focused, setFocused}) {
  const [showModal, setShowModal] = useState(false);
  

  const micIcon = {
    backgroundColor: '',
    color: !showModal ? 'white' : 'black', 
    name: !showModal ? 'mic' : 'micOff',
  };

    return (
      <View
        style={{          
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',          
        }}>
          <Pressable            
            onPress={() => {setShowModal(!showModal)}}
            style={({ pressed }) => ({
              justifyContent: 'center',               
              // shadowColor: colors.darkestBg,
              // shadowOffset: {
              //   width: 0,
              //   height: 5,
              // },
              // shadowOpacity: 0.3,
              // shadowRadius: 6.27,

              // elevation: 10,
              // zIndex: 10,
              // position: 'absolute',
              // bottom: 40,
              // right: 0,
              // backgroundColor: 'black',
              // height: 48,
              // overflow: 'hidden'
            })}
          >
            <View
                style={{
                  backgroundColor: showModal ? 'black' : colors.brand,
                  borderBottomLeftRadius: '50%',
                  borderBottomRightRadius: 8,
                  borderTopLeftRadius: '50%',
                  borderTopRightRadius: '50%',
                  // borderRadius: '50%',                     
                  width: 40, 
                  height: 40, 
                  ...styles.centered,
                  marginLeft: 8,
                }}
            >
              <Icon
                name={micIcon.name}
                styles={{
                  size: 24, 
                  // position: 'absolute', 
                  // bottom: 36, 
                  // left: 6, 
                  // color: 'white',
                  // transform: [{ rotate: "-90deg" }]
                }}
              />
            </View>
          </Pressable>
          
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.5)',
              opacity: showModal ? 1 : 0,
              position: 'absolute',
              top: (Dimensions.get('window').height - 64 - 16 - 1) * -1,                            
              left: (Dimensions.get('window').width  - 16 - 1) * -1,
              width: Dimensions.get('window').width,
              height: showModal ? Dimensions.get('window').height : 0,
              zIndex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: colors.brand,
                opacity: 1,
                position: 'absolute',
                bottom: 44,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height / 2,
                height: 74,
                paddingLeft: 16,                
                justifyContent: 'center',
                alignItems: 'center',                
                paddingRight: 92,                
              }}
            >
              <Bold style={{textAlign: 'center',}}>You can add, remove, reorder, or delete list items</Bold>
            </View>
          </View>                         
      </View>     
    )
}