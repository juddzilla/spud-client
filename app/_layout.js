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
import { generateUrl, useWebSocket } from '../interfaces/websocket';

import DetailModal from '../components/UI/Details/Modal';
import TalkModal from '../components/UI/Talk/Modal';

import { WebsocketContext } from '../contexts/websocket';

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
  return (
    <WebsocketContext.Provider value={{ message, sendMessage}}>
      { props.children }
    </WebsocketContext.Provider>
  )

}

// function WebSocketeer() {
//   const [[isLoading, session]] = useStorageState('session');
//   // const wsUrl = generateUrl('u/');
//   // console.log("wsUrl",wsUrl);
//   const { connected, message, sendMessage } = useWebSocket('u/');

//   useEffect(() => {
//     console.log('index ws message', message);
//   }, [message]);

//   return <View></View>
// }

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
                <WebsocketProvider>
                  <ActionSheetProvider>              
                    <SafeAreaView style={{ flex: 1}}>
                      {/* <KeyboardAvoidingView
                        behavior={Platform.OS !== 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1}}
                      >
                      </KeyboardAvoidingView> */}
                      <Slot />
                      <DetailModal />
                      <TalkModal />
                    </SafeAreaView>
                  </ActionSheetProvider>
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