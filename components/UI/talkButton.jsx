import { useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import colors from './colors';
import Icon from './icons';

import Bold from './text/Bold';
export default function TalkButton() {
  const [showModal, setShowModal] = useState(false);

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      marginTop: 22,
      height: '50%',
      zIndex: 1,
    },
    rowItem: {
      height: 100,
      alignItems: "center",
      justifyContent: "center",
    },
    modalView: {
      // margin: 20,
      height: '50%',
      // flex: 2,
      
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

  

  const micIcon = {
    backgroundColor: '',
    color: !showModal ? 'white' : 'black', 
    name: !showModal ? 'mic' : 'micOff',
  }
    return (
      <View
        style={{
          backgroundColor: 'green',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',          
        }}>
          <Pressable            
            onPress={() => {setShowModal(!showModal)}}
            style={({ pressed }) => ({
              backgroundColor: showModal ? 'black' : colors.brand,
              borderWidth: 1, 
              borderColor: (pressed || showModal) ? 'black' : 'white',  
              width: 64, 
              height: 64, 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: 100,
              shadowColor: colors.darkestBg,
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.2,
              shadowRadius: 6.27,

              elevation: 10,
              zIndex: 10,
              position: 'absolute',
              right: 0,
            })}
          >
            <Icon name={micIcon.name} styles={{size: 30, color: 'white' }} />
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