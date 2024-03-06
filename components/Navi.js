import {
    Button,
    Pressable,
    StyleSheet,
    Text,
    View,
 } from 'react-native';
 import { Link } from 'expo-router';

const styles = {
    container: {        
        flexDirection: 'row',
    }
}
export default function Navi() {
    return (
        <View style={styles.container}>
            <Link href="/home" asChild>
                <Pressable>
                    <Text>Home</Text>
                </Pressable>
            </Link>
            <Link href="/lists" asChild>
                <Pressable>
                    <Text>Lists</Text>
                </Pressable>
            </Link>
            <Link href="/notes" asChild>
                <Pressable>
                    <Text>Notes</Text>
                </Pressable>
            </Link>
            <Link href="/lists" asChild>
                <Pressable>
                    <Text>Speak</Text>
                </Pressable>
            </Link>
            <Link href="/lists" asChild>
                <Pressable>
                    <Text>Write</Text>
                </Pressable>
            </Link>
        </View>
    )
}