// convo list of q's and a's
// ability to click on older bit of convo to use as context (v2)
// ability to summarize entire convo
// archive
// delete
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Pressable, TextInput, View } from 'react-native';
// import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import DrawerScreen from '../../../components/DrawerScreen';

import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import Fetch from '../../../interfaces/fetch';
import Icon from '../icons';
import colors from '../colors';


import ActionBar from '../actions/Input';
export default function Convo() {
  const [creating, setCreating] = useState('');
  const [messages, setMessages] = useState(null);
  const [title, setTitle] = useState('Convo');
  const [focus, setFocus] = useState(false);
  
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

const actions = StyleSheet.create({
  container: {
    backgroundColor: focus ? 'white' : 'transparent',    
    // borderTopColor: colors.darkBg,
    // borderTopWidth: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    
    paddingLeft: 32,
    paddingRight: 16,
    paddingVertical: 12,
  },
  
});

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

function create() {
  setMessages([...messages, {type: 'user', body: creating}]);
  setCreating('');
}

function onChange() {}

  return (
    <View style={{flex: 1}}>
      {DrawerScreen(title, true, headerRight)}
      <View style={flatlist.container}>
        <FlatList
          
          data={messages}
          renderItem={Message}
          keyExtractor={item => item.id}        
          inverted={true}
          // ListHeaderComponent={ListHeaderComponent}          
        />   
      </View>
      <ActionBar />
      
      
    </View>
  )
}