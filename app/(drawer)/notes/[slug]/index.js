import { StyleSheet, View } from 'react-native';
import Note from '../../../../components/UI/Details/Note';


export default function NoteDetail() {
    const viewStyled = StyleSheet.create({
        flex: 1,
        backgroundColor: 'white',
    });

    return (
        <View style={viewStyled}>
            <Note />
        </View>
    )
}
