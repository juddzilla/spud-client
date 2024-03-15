import { useEffect, useState, useCallback } from 'react';
import { Pressable, Modal, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import { Text } from 'react-native';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

const useDebouncedValue = (inputValue, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(inputValue);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(inputValue);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [inputValue, delay]);
  
    return debouncedValue;
  };

export default function Search({ placeholder, update }) {    
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebouncedValue(search, 500);

    useEffect(() => {
        update({search});        
      }, [debouncedSearch]);

    const style = StyleSheet.create({
        container: {
            ...styles.row,            
            flex: 1,
            marginRight: 16,
        },
        search: { 
            color: colors.input.dark.icon, 
            left: 12, 
            position: 'absolute', 
            size: 14,
         },
        input: {
            ...styles.inputs.size.small,
            backgroundColor: colors.input.dark.backgroundColor,                
            color: colors.input.dark.color,
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
                color: colors.input.dark.icon, 
                size: 14,
            },
         }
    })
    return (
        <View style={style.container}>
            <TextInput
                value={search}
                // editable={listItems.length !== 0}
                onChangeText={(text) => setSearch(text)} 
                placeholder={placeholder}
                style={style.input}
            />         
            <Icon name='search' styles={style.search} /> 
            { search.length > 0 &&            
                <Pressable
                    onPress={() => setSearch('')}
                    style={style.close.button}>
                    <Icon name='close' styles={style.close.icon} /> 
                </Pressable>
            }
        </View>
    )
}