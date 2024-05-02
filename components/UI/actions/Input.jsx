import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import Icon from '../icons';
import colors from '../colors';
import styles from '../styles';
export default function Input({ onSubmit, placeholder, focused, setFocused, theme='light' }) {
    const [message, setMessage] = useState('');
    const [focus, setFocus] = useState(false);
    const inputRef = useRef(); 

    const height = 48;

    let inputTheme = {
        inactive: {
            backgroundColor: colors.white,
            borderColor: colors.white,
            color: colors.sort.inactive,
        },
        active: {
            backgroundColor: 'red',
            borderColor: 'green',
            color: colors.sort.active,
        },
    };

    if (theme === 'dark') {
        inputTheme = {
            inactive: {
                backgroundColor: 'transparent',
                borderColor: colors.lightWhite,
                color: colors.lightWhite,
            },
            active: {
                backgroundColor: colors.lightWhite,
                borderColor: colors.lightWhite,
                color: colors.detail.background,
            },
        }
    }

    const style = inputTheme[focused ? 'active' : 'inactive'];
    
    function onSubmitMessage() {               
        onSubmit(message);
        setMessage('');  
        // inputRef.current.blur();
    }

    function onBlur() {
        setFocus(null);
    }

    function onFocus() {
        setFocus('create');
    }

    const styled = StyleSheet.create({
        container: {
            backgroundColor: style.backgroundColor,
            flexDirection: 'row', 
            alignItems: 'center', 
            flex: 1,  
            borderWidth: 1,
            borderColor: style.borderColor,
            borderRadius: height/2,
            marginBottom: 4,            
            
            // zIndex: 10,
        },
        input: {
            color: style.color,
            flex: 1,
            height,
            paddingLeft: 16,      
            paddingRight: 4,
        },
        button: {
            height: 40,
            width: 40,
            ...styles.centered,      
            opacity: (focus && message.trim().length) ? 1 : 0,               
        },
        send: {
            color: colors.lightWhite,
            size: 16, 
            // zIndex: 1,
        },
      });

    //   useEffect(() => {
    //     if (message === '') {
    //         setTimeout(() => { inputRef.current.blur(); }, 0)            
    //     }
    //   }, [message])

    return (
        <View style={styled.container}>            
            <TextInput
                onBlur={onBlur}
                onChangeText={(text) => setMessage(text)}
                onFocus={onFocus}
                placeholder={placeholder || 'NEW'}
                placeholderTextColor={style.color}
                ref={inputRef}
                style={styled.input}
                value={message}
            />
            <Pressable
                onPress={onSubmitMessage}
                style={styled.button}
            >
                <Icon name='send' styles={styled.send} />
            </Pressable>
        </View>        
    )
}