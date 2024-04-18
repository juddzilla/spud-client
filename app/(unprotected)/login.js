import React, { useState } from "react";
import { router, Link } from 'expo-router';
import { View, Pressable, Text, TextInput } from 'react-native';
import Bold from '../../components/UI/text/Bold';
import Fetch from '../../interfaces/fetch';
import { useStorageState } from "../../interfaces/storage";

import validators from "../../utils/validators";
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [[isLoading, session], setSession] = useStorageState('session');

    async function login() {
        // setSubmitting(true);
        // const request = await Fetch.post('login', { email, password });
        // const [err, res] = request;

        // if (err) {
        //     console.warn('login', err);
        //     setSubmitting(false);
        // } else {
        //     console.log('res', res);
        // }
        const token = '56db8ecf64c03520a384189ba8ec9a1d91321cd6';
        setSession(token);
        router.replace('/');
    }
    return (
    <View style={{height: '100%', paddingTop: 100, paddingHorizontal: 16}}>
        <TextInput value={email} style={{ borderWidth: 1, padding: 16}} placeholder='email'/>
        <TextInput value={password} style={{ borderWidth: 1, padding: 16}} placeholder='password'/>
        <Pressable onPress={login}>

            <Bold>Login</Bold>
        </Pressable>
        <Link href='/(unprotected)/register'>
            <Bold>Register</Bold>
        </Link>
    </View>)
}