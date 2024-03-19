import { View, StyleSheet } from "react-native";
import DrawerScreen from '../../../components/DrawerScreen';
import Bold from '../../../components/UI/text/Bold';
import Light from '../../../components/UI/text/Light';
import Regular from '../../../components/UI/text/Regular';

export default function Home() {  
  return (
    <View style={styles.container}>
      {DrawerScreen('Home')}
      <View>
        <Bold >Inter Bold</Bold>
        <Regular>Inter Regular</Regular>
        <Light >Inter Light</Light>        
      </View>
    </View>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
