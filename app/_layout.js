import React, { useCallback, useContext, useEffect, useState } from 'react';
import { 
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
 } from 'react-native';
import { Slot } from 'expo-router';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

import Bold from '../assets/fonts/Inter-Bold.otf';
import Black from '../assets/fonts/Inter-Black.otf';
import Light from '../assets/fonts/Inter-Light.otf';
import Regular from '../assets/fonts/Inter-Regular.otf';

import { AuthContext } from '../contexts/auth';
import { queryClient } from '../contexts/query-client';

import { useStorageState } from '../interfaces/storage';
import colors from '../components/UI/colors';

import DetailModal from '../components/UI/Details/Modal';
export function SessionProvider(props) {
  const [[isLoading, session], setSession] = useStorageState('session');
  return (
    <AuthContext.Provider
      value={{
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
            <QueryClientProvider client={queryClient}>
              <SessionProvider>
                <SafeAreaView style={{ flex: 1}}>
                  {/* <KeyboardAvoidingView
                    behavior={Platform.OS !== 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1}}
                  >
                  </KeyboardAvoidingView> */}
                  <Slot />
                  <DetailModal />
                </SafeAreaView>
              </SessionProvider>
            </QueryClientProvider>
          ) : (
            <View>
              <Text>Loading</Text>
              </View>
          )}
          
      </GestureHandlerRootView>
    );
}