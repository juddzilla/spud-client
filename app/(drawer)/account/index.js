import { Pressable, View } from 'react-native';
import Bold from '../../../components/UI/text/Bold';
import { useStorageState } from '../../../interfaces/storage';
import { router } from 'expo-router';

export default function Index() {
    const [[isLoading, session], setSession] = useStorageState('session');

    function logout() {
        setSession(null);
        router.replace('/');
    }
    return (
        <View>
            <Bold>Account</Bold>
            <Pressable onPress={logout}>
                <Bold>Logout</Bold>
            </Pressable>
        </View>
    )
}