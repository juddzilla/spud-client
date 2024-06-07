import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import colors from '../../../components/UI/colors';
import ListView from '../../../components/UI/List/View';


export default function Notes() {
  const context = ['notes'];

  const options = {
    actions: {
      placeholder: 'Create New Note',

    },
    filters: {
      placeholder: 'Search Notes',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc' },
        fields: ['title', 'updated_at'],
      },
    },
    storeKey: context,
    title: 'Notes'
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
