import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, } from 'react-native';

import colors from '../../../components/UI/colors';
import Convo from '../../../components/UI/Details/Convo';
import ListView from '../../../components/UI/List/View';

export default function Convos() {
  const context = ['convos'];

  const options = {
    actions: {
      placeholder: 'Create New Conversation',
    },
    filters: {
      placeholder: 'Search by Title',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc' },
        fields: ['title', 'updated_at'],
      },
    },
    menuOptions: [{ display: 'Summarize', name: 'summarize' }],
    storeKey: context,
    title: 'Convos'
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
