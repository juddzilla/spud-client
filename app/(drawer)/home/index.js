import { View, StyleSheet } from "react-native";
import DrawerScreen from '../../../components/DrawerScreen';
import Bold from '../../../components/UI/text/Bold';
import Light from '../../../components/UI/text/Light';
import Regular from '../../../components/UI/text/Regular';

import styles from "../../../components/UI/styles";

export default function Home() {  
  return (
    <>
        <View style={styles.View}>
          {DrawerScreen('Home')}
          <View style={Styled.container}>
            <Bold>Inter Bold</Bold>
            <Regular>Inter Regular</Regular>
            <Light>Inter Light</Light>        
          </View>
        </View>
      {/* <View style={styles.container}>
      </View>     */}
    </>
  );
}

const Styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});
