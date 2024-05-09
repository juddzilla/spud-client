import React,
  {
    createContext,
    useCallback,
    useEffect,
  } from 'react';
import { 
  SafeAreaView,
  Text,
  View,
 } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import Bold from '../assets/fonts/Inter-Bold.otf';
import Black from '../assets/fonts/Inter-Black.otf';
import Light from '../assets/fonts/Inter-Light.otf';
import Regular from '../assets/fonts/Inter-Regular.otf';

import { AuthContext } from '../contexts/auth';
import { queryClient } from '../contexts/query-client';

import colors from '../components/UI/colors';
import { useStorageState } from '../interfaces/storage';
import { useWebSocket } from '../interfaces/websocket';

import DetailModal from '../components/UI/Details/Modal';

import { WebsocketContext } from '../contexts/websocket';

import TalkProvider from '../components/UI/Talk/Provider';

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

function WebsocketProvider(props) {
  const { message, sendMessage } = useWebSocket('u/');
  function insertData(oldData, newData) {
    return [...oldData, ...newData];
  }
  useEffect(() => {
    if (message) {
      const { context, data } = message;
      if (Object.hasOwn(data, 'add')) {
        if (Array.isArray(data.add)) {
          queryClient.setQueryData(context, (oldData) => {            
            return [...oldData, ...data.add];
          })
        }
      }
      return;      
    }
  }, [message])
  return (
    <WebsocketContext.Provider value={{ message, sendMessage}}>
      { props.children }
    </WebsocketContext.Provider>
  )

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
      <GestureHandlerRootView
        style={{
          backgroundColor: colors.theme.inputs.light.backgroundColor, 
          flex: 1 
        }}
        onLayout={onLayoutRootView}>
          { fontsLoaded ? (
            <QueryClientProvider client={queryClient}>
              <SessionProvider>
                <WebsocketProvider>
                  <SafeAreaProvider>
                    <TalkProvider>
                      <ActionSheetProvider>              
                        <SafeAreaView style={{ flex: 1}}>
                          {/* <KeyboardAvoidingView
                            behavior={Platform.OS !== 'ios' ? 'padding' : 'height'}
                            style={{ flex: 1}}
                          >
                          </KeyboardAvoidingView> */}
                          <Slot />
                          <DetailModal />
                          
                        </SafeAreaView>
                      </ActionSheetProvider>
                    </TalkProvider>
                  </SafeAreaProvider>
                </WebsocketProvider>                
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