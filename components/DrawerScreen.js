import  {router } from 'expo-router'
import { Drawer } from 'expo-router/drawer';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Icon from './UI/icons';

export default function DrawerScreen(title, headerRight) {    
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
            headerShown: true,
            headerLeft: () => {
              if (!router.canGoBack()) {
                return (
                  <TouchableOpacity onPress={toggleMenu}>
                    <Icon name="navicon" />
                  </TouchableOpacity>                  
                )
              }
              return (
                <TouchableOpacity onPress={goBack}>
                    <Icon name="leftArrowLong" />
                </TouchableOpacity>
              )
            },
            headerRight: headerRight || null,
          }}
        />
    )
}