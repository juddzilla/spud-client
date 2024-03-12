// convo list of q's and a's
// ability to click on older bit of convo to use as context (v2)
// ability to summarize entire convo
// archive
// delete
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Pressable, TextInput, View } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import DrawerScreen from '../../../components/DrawerScreen';

import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import Fetch from '../../../interfaces/fetch';

export default function Convo() {
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState(null);
  const [title, setTitle] = useState('Convo');
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  const Message = ({ index, item}) => {
    const itemStyle = {
      
      paddingHorizontal: 4,      
      marginVertical: 2,      
      borderRadius: 8,
      borderWidth: 1,
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
      <View style={itemStyle}>
        <View style={{ flexDirection: 'row'}}>
          <Bold>{ item.type }</Bold>
          <Light>{ item.updated }</Light>
        </View>
        <Regular>{ item.body }</Regular>
      </View>
    )
  };

useEffect(() => {
  Fetch.get('convo')
  .then(res => {
    setMessages(res.messages);
    setTitle(res.title);
  })
  .catch(err => { console.warn('Convo Error', err)});
}, []);

console.log("Local:", local, "Global:", glob.user);

const styles = StyleSheet.create({
  input: {
    height: 64,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

function onChange() {}

  return (
    <View style={{flex: 1}}>
      {DrawerScreen(title, true)}
      <View style={{flex: 1}}>
        <FlatList
          data={messages}
          renderItem={Message}
          keyExtractor={item => item.id}        
          inverted={true}        
          // ListHeaderComponent={ListHeaderComponent}          
        />   
      </View>
      <View>
        <TextInput
          style={styles.input}
          // onChangeText={onChange}
          value={message}
          placeholder="type here"
        />
      </View>
    </View>
  )
}