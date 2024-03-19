import React from "react";
import { router } from 'expo-router';
import { View, Pressable, Text } from 'react-native';
import Bold from "../components/UI/text/Bold";
import { useSession } from './_layout';
export default function Login() {
    const { signIn } = useSession();
    return (
    <View style={{backgroundColor: 'blue', height: '100%', paddingTop: 100}}>
        <Pressable onPress={() => {
            signIn();
            router.replace('/');
        }}>

            <Bold>Login</Bold>
        </Pressable>
    </View>)
}