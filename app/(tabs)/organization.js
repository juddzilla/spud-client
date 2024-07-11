import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const History = () => (<View style={styles.container}><Text>History</Text></View>);
const Cats = () => (<View style={styles.container}><Text>Cats</Text></View>);


export default function Work() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>

            <Tab.Navigator>
                <Tab.Screen name="History" component={History} />
                <Tab.Screen name="Cats" component={Cats} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}

