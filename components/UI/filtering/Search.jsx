import { useEffect, useState, useCallback } from 'react';
import { Pressable, Modal, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import { useDebouncedValue } from '../../../utils/debounce';

export default function Search({ disabled, placeholder, update }) {        
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
            flex: 1,
            // marginRight: 16,
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
                color: disabled ? colors.white : colors.input.dark.icon, 
                size: 14,
            },
         }
    })
    return (
        <View style={style.container}>
            <TextInput
                editable={!!disabled === false}
                value={search}
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