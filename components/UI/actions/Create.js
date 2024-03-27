import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

import colors from '../colors';
import Icon from '../icons';
import Bold from '../text/Bold';

import styles from '../styles';

export default function TalkButton() {
  const [showModal, setShowModal] = useState(false);

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
              
              // borderWidth: 1, 
              // borderColor: (pressed || showModal) ? 'black' : 'white',  
              
            //   alignItems: 'center', 
            // paddingLeft: 16,
              

              shadowColor: colors.darkestBg,
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.3,
              shadowRadius: 6.27,

              elevation: 10,
              zIndex: 10,
            //   position: 'absolute',
            //   bottom: 0,
            //   right: 40,
              // backgroundColor: 'black',
              // height: 48,
              // overflow: 'hidden'
            })}
          >
            <View
                style={{
                    backgroundColor: 'black',
                    borderTopLeftRadius: '50%',
                    borderTopRightRadius: 2,
                    borderBottomLeftRadius: '50%',
                    borderBottomRightRadius: '50%',
                    // borderRadius: '50%',                     
                    width: 54, 
                    height: 54,                     
                    ...styles.centered,
                }}
            >
              <Icon
                name='plus'
                styles={{
                  size: 24, 
                  // position: 'absolute', 
                  // bottom: 36, 
                  // left: 6, 
                  color: 'white',
                  // transform: [{ rotate: "-90deg" }]
                }}
              />
            </View>
          </Pressable>
          
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.5)',
              opacity: 1,
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