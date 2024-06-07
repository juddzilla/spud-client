import { StyleSheet, View, } from 'react-native';

import colors from '../../../components/UI/colors';
import ListView from '../../../components/UI/List/View';

export default function Lists() {
  const storeKey = ['lists'];
  const options = {
    actions: {
      placeholder: 'Create New List',

    },
    filters: {
      placeholder: 'Search Lists',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc' },
        fields: ['title', 'updated_at'],
      },
    },
    storeKey,
  };

  const viewStyled = StyleSheet.create({
    flex: 1,
    backgroundColor: 'white',
  });

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.brand }}>
        <View style={viewStyled}>
          <ListView options={{ ...options }} />
        </View>
      </View>
    </>
  );
}
