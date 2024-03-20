import { useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useSession } from './_layout';

import Bold from '../components/UI/text/Bold';
import styles from '../components/UI/styles';
// import { AuthContext } from './_layout';
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

  // return (
  //   <View style={styles.View}>      
  //     { (!isLoading && !session) ? (
        
  //     ) : (
       
  //     )      
  //     }
  //   </View>
  // )
  // return <Redirect href={"/(drawer)/home"} />;
}