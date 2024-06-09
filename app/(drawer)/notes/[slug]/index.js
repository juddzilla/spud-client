import { StyleSheet, View } from 'react-native';
import Note from '../../../../components/UI/Details/Note';
import DrawerScreen from '../../../../components/UI/View/DrawerScreen';

export default function NoteDetail() {
    const viewStyled = StyleSheet.create({
        flex: 1,
        backgroundColor: 'white',
    });

    return (
        <>
            <DrawerScreen />
            <View style={viewStyled}>
                <Note />
            </View>
        </>
    )
}
