import { useEffect } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';

import Bold from '../components/UI/text/Bold';
import { useStorageState } from '../interfaces/storage';

export default function Index() {  
  const [[isLoading, session]] = useStorageState('session');
  // const wsUrl = generateUrl('u/');
  // console.log("wsUrl",wsUrl);
  // const { connected, message, sendMessage } = useWebSocket(wsUrl);

  // useEffect(() => {
  //   console.log('index ws message', message);
  // }, [message]);

  if (isLoading) {
    return (
      <View>
        <Bold>Still loading</Bold>
      </View>
    )
  } else {
    if (!session) {
      return (
        <Redirect href={"/(unprotected)/login"} />
      )
    }
    return (
      <Redirect href={"/(drawer)/home"} />
    )
  }
}