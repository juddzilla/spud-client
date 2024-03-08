// list of convos
import { useState, useEffect } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { StatusBar  } from 'react-native';
import Bold from '../../../components/UI/text/Bold';
import Black from '../../../components/UI/text/Black';
import Regular from '../../../components/UI/text/Regular';
import Light from '../../../components/UI/text/Light';

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Link, router } from 'expo-router';

const DATA = [
  {
    id: 'bd7wacbea-c1b1-46c2-aedq5-3ad53abb28ba',
    length: 10,
    title: 'First Item',
    updated: '12345',
  },
  {
    id: '3acw68afc-c605-48wd3-a4f8-fbd91aa97f63',
    length: 30,
    title: 'Second Item',
    updated: '12346',
  },
  {
    id: '586q94a0f-3da1-471f-bde96-145571e29d72',
    length: 20,
    title: 'Third Item',
    updated: '12346',
  },
  {
    id: 'f-cq1b1-46de2-aed5-3ad53abb28ba',
    length: 10,
    title: 'First Item',
    updated: '12345',
  },
  {
    id: '3ac68afc-c605-48wd3-a4f8-fbd91qaa97f63',
    length: 30,
    title: 'Second Item',
    updated: '12346',
  },
  {
    id: '58694a0f-3da1-4e71f-bd96-145571e2d9d72',
    length: 20,
    title: 'Third Item',
    updated: '12346',
  },
  {
    id: 'wss-c1bw1-46c2-aed5a-3ad53abb28ba',
    length: 10,
    title: 'First Item',
    updated: '12345',
  },
  {
    id: '3qac68afc-c605-48d3-a4f8-fbdd91aa97f63',
    length: 30,
    title: 'Second Item',
    updated: '12346',
  },
  {
    id: '58694a0f-3daq1-471f-bd96-145571e2s9d72',
    length: 20,
    title: 'Third Item',
    updated: '12346',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aedq5-3awd53abb28ba',
    length: 10,
    title: 'First Item',
    updated: '12345',
  },
  {
    id: '3ac68afc-c605-48rwd3-a4f8-fbd91aa97f63',
    length: 30,
    title: 'Second Item',
    updated: '12346',
  },
  {
    id: '58694a0f-3da1-471f-bde96-14557r1e29d72',
    length: 20,
    title: 'Third Item',
    updated: '12346',
  },
  {
    id: 'bd7adcbea-c1b1-46de2-aedr5-3ad53abb28ba',
    length: 10,
    title: 'First Item',
    updated: '12345',
  },
  {
    id: '3ac68wafc-c605-48d3-a4f8-fbd91qaa97f63',
    length: 30,
    title: 'Second Item',
    updated: '12346',
  },
  {
    id: '58694a0f-3qda1-471f-bd96-145571e2d9d72',
    length: 20,
    title: 'Third Item',
    updated: '12346',
  },
  {
    id: 'bd7acbesa-ca1b1-46c2-aed5a-3ad53abb28ba',
    length: 10,
    title: 'First Item',
    updated: '12345',
  },
  {
    id: '3ac68afc-c605-48sd3-a4f8-fbdd91aa97f63',
    length: 30,
    title: 'Second Item',
    updated: '12346',
  },
  {
    id: '58694a0f-3da1-47d1f-bd96-145571e2s9d72',
    length: 20,
    title: 'Third Item',
    updated: '12346',
  },
];

// import { Text } from 'react-native';
import DrawerScreen from '../../../components/DrawerScreen';

const getData = async ({ filter, sort }) => {
  return [];
}


export default function Convos() {
  const [convos, setConvos] = useState([]);
  const [endOfList, setEndOfList] = useState(false);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState({ property: 'date', direction: 'desc'});

  useEffect(() => {
    setConvos(DATA);
  }, [])

  function onLongPress(index) {
    const id = convos[index].id;
    const selectedValue = !convos[index].selected;

    const selectedIndex = selected.indexOf(id);
    if (selectedIndex !== -1) {
      selected.splice(selectedIndex, 1);
    } else {
      selected.push(id);
    }
    convos[index].selected = selectedValue;
    setConvos([...convos]);
    setSelected([...selected]);
  }
  function onPress(id) {
    router.push(`/convos/${id}`);
  }
  function createPrompt() {}
  function create() {}

  function onFilterUpdate({ target, text }) {
    // debounce
    console.log('FILT', filter);
    setFilter(text);
  }

  function onMicPress() {
    console.log('mic press');
  }

  function removeSelected() {
    const filtered = convos.filter(convo => !selected.includes(convo.id));
    setConvos(filtered);
    setSelected([]);
  }

  function headerRight() {
    if (!selected.length) {
      return null;
    }
    return (
      <Pressable onPress={removeSelected}>
        <FontAwesome name="trash" size={24} color="black" />
      </Pressable>
    )
  }
  
  function infiniteScroll() {
    const per = 10;
    console.log('infiniteScroll');
  }

  
  const Item = ({ index, item }) => {
    const { id, selected, title, updated } = item;

    const itemStyle = {
      // backgroundColor: selected ? 'white' : 'transparent',
      backgroundColor: 'white',
      paddingHorizontal: 4,
      paddingVertical: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      // height: 64,
      shadowColor: "#e2e8f0",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,

elevation: 24,
    };
    return (
    <Pressable style={itemStyle} onPress={() => onPress(id)} onLongPress={() => onLongPress(index)}>
      {/* <View style={{ backgroundColor: 'red', alignItems: 'center', width: 20, justifyContent: 'center'}}>
        <Text>{index}</Text>
      </View> */}
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <View style={{ height: 44, width:64, marginRight: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="chatbubbles-outline" size={24} color="black" style={{}} />
        </View>
        <View>
          <Bold style={{ fontSize: 16, marginBottom: 8 }}>{title}</Bold>
          <Light style={{ fontSize: 12, color: '#6b7280' }}>"The last bit on convo goes here..."</Light>
        </View>
      </View>
    </Pressable>    
  )};

  return (
    <>
      {DrawerScreen('Conversations', headerRight)}
      
      {/* <View>
        <Text>Sort</Text>
        <Text>Sort</Text>
      </View> */}
      <FlatList
        data={convos}
        renderItem={Item}
        keyExtractor={item => item.id}
        onEndReached={infiniteScroll}
        ListHeaderComponent={
          <View style={{padding: 8 }}>
            <Ionicons name="chatbox-ellipses-outline" size={180} color="#cbd5e1" style={{ position: 'absolute', zIndex: -1, left: -10, top: -78}}/>
            <Black style={{ fontSize: 32 }}>Conversations</Black>            
          </View>
        }
      />
      <View style={{ padding: 8, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center'}}>        
        <TextInput style={{
          height: 40,
          // margin: 12,
          borderWidth: 1,
          padding: 10,
          flex: 1,
          
        }} value={filter} onChange={onFilterUpdate} />
        <Pressable onPress={onMicPress} style={{
          height: 40,       
          width: 40,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          
        }}>
          <FontAwesome name="microphone" size={24} color="black" />
        </Pressable>
      </View>
    </>
  );
}