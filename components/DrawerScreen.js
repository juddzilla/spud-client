import { useEffect } from 'react';
import  {useSegments, Link, router } from 'expo-router'
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function(title, showHeader) {
    const segments = useSegments();
    console.log('segments', segments);
    useEffect(() => {
    }, [segments])

    function goBack() {
      if (router.canGoBack()) {

        router.back();
      }
    }
    return (
        <Drawer.Screen
          options={{
            title,
            headerShown: showHeader || true,
            headerLeft: () => (
              <TouchableOpacity onPress={goBack}>
                  <FontAwesome name="long-arrow-left" size={24} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
                <Link href='/talk'>
                    <FontAwesome name="microphone" size={24} color="black" />
                </Link>
            ),
          }}
        />
    )
}