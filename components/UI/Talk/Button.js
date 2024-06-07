import { useContext } from 'react';
import { Pressable, View } from 'react-native';

import { TalkContext } from '../../../contexts/talk';

import colors from '../colors';
import Icon from '../icons';

import styles from '../styles';

export default function TalkButton({ context }) {
  const { setTalkContext } = useContext(TalkContext);

  function toggle() {
    setTalkContext(context);
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
        style={{ justifyContent: 'center' }}
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
    </View>
  )
}