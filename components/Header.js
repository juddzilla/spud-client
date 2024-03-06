import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { router } from 'expo-router';


const styles = StyleSheet.create({
    slot: {
        backgroundColor: 'yellow',
        color: 'black',        
    },
});


export default function Header() {
    function goBack() {
        if (router.canGoBack()) {
            router.back()
        }        
    }

    return (
        <View>
            <Pressable onPress={goBack}>
                <Text style={styles.slot}>Back</Text>
            </Pressable>
        </View>
    )
}