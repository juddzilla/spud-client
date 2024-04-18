
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from "react-native-modal";
import { DetailContext } from "../../../contexts/detail";
import Bold from '../text/Bold';
import Convo from './Convo';
import List from './List';
import Note from './Note';

import { DetailObservable } from './observable';
import colors from '../colors';

export default function DetailModal() {
    //set bool message to true
    const [item, setItem] = useState(null);

    useEffect(() => {
      DetailObservable.subscribe((value) => {      
        setItem(value);
      })
      return () => {
        DetailObservable.unsubscribe();
      }
    }, []);


    if (!item) {
      return null;
    }

    const typeMap = {
      Convo, Note, List,
    };

    const Component = typeMap[item.type];
    
    return (
      // set value of context to {bool, toggle}
      <DetailContext.Provider value={{ item, setItem }}>        
        <View style={{position: 'absolute', top: 0, left: 0, flex: 1}}>
          <Modal
            backdropColor={colors.theme.backgroundColor}
            // backdropColor='rgba(255,255,255,0.4)'
            animationIn='fadeIn'
            animationInTiming={300}
            transparent={false}
            isVisible={true}
            onBackdropPress={() => DetailObservable.notify(null)}  
          >
            <View style={{paddingTop: 40, flex: 1}}>

              <Component item={item} />
            </View>
          </Modal>
        </View>
      </DetailContext.Provider>
    );
  };