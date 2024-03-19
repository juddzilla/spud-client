import { useCallback } from 'react';
import { View, Text } from 'react-native';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

import Bold from '../assets/fonts/Inter-Bold.otf';
import Black from '../assets/fonts/Inter-Black.otf';
import Light from '../assets/fonts/Inter-Light.otf';
import Regular from '../assets/fonts/Inter-Regular.otf';

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
      'Inter-Black': Black,        
      'Inter-Bold': Bold,
      'Inter-Light': Light,
      'Inter-Regular': Regular,
    });
        
    const onLayoutRootView = useCallback(async () => {        
      if (fontsLoaded || fontError) {
        console.log('!!!!! fontError', fontError);
        console.log('!!!!!!! fontsLoaded', fontsLoaded);
      }
    }, [fontsLoaded, fontError]);

    return (
      <GestureHandlerRootView style={{ backgroundColor: 'transparent', flex: 1 }}  onLayout={onLayoutRootView}>
        { fontsLoaded ? (
          <Slot />
        ) : (
          <View><Text>Loading</Text></View>
        )}
        
      </GestureHandlerRootView>
    );
}