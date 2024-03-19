import { View } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import Bold from '../components/UI/text/Bold';

export default function Index() {
  
  return (
    <View style={{ backgroundColor: 'transparent', flex: 1 }}>    
      { true ? (
        <Redirect href={"/login"} />
      ) : (
        <View><Bold>Juddhhhh</Bold></View>
      )      
      }
    </View>
  )
  // return <Redirect href={"/(drawer)/home"} />;
}