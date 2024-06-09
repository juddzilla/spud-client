import { StyleSheet, View } from 'react-native';
import Convo from '../../../../components/UI/Details/Convo';
import DrawerScreen from '../../../../components/UI/View/DrawerScreen';

export default function ConvoDetail() {
    const viewStyled = StyleSheet.create({
        flex: 1,
        backgroundColor: 'white',
    });

    return (
        <>
            <DrawerScreen />
            <View style={viewStyled}>
                <Convo />
            </View>
        </>
    )
}
