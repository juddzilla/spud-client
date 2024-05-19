import { useEffect, useState } from 'react';
import { Pressable, StyleSheet,TextInput, View } from 'react-native';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import { queryClient } from '../../../contexts/query-client';

import { useDebouncedValue } from '../../../utils/debounce';

export default function Search({ keys, placeholder, size='small', update }) {        
    const [focused, setFocused] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebouncedValue(search, 500);
    const Query = queryClient.getQueryData(keys);
    
    const disabled = !Query || Query.count === null || !Query.results || !Query.results.length;    
    
    let height = 40;    
    let searchIconSize = 14;

    if (size === 'small') {
        height = 32;
        searchIconSize = 12;
    }

    useEffect(() => {
        update({search});
      }, [debouncedSearch]);      

    const focusedOrHasSearch = focused || search.trim().length > 0;

    const style = StyleSheet.create({    
        container: {
            ...styles.row,   
            backgroundColor: focusedOrHasSearch ? colors.lightWhite : 'transparent', 
            borderWidth: 1,
            borderRadius: height / 2,
            borderColor: focusedOrHasSearch? colors.darkText : colors.white,               
            // borderColor: 'red',
            flex: 1,
            justifyContent: 'space-between',
            marginRight: 8,
            
        },
        search: { 
            color: focusedOrHasSearch ? colors.darkText : colors.sort.inactive,
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
            color: colors.darkText,                
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

    function clearSearch() {
        setSearch('');
        update({search: ''});
    }

    return (
        <View style={style.container}>        
            <TextInput
                editable={!!disabled === false}
                value={search}
                onChangeText={setSearch} 
                onBlur={() => setFocused(false)}
                onFocus={() => setFocused(true)}
                placeholder={placeholder}
                placeholderTextColor={colors.darkText}
                style={style.input}
            />
            <View style={
                style.icon.container
            }>                         
                { search.trim().length > 0 ?            
                    (<Pressable
                        onPress={clearSearch}
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