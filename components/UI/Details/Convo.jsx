// convo list of q's and a's
// ability to click on older bit of convo to use as context (v2)
// ability to summarize entire convo
// archive
// delete
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
// import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import DrawerScreen from '../../../components/DrawerScreen';

import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import Fetch from '../../../interfaces/fetch';
import Icon from '../icons';
import colors from '../colors';


import Input from '../../UI/actions/Input';
import Talk from '../../UI/actions/Talk';

import styles from '../styles';

export default function Convo() {  
  const [messages, setMessages] = useState(null);
  const [title, setTitle] = useState('Convo');

  
  // const glob = useGlobalSearchParams();
  // const local = useLocalSearchParams();

  const Message = ({ index, item}) => {
    const styled = StyleSheet.create({
      message: {
        paddingHorizontal: 16, 
        paddingTop: 8,     
        marginBottom: item.type === 'system' ? 32 : 0, 
        marginTop: index === 0 ? 16 : 0,     
        borderRadius: 8,
        flex: 1,        
        shadowColor: colors.darkestBg,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
      },
      header: {        
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: 20,
      },
      body: { lineHeight: 24 },
      date: { color: colors.darkestBg, fontSize: 11 },
      user: {  },
    });

    const displayNameMap = {
      system: 'Spud',
      user: 'You',
    }

    return (
      <View style={styled.message}>
        <View style={styled.header}>
          <Bold style={styled.user}>{ displayNameMap[item.type] }</Bold>
          <Light style={styled.date}>Today, 11:23am</Light>
        </View>
        <Regular style={styled.body}>{ item.body }</Regular>
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

// console.log("Local:", local, "Global:", glob.user);

const flatlist = StyleSheet.create({
  container: {
    flex: 1,
  }  
})

function headerRight() {
  return (
    <View>
      <Icon name="dots" />
    </View>
  )
}

function create(text) {
  console.log('create t', text);
  if (!text.trim().length) {
    return;
  }
  messages.unshift( {id: messages.length+3, type: 'system', body: text}, {id: messages.length+2, type: 'user', body: text});
  setMessages([...messages]);  
}

function onChange() {}

  return (
    <View style={styles.View}>
      {DrawerScreen(title, headerRight)}
      <View style={flatlist.container}>
        <FlatList
          
          data={messages}
          renderItem={Message}
          keyExtractor={item => item.id}        
          inverted={true}
          // ListHeaderComponent={ListHeaderComponent}          
        />   
      </View>

      <View style={styles.footer}>
        <Input onSubmit={create} placeholder='Create New Message'/> 
        <Talk />
      </View>
    </View>
  )
}