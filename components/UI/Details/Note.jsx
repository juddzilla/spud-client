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

export default function Note() {
  const [title, setTitle] = useState('List');
  const [note, setNote] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const styles = StyleSheet.create({
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
  });

  useEffect(() => {
    Fetch.get('note')
    .then(res => {
      setNote(res.body);
      setTitle(res.title);
    })
    .catch(err => { console.warn('note Error', err)});
  }, []);

  function headerRight() {
    return (
      <>
       <Modal
          transparent={true}
          visible={showOptions}
          onRequestClose={() => {
            
            setShowOptions(!showOptions);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>              
              <Bold style={styles.modalText}>Delete</Bold>
              <Bold style={styles.modalText}>Rename</Bold>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setShowOptions(!showOptions)}>
                <Bold style={styles.textStyle}>Hide Modal</Bold>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable onPress={ () => setShowOptions(!showOptions)}>
          <Icon name='dots' />
        </Pressable>
      </>
    )
  }
  
  return (
    <View style={{ flex: 1}}>
      
      {DrawerScreen(title, true, headerRight)}
      <TextInput
        style={{
          flex: 1,
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
  )
}