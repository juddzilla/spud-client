import React, { useCallback, useContext, useEffect, useState } from 'react';
import { 
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
 } from 'react-native';
import { Slot } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

import Bold from '../assets/fonts/Inter-Bold.otf';
import Black from '../assets/fonts/Inter-Black.otf';
import Light from '../assets/fonts/Inter-Light.otf';
import Regular from '../assets/fonts/Inter-Regular.otf';

import { useStorageState } from '../interfaces/storage';
import colors from '../components/UI/colors';
export const AuthContext = React.createContext({
  signIn: () => {},
  signOut: () => {},
  session: null,
  isLoading: true,
});

export function useSession() {
  const value = useContext(AuthContext);
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
      <GestureHandlerRootView style={{ backgroundColor: colors.theme.inputs.light.backgroundColor, flex: 1 }}  onLayout={onLayoutRootView}>
          { fontsLoaded ? (
          <SessionProvider>
            <SafeAreaView style={{ flex: 1}}>
              {/* <KeyboardAvoidingView
                behavior={Platform.OS !== 'ios' ? 'padding' : 'height'}
                style={{ flex: 1}}
              >
              </KeyboardAvoidingView> */}
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