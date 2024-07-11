import * as React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function App() {
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={styles.container}><Text>Convo</Text></View>
        </SafeAreaView>
    );
}
