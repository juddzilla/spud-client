
import { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
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
    const [left, setLeft] = useState(0);


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
        <View
          style={{position: 'absolute', top: 0, left: 0, flex: 1}}
        >
          <Modal
            backdropColor={colors.theme.backgroundColor}            
            animationIn='fadeIn'
            animationInTiming={100}
            transparent={false}
            isVisible={true}
            onBackdropPress={() => DetailObservable.notify(null)}  
            style={{ }}
          >
            <View 
              style={{
                paddingTop: 40, 
                flex: 1,
                paddingHorizontal: 10,
              }}              
              onLayout={(event) => {
                const diff = Dimensions.get('window').width - event.nativeEvent.layout.width;                
                setLeft(diff/2);
              }}
            >

              <Component item={item} left={left}/>
            </View>
          </Modal>
        </View>
      </DetailContext.Provider>
    );
  };