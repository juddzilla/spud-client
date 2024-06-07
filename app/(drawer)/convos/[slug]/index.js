import { StyleSheet, View } from 'react-native';
import Convo from '../../../../components/UI/Details/Convo';

export default function ConvoDetail() {
    const viewStyled = StyleSheet.create({
        flex: 1,
        backgroundColor: 'white',
    });

    return (
        <View style={viewStyled}>
            <Convo />
        </View>
    )
}
