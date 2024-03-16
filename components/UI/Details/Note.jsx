// list with list items
// do items have meta context?
// add to list via voice
// importance
// list timeline view

import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import DrawerScreen from '../../../components/DrawerScreen';
import Fetch from '../../../interfaces/fetch';
import Icon from '../icons';
import Bold from '../text/Bold';
import Light from '../text/Light';

import Input from '../../UI/actions/Input';
import Talk from '../../UI/actions/Talk';

import styles from '../styles';

import Options from '../actions/Options';

export default function Note() {
  const [title, setTitle] = useState('List');
  const [note, setNote] = useState('');

  useEffect(() => {
    Fetch.get('note')
    .then(res => {
      setNote(res.body);
      setTitle(res.title);
    })
    .catch(err => { console.warn('note Error', err)});
  }, []);

  const styled = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    date: {
      container: {      
        flexDirection: 'row',
        // backgroundColor: 'green',
        flex: 1,
        // justifyContent: 'flex-end',
        paddingLeft: 8,
        // paddingTop: 16,        
      },
      body: {
        fontSize: 12,
      }
    }
  });

  const headerOptions = [
    {
        name: 'rename',
        cb: () => {}
    },
    {
        name: 'remove',
        cb: () => {}
    }
];

  return (
    <View style={styles.View}>
      
      {DrawerScreen(title, () => <Options options={headerOptions} />)}    
      
      <View style={{flex: 1}}>
        <TextInput
          style={{
            // flex: 1,
            margin: 12,
            padding: 10,
            flexWrap: 'wrap',
            fontSize: 20,
            fontFamily: 'Inter-Regular',
          }}
          onChangeText={(text) => setNote(text)}
          value={note}
          placeholder="type here"
          editable={true}
          multiline={true}
        />
      </View>
      <View style={styles.footer}>
        <View style={styled.date.container}>
          <Light style={styled.date.body}>Last Updated: Today, 12:34pm</Light>
        </View>
        {/* <Input create={() => {}} placeholder='' /> */}

        <Talk />
      </View>
    </View>
  )
}