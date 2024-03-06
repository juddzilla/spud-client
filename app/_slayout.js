import { SafeAreaView, StyleSheet, StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

import { Slot } from 'expo-router';
import Header from '../components/Header';
import Navi from '../components/Navi';

const styles = StyleSheet.create({
    container: {        
        flex: 1,
        marginTop:StatusBar.currentHeight
    },
    content: {
        flex: 1,
    },
    profile: {
        flexDirection: 'row',
        backgroundColor: '#EEE',
    },
    imageProfile: {
        width: 34,
        marginBottom: 5,
        marginTop: 5,
        borderRadius: 44/2,
        marginLeft: 10,
        height: 34
    },
    name: {
        alignSelf: 'center',
        marginLeft: 10,
        fontSize: 16
    }
});


export default function HomeLayout() {
    return (
        <SafeAreaView style={styles.container}>
            {/* <Header/> */}
            {/* <View style={styles.content}>
                <Slot/>
            </View> */}
            {/* <Navi /> */}
        </SafeAreaView>
    );
}