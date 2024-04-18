import { View } from 'react-native';
import { Redirect } from 'expo-router';

import Bold from '../components/UI/text/Bold';

import { useStorageState } from '../interfaces/storage';
export default function Index() {  
  const [[isLoading, session]] = useStorageState('session');

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