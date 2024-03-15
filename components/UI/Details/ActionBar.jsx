import { useState } from 'react';
import { FlatList, StyleSheet, Pressable, TextInput, View } from 'react-native';
import Icon from '../icons';
import colors from '../colors';

import TalkButton from '../talkButton';

export default function ActionBar({ onSend, placeholder }) {
    const [focus, setFocus] = useState(false);
    const [message, setMessage] = useState('');

    function onSendMessage() {
        onSend(message);
        setMessage('');
    }

    const styled = StyleSheet.create({
        container: {
            alignItems: 'center',             
            borderColor: colors.darkBg,
            borderWidth: 1,
            borderBottomWidth: 0,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            flexDirection: 'row', 
            justifyContent: 'space-between',             
            paddingLeft: 16,
            paddingRight: 16,
            paddingVertical: 12,
        },
        input: {
            container: {
                backgroundColor: focus ? 'white' : colors.lightWhite,
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',                                             
                flex: 1,       
                
                borderWidth: 1,
                borderColor: colors.darkBg,
                borderRadius: 32,
                paddingLeft: 32,
                marginRight: 70,            
                opacity: 1,
                paddingRight: 48,

                shadowColor: colors.darkestBg,
                shadowOffset: {
                    width: 0,
                    height: 7,
                },
                shadowOpacity: focus ? 0.1 : 0,
                shadowRadius: 12.00,
                elevation: 24,
            },
            field: {                    
                height: 48,    
                marginRight: 0, 
                flex: 1,                
            },
            icons: {
                leading: {
                    size:12, 
                    color: focus ? 'transparent' : colors.darkBg, 
                    position: 'absolute',
                    zIndex: 1, 
                    left: 12,
                },
                trailing: {
                    size: 16, 
                    color: focus ? colors.darkestBg : '#d4d4d4',
                    zIndex: 1,
                }
            },
            send: {
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.darkBg, 
                borderRadius: 40,
                opacity: (focus && message.trim().length) ? 1 : 0,
                position: 'absolute', 
                right: 4
            },
        },
      });

    return (
        <View style={styled.container}>
            <View style={styled.input.container}>          
                <Icon name='plus' styles={styled.input.icons.leading} />
                <TextInput
                    value={message}
                    onBlur={() => setFocus(false)}
                    onChangeText={(text) => setMessage(text)}
                    onFocus={() => setFocus(true)}
                    placeholder={placeholder || 'NEW'}
                    style={styled.input.field}
                />
                <Pressable
                    onPress={onSendMessage}
                    style={styled.input.send}
                >
                    <Icon name='send' styles={styled.input.icons.trailing} />
                </Pressable>
            </View>
            <TalkButton />
        </View>
    )
}