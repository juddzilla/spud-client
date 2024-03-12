import { Pressable, View } from 'react-native';

import Regular from '../text/Regular';
import Icon from '../icons';
export default function() {
    return (
        <View>
            <Pressable onPress={() => {}}>
                <Icon name='plus' />
                <Regular>Adss</Regular>
            </Pressable>
        </View>
    )
}