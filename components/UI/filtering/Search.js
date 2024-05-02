import { useEffect, useState } from 'react';
import { Pressable, StyleSheet,TextInput, View } from 'react-native';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import { useDebouncedValue } from '../../../utils/debounce';

export default function Search({ disabled, placeholder, size='small', update }) {        
    const [focused, setFocused] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebouncedValue(search, 500);

    let height = 40;    
    let searchIconSize = 14;
    let closeIconSize = 12;

    if (size === 'small') {
        height = 32;
        searchIconSize = 12;
    }

    useEffect(() => {
        update({search});        
      }, [debouncedSearch]);      

    const style = StyleSheet.create({    
        container: {
            ...styles.row,   
            backgroundColor: (focused || search.length > 0) ? colors.lightWhite : 'transparent', 
            borderWidth: 1,
            borderRadius: height / 2,
            borderColor: colors.input.border,               
            flex: 1,
            justifyContent: 'space-between',
            marginRight: 8,
            
        },
        search: { 
            color: focused ? colors.button.enabled : colors.lightWhite,
            size: searchIconSize,
         },
         icon: {
            container: {
                height,
                width: height,
                ...styles.centered,
            },
         },
        input: {            
            height,                      
            marginRight: 0,           
            color: colors.input.color,                
            paddingLeft: 18,
            paddingRight: 44,     
            flex: 1,   
        },
        close: { 
            button: {
                height,
                width: height,
                position: 'absolute', 
                right: 0, 
                ...styles.centered,                
            },
            icon: {
                color: disabled ? colors.button.disabled : colors.button.enabled, 
                // color: colors.lightWhite, 
                size: 18,
                
            },
         },
    });
     
    return (
        <View style={style.container}>        
            <TextInput
                editable={!!disabled === false}
                value={search}
                onChangeText={(text) => setSearch(text)} 
                onBlur={() => setFocused(false)}
                onFocus={() => setFocused(true)}
                placeholder={placeholder}
                placeholderTextColor={colors.lightWhite}
                style={style.input}
            />
            <View style={
                style.icon.container
            }>                         
                { search.length > 0 ?            
                    (<Pressable
                        onPress={() => setSearch('')}
                        style={style.close.button}>
                        <Icon name='close' styles={style.close.icon} /> 
                    </Pressable>) :
                    (<Pressable                  
                        onPress={() => setFocused(true)}
                    >
                        <Icon name='search' styles={style.search} /> 
                    </Pressable>)
                }
            </View>    
        </View>
    )
}