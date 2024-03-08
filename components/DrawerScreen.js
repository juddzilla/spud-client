import { useEffect } from 'react';
import  {useSegments, Link, router } from 'expo-router'
import { Drawer } from 'expo-router/drawer';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function(title, headerRight) {
    // const segments = useSegments();
    // console.log('segments', segments);
    // useEffect(() => {
    // }, [segments])
    const navigation = useNavigation();

    function goBack() {
      router.back();      
    }

    function toggleMenu() {
      navigation.openDrawer();
    }

    return (
        <Drawer.Screen
          options={{
            title,
            headerShown: false,
            headerLeft: () => {
              if (!router.canGoBack()) {
                return (
                  <TouchableOpacity onPress={toggleMenu}>
                    <FontAwesome name="navicon" size={24} color="black" />
                  </TouchableOpacity>                  
                )
              }
              return (
                <TouchableOpacity onPress={goBack}>
                    <FontAwesome name="long-arrow-left" size={24} color="black" />
                </TouchableOpacity>
              )
            },
            headerRight,
          }}
        />
    )
}