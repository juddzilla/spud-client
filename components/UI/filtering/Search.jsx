import { useEffect, useState, useCallback } from 'react';
import { Pressable, Modal, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import { useDebouncedValue } from '../../../utils/debounce';


export default function Search({ disabled, placeholder, update }) {        
    const [focused, setFocused] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebouncedValue(search, 500);

    useFocusEffect(
        useCallback(() => {          
          return () => {
            setSearch('');
          };
        }, [])
      );

    useEffect(() => {
        update({search});        
      }, [debouncedSearch]);      

    const style = StyleSheet.create({    
        container: {
            ...styles.row,   
            backgroundColor: (focused || search.length > 0) ? colors.lightWhite : colors.theme.text.lightest,            
            borderWidth: 1,
            borderRadius: 8,
            borderColor: colors.theme.text.lightest,               
            flex: 1,
            justifyContent: 'space-between',
            marginRight: 8,
            
        },
        search: { 
            color: colors.input.dark.icon, 
            size: 14,
         },
         icon: {
            container: {
                height: 40,
                width: 40,
                ...styles.centered,
            },
            image: {}
         },
        input: {            
            height: 40,                      
            marginRight: 0,                              
            backgroundColor: 'transparent',
            color: colors.theme.inputs.light.text.dark,                
            paddingLeft: 18,
            paddingRight: 44,        
        },
        close: { 
            button: {
                position: 'absolute', 
                right: 0, 
                ...styles.buttons.iconSmall, 
                ...styles.centered,
            },
            icon: {
                color: disabled ? colors.white : colors.theme.inputs.light.text.dark, 
                size: 12,
                
            },
         },
        //  trigger: {
        //     left: 12, 
        //     position: 'absolute',             
        //     width: 48,
        //     height: 64, 
        //     alignItems: 'center', 
        //     justifyContent: 'center',
        //  },
    });
    
    let inputStyle = {};
    
    return (
        <View style={style.container}>
            
            <TextInput
                editable={!!disabled === false}
                value={search}
                onChangeText={(text) => setSearch(text)} 
                onBlur={() => setFocused(false)}
                onFocus={() => setFocused(true)}
                placeholder={placeholder}
                style={{...style.input, ...inputStyle}}
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