import { useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useFonts } from 'expo-font';
import { 
  SafeAreaView,
  StatusBar,
} from 'react-native';

import Bold from '../../assets/fonts/Inter-Bold.otf';
import Black from '../../assets/fonts/Inter-Black.otf';
import Light from '../../assets/fonts/Inter-Light.otf';
import Regular from '../../assets/fonts/Inter-Regular.otf';

export default function DrawerLayout() {  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Black': Black,
    'Inter-Bold': Bold,
    'Inter-Light': Light,
    'Inter-Regular': Regular,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      console.log('fontError', fontError);
      console.log('fontsLoaded', fontsLoaded);
    }
  }, [fontsLoaded, fontError]);
  return (    
    // <SafeAreaView>
    <GestureHandlerRootView style={{ flex: 1 }}  onLayout={onLayoutRootView}>
        <Drawer
          screenOptions={{ headerShown: false }}      
        >
          <Drawer.Screen
            name="home"
            options={{
              drawerLabel: "Home",
              title: "Home",
            }}          
          />
          <Drawer.Screen
            name="lists"
            options={{
              drawerLabel: "Lists",
              title: "Listss",
            }}
          />
          <Drawer.Screen
            name="convos"
            options={{
              drawerLabel: "Cosnvos",
              title: "Cornvors",
            }}
          />
          <Drawer.Screen
            name="notes"
            options={{
              drawerLabel: "Notes",
              title: "Collections",
            }}
          />
          <Drawer.Screen
            name="talk"
            options={{
              drawerLabel: "Talssks",
              title: "T",
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    
  );
}