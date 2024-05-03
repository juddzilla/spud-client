// convo list of q's and a's
// ability to click on older bit of convo to use as context (v2)
// ability to summarize entire convo
// archive

import { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import AnimatedEllipsis from 'rn-animated-ellipsis';

import Heading from './Heading';

import Input from '../actions/Input';
import Talk from '../actions/Talk';
import { DetailObservable } from '../Details/observable';

import colors from '../colors';
import styles from '../styles';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import { queryClient } from '../../../contexts/query-client';
import Fetch from '../../../interfaces/fetch';
import { convoDate } from '../../../utils/dates';

import { generateUrl, useWebSocket } from '../../../interfaces/websocket';

export default function Convo({item, left}) {    
  const queryKeys = ['convos', item.uuid];
  const baseUri = `convos/${item.uuid}/`;    
  // for below, if object passed to useWebSocket, then to url params within, infinit cycle. must stringify first. idk why TODO
  const wsUrl = generateUrl('convo/chat/', { uuid: item.uuid});

  const [messages, setMessages] = useState([]);
  const [awaiting, setAwaiting] = useState(false);
  
  const { connected, message, sendMessage } = useWebSocket(wsUrl);
  // const { connected, message, sendMessage } = useWebSocket('convo_chat');

  const awaitingIndex = 1000000;

  useEffect(() => {
    if (message) {    
      if (message.type === 'system') {

        setAwaiting(false);  
      }
      setMessages([message, ...messages]);
    }
  }, [message])

  // useEffect(() => {
  //   console.log('MESSAGES3333', messages);
  // }, [messages])

  useEffect(() => {
    DetailObservable.subscribe((value) => {      
      console.log('deets', value);
      // setItem(value);
    })
    return () => {
      DetailObservable.unsubscribe();
    }
  }, []);
  
  const Query = useQuery({
    queryKey: queryKeys,
    queryFn: async () => {
      const response = await Fetch.get(baseUri);     
      // console.log("response", response.messages);
      if (!response.error) {
        setMessages(response.messages);
      }
      return response.messages || [];
    },
  });

  const messageMutation = useMutation({
    mutationFn: async (text) => {
      if (!text.trim().length) {
        return;
      }

      try {
        setAwaiting(true);
        sendMessage({body: text});
        // return await Fetch.post(`${baseUri}chat`, {body: text});
        return true;
      } catch (error) {
        console.warn('Create Convo Message Error: ', error);
      }

    },
    onSuccess: (data) => {
      // if (!data.error) {
      //   setMessages([data, ...messages]);
      //   queryClient.setQueryData([queryKeys[0]], oldData => {                    
      //     return oldData.map(old => {     
            
      //       if (old.uuid === item.uuid) {              
      //         let number = parseInt(old.subheadline);
      //         number++;
      //         let subheadline = number + ' Item';            
      //         if (number !== 1) {
      //           subheadline = subheadline + 's';
      //         }
  
      //         return {
      //           ...old,
      //           subheadline,
      //           updated_at: data.created_at,
      //         }
      //       }
      //       return old;
      //     });
      //   });
      //   setTimeout(() => {
      //     setAwaiting(false);
      //   }, 5000)
      // }
      console.log('onsuccess', data);
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      try {
        return await Fetch.put(baseUri, data);
      } catch (error) {
        console.warn('Update List Error:', error);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys, oldData => {            
        return {...oldData, ...data};
      });
      queryClient.setQueryData([queryKeys[0]], oldData => {                    
        return oldData.map(old => {
          if (old.uuid !== item.uuid) {
            return old;
          }
          return {
            ...old,
            headline: data.title,
            updated_at: data.updated_at,
          }
        });
      });
    },
  });
  
  const removeMutation = useMutation({
    mutationFn: async () => {
      try {
        return await Fetch.remove(baseUri);
      } catch (error) {
        console.warn('Remove Convo Error: ', error);
      }
      
    },
    onSuccess: () => {
      queryClient.setQueryData([queryKeys[0]], oldData => {                    
        return oldData.map(old => {
          if (old.uuid !== item.uuid) {
            return old;
          }
          return null;
        }).filter(Boolean);        
      });
      queryClient.removeQueries({ queryKey: queryKeys, exact: true });
      DetailObservable.notify(null);      
    },
  });

  const Message = ({ index, item }) => {
    const styled = StyleSheet.create({
      message: {
        paddingHorizontal: 8, 
        paddingTop: 8,
        marginTop: 10,     
        borderRadius: 8,
        flex: 1,
        // backgroundColor: index % 2 == 0 ? 'green' : 'blue'
      },
      header: {        
        flexDirection: 'row',
        justifyContent: 'space-between',
        // ...styles.row,
        alignItems: 'flex-end',
        height: 20,
        marginBottom: 6,
      },
      body: { color: colors.darkText, lineHeight: 24, paddingHorizontal: 6 },
      date: { color: colors.lightText, fontSize: 10, marginLeft: 6, paddingBottom: 1 },
      user: { color: colors.black },
    });

    const displayNameMap = {
      system: 'Spud',
      user: 'You',
    }

    return (
      <View style={styled.message}>
        <View style={styled.header}>
          <Bold style={styled.user}>{ displayNameMap[item.type] }</Bold>
          { item.created_at && 
            <Light style={styled.date}>{convoDate(item.created_at)}</Light>
          }
        </View>
        { (index === awaitingIndex && item.body === 'awaiting') ? (
          <AnimatedEllipsis numberOfDots={5} style={{fontSize: 20, color: colors.white}}/>
        ) : (
          <Regular style={styled.body}>{ item.body }</Regular>
        )}
      </View>
    )
  };
  const flatlist = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 8,
    }  
  });

  const ListFooterComponent = () => {
    
    if (!awaiting) {
      return null;      
    }
    return Message({ index: awaitingIndex, item : {type: 'system', created_at: null, body: 'awaiting'}});
  };

  const headerOptions = [    
    {
        name: 'remove',
        cb: removeMutation.mutate
    },
    // {
    //     name: 'summarize',
    //     cb: () => { console.log('summ')}
    // }
  ];

  return (
    <View
      style={{
        ...styles.View,
        left: -(left),
        width: Dimensions.get('window').width - left,                
      }}
    >   
      <Heading mutations={{ update: updateMutation }} headerOptions={headerOptions} />
      <View style={flatlist.container}>
        <FlatList          
          data={messages}
          renderItem={Message}
          keyExtractor={item => item.id}        
          inverted={true}    
          ListHeaderComponent={ListFooterComponent}
        />
        {/* { setAwaiting &&
          Message({ index: 100000, item : {type: 'system', created_at: null, body: 'awaiting'}})
        } */}
      </View>

      <View style={{...styles.footer}}>
        <Input
          onSubmit={messageMutation.mutate} 
          placeholder='Create New Message'
          theme='dark' 
        /> 
        <Talk />
      </View>
    </View>
  )
}