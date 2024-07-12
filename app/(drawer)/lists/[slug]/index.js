import { StyleSheet, View } from 'react-native';

import List from "../../../../components/UI/Details/List";
import DrawerScreen from '../../../../components/UI/View/DrawerScreen';

export default function ListDetail() {
    const viewStyled = StyleSheet.create({
        flex: 1,
        // backgroundColor: 'white',
    });

    return (
        <>
            <DrawerScreen />
            <View style={viewStyled}>
                <List />
            </View>
        </>
    )
}
