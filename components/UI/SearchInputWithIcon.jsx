import { useState } from 'react';
import { TextInput, View } from 'react-native';
import Icon from './icons';
import colors from './colors';

export default function SearchBar({ value, onChangeText, placeholder, style }) {
    const [focus, setFocus] = useState(false);
    return (
        <View style={{
            backgroundColor: focus ? 'white' : colors.darkBg,
            
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 32,
            paddingLeft: 32,
            marginRight: 12,
            paddingRight: 16,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>   
            <Icon name="search" styles={{size:16, color:'#d4d4d4', position: 'absolute', zIndex: 1, left: 12}} />
            <TextInput
                value={value}
                onBlur={() => setFocus(false)}
                onChangeText={onChangeText}
                onFocus={() => setFocus(true)}
                placeholder={placeholder}
                style={{                    
                    height: 48,                      
                    marginRight: 0, 
                    flex: 1,
                    ...style,
                }}
            />
        </View>
    )
}