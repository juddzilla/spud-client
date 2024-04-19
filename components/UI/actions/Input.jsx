import { useState } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import Icon from '../icons';
import colors from '../colors';

export default function Input({ onSubmit, placeholder, focused, setFocused }) {
    const [message, setMessage] = useState('');
    
    function onSubmitMessage() {               
        onSubmit(message);
        setMessage('');     
    }

    function onBlur() {
        setFocused(null);
    }

    function onFocus() {
        setFocused('create');
    }

    const styled = StyleSheet.create({
        input: {
            container: {
                backgroundColor: 'white',                
                flexDirection: 'row', 
                alignItems: 'center', 
                flex: 1,  
                borderWidth: 1,
                borderColor: focused ? colors.theme.text.light : colors.theme.text.lightest, //
                borderBottomColor: focused ? colors.theme.text.light : colors.theme.text.lightest,
                borderRadius: 12,
                marginBottom: 4,            
                zIndex: 10,
            },
            field: {               
                color: colors.theme.inputs.dark.text.darkest,                            
                flex: 1,
                height: 48,
                paddingHorizontal: 16,            
            },
            icons: {
                leading: {
                    color: focused ? 'transparent' : colors.theme.inputs.dark.text.light, 
                    left: 12,
                    position: 'absolute',
                    zIndex: 1, 
                    size: 12, 
                },
                trailing: {
                    color: focused ? colors.darkestBg : '#d4d4d4',
                    size: 16, 
                    zIndex: 1,
                }
            },
            send: {
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: colors.darkBg, 
                // borderRadius: 40,
                opacity: (focused && message.trim().length) ? 1 : 0,
                position: 'absolute', 
                right: 4
            },
        },
        modal: {
            container: {
                flex: 1,
                paddingTop: 100,
                paddingHorizontal: 16,
            },
            content: {
                fontSize: 36, 
                textAlign: 'center',
            }
        }
      });

    return (
        <View style={styled.input.container}>
            {/* <Icon name='plus' styles={styled.input.icons.leading} /> */}
            <TextInput
                value={message}
                onBlur={onBlur}
                onChangeText={(text) => setMessage(text)}

                onFocus={onFocus}
                placeholder={placeholder || 'NEW'}
                style={styled.input.field}
                placeholderTextColor={colors.theme.inputs.dark.text.light}
            />
            <Pressable
                onPress={onSubmitMessage}
                style={styled.input.send}
            >
                <Icon name='send' styles={styled.input.icons.trailing} />
            </Pressable>
        </View>        
    )
}