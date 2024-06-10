import { StyleSheet, View } from 'react-native';
import DrawerScreen from '../../../components/UI/View/DrawerScreen';
import colors from '../../../components/UI/colors';
import ListView from '../../../components/UI/List/View';


export default function Notes() {
  const options = {};

  const viewStyled = StyleSheet.create({
    flex: 1,
    backgroundColor: 'white',
  });

  return (
    <>
      <DrawerScreen />
      <View style={{ flex: 1 }}>
        <View style={viewStyled}>
          <ListView options={{ ...options }} />
        </View>
      </View>
    </>
  );
}
