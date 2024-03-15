import { useEffect, useState, useCallback } from 'react';
import { Pressable, Modal, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import { Text } from 'react-native';

import colors from '../colors';
import Icon, { sorting } from '../icons';
import styles from '../styles';
import Sort from './Sort';
import debounce from '../../../utils/debounce';
export default function Header() {
    const input = {
        placeholder: 'Search'
    };
    const sort = ['name', 'updated'];
    const [focus, setFocus] = useState(false);
    const [search, setSearch] = useState('');

    const style = StyleSheet.create({
        header: {
            ...styles.header
        },
        search: {
            ...styles.header.input.container
        },
        sort: {
            ...styles.row
        }
    })
    return (
        <View style={style.header}>
            <View style={style.search}>
                <TextInput
                    value={search}
                    // editable={listItems.length !== 0}
                    onChangeText={(text) => setSearch(text)} 
                    placeholder={input.placeholder}
                    style={{
                        ...styles.inputs.size.small,
                        backgroundColor: colors.input.dark.backgroundColor,                
                        color: colors.input.dark.color,
                        paddingRight: 44,
                    }}
                />         
                <Icon name='search' styles={{ color: colors.input.dark.icon, position: 'absolute', left: 12, size: 14 }} /> 
                { search.length > 0 &&            
                    <Pressable
                        onPress={() => setSearch('')}
                        style={{position: 'absolute', right: 0, ...styles.buttons.iconSmall, ...styles.centered }}>
                        <Icon name='close' styles={{ color: colors.input.dark.icon, size: 14 }} /> 
                    </Pressable>
                }
            </View>
            <Sort query={{}} update={() => {}} />
        </View>
    )
}