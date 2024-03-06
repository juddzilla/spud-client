import { useEffect } from 'react';
import  {useSegments } from 'expo-router'
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Drawer } from 'expo-router/drawer';
import { Text } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function(title, showHeader) {
    const segments = useSegments();
    console.log('segments', segments);
    useEffect(() => {
    }, [segments])
    return (
        <Drawer.Screen
          options={{
            title,
            headerShown: showHeader || true,
            headerLeft: () => <DrawerToggleButton />,
            headerRight: () => (
                <Link href='/talk'>
                    <FontAwesome name="microphone" size={24} color="black" />
                </Link>
            ),
          }}
        />
    )
}