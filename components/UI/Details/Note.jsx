// list with list items
// do items have meta context?
// add to list via voice
// importance
// list timeline view
import { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import  { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { useDebouncedValue } from '../../../utils/debounce';

import DrawerScreen from '../../../components/DrawerScreen';
import Fetch from '../../../interfaces/fetch';
import Light from '../text/Light';

import Talk from '../../UI/actions/Talk';

import styles from '../styles';

import Options from './Options';

import colors from '../colors';

const NoteInput = ({ value, update }) => {  
  const [body, setBody] = useState('');
  const debouncedInput = useDebouncedValue(body, 500);  

  useEffect(() => {
    setBody(value);
  }, [value])


  useEffect(() => {
    if (value !== body) {
      update(body);        
    }
  }, [debouncedInput]);

  function updateState(text) {    
    setBody(text)
  }

  return (
    <TextInput
        style={{
          backgroundColor: colors.lightWhite,
          flex: 1,
          // margin: 12,
          paddingHorizontal: 16,
          paddingTop: 16,
          flexWrap: 'wrap',
          fontSize: 20,
          fontFamily: 'Inter-Regular',
        }}
        onChangeText={updateState}
        value={body}
        placeholder="type here"
        editable={true}
        multiline={true}
      />
  )

}

export default function Note() {
  const local = useLocalSearchParams();
  const baseUri = `notes/${local.uuid}/`;

  const [body, setBody] = useState('');
  const [title, setTitle] = useState('Note');

  const [showOptions, setShowOptions] = useState(false);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (!showOptions) {
      setAction('');
    }
  }, [showOptions, setAction]);

  useFocusEffect(
    useCallback(() => {      
      getData();    
      return () => {};
    }, [])
  );

  function getData() {
    if (!local.uuid) {
      return;
    }
    Fetch.get(baseUri)
      .then(res => {
        const [err, note] = res;        
        setBody(note.body);
        setTitle(note.title);
      })
      .catch(err => {
        console.warn('note detail error', err);
      })
  }

  function updateNote(body) {    
    Fetch.put(baseUri, {body});
  }

  function updateTitle(newTitle) {    
    setTitle(newTitle);
    setShowOptions(false);
    Fetch.put(baseUri, {title: newTitle});
  }

  function removeNote() {
    Fetch.remove(baseUri)
      .then(res => {
        const [err, success] = res;
        if (!err) {
          router.back();
        }
      })
  }



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
        cb: updateTitle
    },
    {
        name: 'remove',
        cb: removeNote
    }
];

  return (
    <View style={styles.View}>
      
      {DrawerScreen(title, () => <Options options={headerOptions} />)}    
      
      <View style={{flex: 1}}>
        <NoteInput value={body} update={updateNote} />
        {/* <TextInput
          style={{
            // flex: 1,
            margin: 12,
            padding: 10,
            flexWrap: 'wrap',
            fontSize: 20,
            fontFamily: 'Inter-Regular',
          }}
          onChangeText={updateNote}
          value={note}
          placeholder="type here"
          editable={true}
          multiline={true}
        /> */}
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