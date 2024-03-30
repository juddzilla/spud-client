// convo list of q's and a's
// ability to click on older bit of convo to use as context (v2)
// ability to summarize entire convo
// archive
// delete
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import  { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import moment from 'moment';

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

import Options from '../actions/Options';

export default function Convo() {  
  const local = useLocalSearchParams();

  const baseUri = `convos/${local.uuid}/`;    
  const initialTitle = local.title ? local.title : 'Conversation';
  const sortOn = ['order', 'updated_at'];

  const [filter, setFilter] = useState('');  
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showCompleted, setShowCompleted] = useState(null);
  const [sort, setSort] = useState({ property: 'order', direction: 'desc' });
  const [title, setTitle] = useState('Convo');
  
  const [showOptions, setShowOptions] = useState(false);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (!showOptions) {
      setAction('');
    }
  }, [showOptions, setAction]);

  useFocusEffect(
    useCallback(() => {
      setInitialLoadComplete(true);
      getData();    
      return () => {
        setInitialLoadComplete(false);
      };
    }, [])
  );

  useEffect(() => {
    if (initialLoadComplete) {
      getData();
    }
  }, [filter, sort])

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
          <Light style={styled.date}>{formattedDate(item.created_at)}</Light>
        </View>
        <Regular style={styled.body}>{ item.body }</Regular>
      </View>
    )
  };

  function getData() {
    if (!local.uuid) {
      return;
    }
    Fetch.get(baseUri)
      .then(res => {            
        const [err, convo] = res;        
        // TODO ERROR HANDLING
        if (!err) {          
          setTitle(convo.title);
          setMessages(convo.messages);        
        }
      })
      .catch(err => { console.warn('Convo Error', err)});
  }

  function removeConvo() {    
    Fetch.remove(baseUri)
      .then((res) => {
        const [err] = res;        
        // TODO [{"error": "Not Authorized", "statusCode": 400}, null]
        if (err) {
          // do global error handling
        }
        if (!err) {
          router.back();    
        }
      });
  }

  function updateTitle(newTitle) {
    setTitle(newTitle);
    setShowOptions(false);
    Fetch.put(baseUri, {title: newTitle});
  }

  function create(text) {
    if (!text.trim().length) {
      return;
    }
    
    //TODO below for dev only
    messages.unshift( {id: messages.length+3, type: 'system', body: text}, {id: messages.length+2, type: 'user', body: text});
    setMessages([...messages]);  
    Fetch.post(baseUri, {body: text})
    .then(res =>  {
      const [err, message] = res;
      
      if (!err) {        
        setMessages([...messages, message]);  
      }
    })
    
  }

  const flatlist = StyleSheet.create({
    container: {
      flex: 1,
    }  
  })

  const headerOptions = [
    {
        name: 'rename',
        cb: updateTitle
    },
    {
        name: 'remove',
        cb: removeConvo
    },
    {
        name: 'summarize',
        cb: () => { console.log('summ')}
    }
  ];

  const formattedDate = (date) => {
    const now = moment();
    const diffInDays = now.diff(date, 'days');

    if (diffInDays === 0) {
      // Date is from today, display time only
      return moment(date).format('LT');
    } else if (diffInDays < 7) {
      // Date is from the past 7 days, display day of the week and time
      return  moment(date).format('ddd MMMM DD, hh:mma');
    } else {
      // Date is more than 7 days ago, display full date and time
      return  moment(date).format('MMMM DD, hh:mma');
    }
  };

  return (
    <View style={styles.View}>
      {DrawerScreen(title, () => <Options options={headerOptions} />)}    
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