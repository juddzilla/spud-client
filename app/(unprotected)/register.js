import React, { useState } from "react";
import { router, Link } from 'expo-router';
import { View, Pressable, Text, TextInput } from 'react-native';
import Bold from '../../components/UI/text/Bold';
import Fetch from '../../interfaces/fetch';

import { useStorageState } from "../../interfaces/storage";
// import { useSession } from './_layout';
import validators from "../../utils/validators";
export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [[isLoading, session], setSession] = useStorageState('session');

    async function register() {
        const rejectOn = [
            !password.trim().length,
            !confirmPassword.trim().length,
            password.length < 8,
            confirmPassword.length < 8,
            password !== confirmPassword,
            !validators.email(email),
        ];
        if (rejectOn.some(value => value)) {
            setSubmitting(false);    
            return;
        }
        console.log('{ email, password }', { email, password });
        // return;
        // setSubmitting(true);
        // const request = await Fetch.post('auth/register', { email, password });
        // const [err, res] = request;

        // if (err) {
        //     console.warn('login', err);
            
        // } else {
        //     console.log('res', res);
            
        // }
        // setSubmitting(false);
        const token = '56db8ecf64c03520a384189ba8ec9a1d91321cd6';
        setSession(token);
        router.replace('/')

    }
    // const { signIn } = useSession();
    return (
    <View style={{height: '100%', paddingTop: 100, paddingHorizontal: 16}}>
        <TextInput
            value={email}
            inputMode="email"
            autoCapitalize='none'
            onChangeText={(text) => setEmail(text)}
            style={{ borderWidth: 1, padding: 16}} placeholder='email'/>
        <TextInput
            onChangeText={(text) => setPassword(text)}
            value={password} 
            secureTextEntry={true}
            autoCapitalize='none'
            style={{ borderWidth: 1, padding: 16}} placeholder='password'/>
        <TextInput 
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword} 
            secureTextEntry={false}
            autoCapitalize='none'
            style={{ borderWidth: 1, padding: 16}} placeholder='confimr'/>
        <Pressable onPress={register}>

            <Bold>Submit</Bold>
        </Pressable>
        <Link href='/(unprotected)/login'>
            <Bold>Login</Bold>
        </Link>
    </View>)
}