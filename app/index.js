import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useSession } from './_layout';

import Bold from '../components/UI/text/Bold';
import styles from '../components/UI/styles';

export default function Index() {
  const { session } = useSession();  
  
  return (
    <View style={styles.View}>      
      { !session ? (
        <Redirect href={"/login"} />
      ) : (
        <Redirect href={"/(drawer)/home"} />
      )      
      }
    </View>
  )
  // return <Redirect href={"/(drawer)/home"} />;
}