
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '../icons';

export default function CustomHeader() {
    const styled = StyleSheet.create({
        container: {
            height: 48,
            flexDirection: 'row'
        },
        navigation: {
            backgroundColor: 'red',
            paddingLeft: 8,
            // alignItems: 'center',
            justifyContent: 'center',
            width: 48,
        },
        title: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        action: {
            width: 48,
            backgroundColor: 'blue',
            justifyContent: 'center',
            alignItems: 'center'
        }
    });
    let title = 'Spud';


    return (
        <View style={styled.container}>
            <View style={styled.navigation}>
                <Icon name='leftArrowLong' />
            </View>
            <View style={styled.title}>
                <Text>{title}</Text>
            </View>
            <View style={styled.action}>
                <Icon name='search' />
            </View>
        </View>
    )
}