import { Text, View, StyleSheet } from "react-native";

import DrawerScreen from '../../../components/DrawerScreen';

export default function Page() {
  return (
    <>
      <View style={styles.container}>
        {DrawerScreen('Home')}        
        <Text style={{ fontSize: 24 }}>Index pasge of Home Drawer</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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