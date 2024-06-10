import { StyleSheet, View, } from 'react-native';

import colors from '../../../components/UI/colors';
import ListView from '../../../components/UI/List/View';
import DrawerScreen from '../../../components/UI/View/DrawerScreen';

export default function Convos() {
  const options = {};

  const viewStyled = StyleSheet.create({
    flex: 1,
    backgroundColor: colors.white,
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
