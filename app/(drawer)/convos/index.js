// list of convos
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';

import { Link } from 'expo-router';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

// import { Text } from 'react-native';
import DrawerScreen from '../../../components/DrawerScreen';


export default function Convos() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });

  
  const Item = ({id, title}) => (
    <View style={styles.item}>
      <Link href={`/convos/${id}`}>
        <Text style={styles.title}>{title}</Text>
      </Link>
    </View>
  );

  return (
    <>
      {DrawerScreen('Conversations')}
      <Text>Cssonvos</Text>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} id={item.id} />}
        keyExtractor={item => item.id}
      />
    </>
  );
}