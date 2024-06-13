import { StyleSheet, View } from 'react-native';
import DrawerScreen from '../../../components/UI/View/DrawerScreen';
import colors from '../../../components/UI/colors';
import ListView from '../../../components/UI/List/View';


export default function Notes() {
  const options = {};

  const styled = StyleSheet.create({
    backgroundColor: colors.notes,
    flex: 1,
  });

  return (
    <>
      <DrawerScreen />
      <View style={styled}>
        <ListView options={{ ...options }} />
      </View>
    </>
  );
}
