import { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { TalkContext } from '../../../contexts/talk';
import Bold from '../text/Bold';
import { WebsocketContext } from '../../../contexts/websocket';
import Recorder from './Recorder';
import styles from '../styles';

export default function TalkModal() {
    const { talkContext, setTalkContext } = useContext(TalkContext);
    const { sendMessage } = useContext(WebsocketContext);

    const windowHeight = Dimensions.get('window').height;
    const slideAnim = useRef(new Animated.Value(windowHeight)).current;

    useEffect(() => {
        if (!talkContext) {
            slideOut();
        } else {
            slideIn()
        }
    }, [talkContext]);

    const slideIn = () => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start();
      };

      const slideOut = () => {
        Animated.timing(slideAnim, {
          toValue: windowHeight,
          duration: 180,
          useNativeDriver: true,
        }).start();
      };

    async function submit(uri) {
        const str = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        const base64String = `data:audio/m4a;base64,${str}`;
        console.log('Base64 encoded string:', base64String);  
        // sendMessage({
        //     action: 'create',
        //     context: talkContext,
        //     data: { audio: base64String, },
        //   });
    }


    function onPress(e) {
        setTalkContext(null);
    }
  
    return (
            <Animated.View                
                style={[
                    {
                        position: 'absolute',
                        top: 0, 
                        left: 0, 
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        height: Dimensions.get('window').height,
                        width: Dimensions.get('window').width,
                        zIndex: 1000,
                        flex: 1,
                    },
                {
                    transform: [{translateY: slideAnim}],
                },
                ]}
            >
                
                <View
                    onTouchEnd={onPress}                    
                    style={{flex: 1, ...styles.centered}}
                >

                    <View
                        onStartShouldSetResponder={() => true} 
                        onTouchEnd={(e) => e.stopPropagation()}
                        style={{backgroundColor: 'red', height: 40, }}
                    >
                        <Bold>MESSAGE GOES HERE</Bold></View>
                        <Recorder submit={submit} />
                    </View>            
            </Animated.View>
        
    )
}