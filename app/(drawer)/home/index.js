import { Text, View, StyleSheet } from "react-native";
import DrawerScreen from '../../../components/DrawerScreen';
import TextContainer from '../../../components/UI/layout/Text-Container';
import Bold from '../../../components/UI/text/Bold';
import Light from '../../../components/UI/text/Light';
import Regular from '../../../components/UI/text/Regular';

export default function Home() {
  return (
    <>
      <View style={styles.container}>
        {DrawerScreen('Home')}
        <TextContainer>
          <Bold >Inter Bold</Bold>
          <Regular>Inter Regular</Regular>
          <Light >Inter Light</Light>
        </TextContainer>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// import { Text } from 'react-native';
// // most recent
// // most used

// export default function Home() {
//     return (
//         <Text>Home view</Text>
//     )
// }