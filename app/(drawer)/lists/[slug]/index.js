import { StyleSheet, View } from 'react-native';

import List from "../../../../components/UI/Details/List";

export default function ListDetail() {
    const viewStyled = StyleSheet.create({
        flex: 1,
        backgroundColor: 'white',
    });

    return (
        <View style={viewStyled}>
            <List />
        </View>
    )
}