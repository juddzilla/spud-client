import { StyleSheet, View, } from 'react-native';

import colors from '../../../components/UI/colors';
import ListView from '../../../components/UI/List/View';
import DrawerScreen from '../../../components/UI/View/DrawerScreen';

export default function Convos() {
  const options = {};

  const styled = StyleSheet.create({
    flex: 1,
    backgroundColor: colors.convos,
  });

  return (
    <View style={{ flex: 1 }}>
      <DrawerScreen />
      <View style={styled}>
        <ListView options={{ ...options }} />
      </View>
    </View>
  );
}
