import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from "react-native-modal";
import * as FileSystem from 'expo-file-system';

import Bold from '../text/Bold';

import { TalkObservable } from './observable';
import Recorder from './Recorder';
export default function TalkModal() {
    const [item, setItem] = useState(null);

    useEffect(() => {
        TalkObservable.subscribe((data) => {   
            console.log('TalkObservable dATA', data);
            const value = data ? data.type : null;            
            console.log('talk modal obs', value);
            setItem(value);
        })
        return () => {
            TalkObservable.unsubscribe();
        }
      }, []);

    async function submit(uri) {
        const str = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        const base64String = `data:audio/m4a;base64,${str}`;
        console.log('Base64 encoded string:', base64String);  
    }

      if (!item) {
        return null;
      }
  
    return (
        <View
            style={{
                backgroundColor: 'red', 
                position: 'absolute',
                top: 0, 
                left: 0, 
                // flex: 1,
            }}
        >
            <Modal
                backdropColor='rgba(255,255,255,0.3)'
                backdropOpacity={1}
                 // backdropColor='rgba(0,0,0,1)'      
                animationIn='fadeIn'
                animationInTiming={100}
                transparent={true}
                isVisible={true}
                onBackdropPress={() => TalkObservable.notify(null)}  
                style={{ }}
            >          
                <View ><Bold>{item.message}</Bold></View>
                <Recorder submit={submit} />
          </Modal>
        </View>
    )
}