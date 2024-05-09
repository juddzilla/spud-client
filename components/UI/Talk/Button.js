import { useContext } from 'react';
import { Pressable, View } from 'react-native';

import { TalkContext } from '../../../contexts/talk';

import colors from '../colors';
import Icon from '../icons';

import styles from '../styles';

export default function TalkButton({ keys }) {
    const { setTalkContext } = useContext(TalkContext);

    function toggle() {  
        setTalkContext(keys);
    }

    return (
      <View
        style={{          
          // backgroundColor: 'yellow',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',       
        }}>
          <Pressable            
            onPress={toggle}
            style={{justifyContent: 'center'}}
          >
            <View
                style={{
                  backgroundColor: colors.phoneBlue,
                  borderBottomLeftRadius: '50%',
                  borderBottomRightRadius: 8,
                  borderTopLeftRadius: '50%',
                  borderTopRightRadius: '50%',
                  width: 40, 
                  height: 40, 
                  ...styles.centered,
                  marginLeft: 8,
                }}
            >
              <Icon
                name='mic'
                styles={{
                  size: 24,
                }}
              />
            </View>
          </Pressable>
          
          {/* <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.5)',
              opacity: isOpen ? 1 : 0,
              position: 'absolute',
              top: 0,
              left: 0,
              // top: (Dimensions.get('window').height - 64 - 16 - 1) * -1,                            
              // left: (Dimensions.get('window').width  - 16 - 1) * -1,
              width: Dimensions.get('window').width,
              height: isOpen ? Dimensions.get('window').height : 0,
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
          </View>                          */}
      </View>     
    )
}