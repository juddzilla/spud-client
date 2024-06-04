import ListView from '../../../components/UI/List/View';
import { useLocalSearchParams } from 'expo-router';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import GlobalHeader from '../../../components/UI/Header';
import DrawerScreen from '../../../components/DrawerScreen';

import { queryClient } from '../../../contexts/query-client';

import List from '../../../components/UI/Details/List';

export default function Lists() {
  const local = useLocalSearchParams();
  const storeKey = ['lists'];
  const title = ['Lists'];

  let item = null;

  if (local.uuid && local.uuid !== 'null') {
    const data = queryClient.getQueryData(storeKey);
    item = data.results.find(i => i.uuid === local.uuid);
    storeKey.push(local.uuid);
  }
  if (local.title && local.title !== 'null') {
    title.push(local.title);
  }
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
    title
  };

  let drawerTitle = 'Spud';
  let headerTitle = title[0];

  if (title.length > 1) {
    drawerTitle = title[0]
    headerTitle = title[1];
  }

  return (
    <>
      <DrawerScreen title={drawerTitle} />
      <GlobalHeader keys={storeKey.filter(Boolean)} title={title.filter(Boolean)} />
      <View style={{ flex: 1, position: 'relative', top: -36, borderTopLeftRadius: 36, overflow: 'hidden' }}>
        {
          storeKey.length === 1 &&
          <ListView options={{ ...options }} />
        }
        {storeKey.length === 2 &&
          <List item={{ context: storeKey, ...item }} />
        }
      </View>
    </>
  );
}
