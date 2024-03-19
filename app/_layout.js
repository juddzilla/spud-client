import React, { useCallback, useState } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

import Bold from '../assets/fonts/Inter-Bold.otf';
import Black from '../assets/fonts/Inter-Black.otf';
import Light from '../assets/fonts/Inter-Light.otf';
import Regular from '../assets/fonts/Inter-Regular.otf';

import { useStorageState } from '../interfaces/storage';

const AuthContext = React.createContext({
  signIn: () => {},
  signOut: () => {},
  session: null,
  isLoading: true,
});

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          setSession('xxx');
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}


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
          <SessionProvider>
            <SafeAreaView style={{ flex: 1}}>
              <Slot />
            </SafeAreaView>
          </SessionProvider>
          ) : (
            <View>
              <Text>Loading</Text>
              </View>
          )}
          
      </GestureHandlerRootView>
    );
}