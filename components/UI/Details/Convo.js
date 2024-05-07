// convo list of q's and a's
// ability to click on older bit of convo to use as context (v2)
// ability to summarize entire convo
// archive

import { useEffect, useContext, useState } from 'react';
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

import colors from '../colors';
import styles from '../styles';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import { queryClient } from '../../../contexts/query-client';
import { WebsocketContext } from '../../../contexts/websocket';
import Fetch from '../../../interfaces/fetch';
import { convoDate } from '../../../utils/dates';

const Messages = ({uuid}) => {
  const queryKeys = ['convos', uuid];
  const baseUri = `${queryKeys.join('/')}/`;
  const awaitingIndex = 1000000;
  const [messages, setMessages] = useState([]);

  const Query = useQuery({
    queryKey: queryKeys,
    queryFn: async () => {
      const response = await Fetch.get(baseUri);    
      if (!response.error) {
        setMessages(response.messages);
      }
      return response.messages || [];
    },
  });

  useEffect(() => {
    if (!Query.data) {
      return;
    }
    const sorted = Query.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setMessages(sorted);
  }, [Query.data])

  const Message = ({ index, item }) => {
    const styled = StyleSheet.create({
      message: {
        paddingHorizontal: 8, 
        paddingTop: 8,
        marginTop: 10,     
        borderRadius: 8,
        flex: 1,
      },
      header: {        
        flexDirection: 'row',
        justifyContent: 'space-between',        
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
    if (!messages.length || messages[0].type === 'system') {    
      return null;      
    }
    return Message({ index: awaitingIndex, item : {type: 'system', created_at: null, body: 'awaiting'}});
  };

  return (
    <View style={flatlist.container}>
      <FlatList          
        data={messages}
        renderItem={Message}
        keyExtractor={item => item.id}        
        inverted={true}    
        ListHeaderComponent={ListFooterComponent}
      />
    </View>
  )
}

export default function Convo({item, left}) {    
  const queryKeys = ['convos', item.uuid];

  const { sendMessage } = useContext(WebsocketContext);

  function createMessage(text) {
    sendMessage({
      action: 'create',
      context: queryKeys,
      data: { body: text, },
    });
  }

  return (
    <View
      style={{
        ...styles.View,        
        left: -(left),
        width: Dimensions.get('window').width - (left*2),        
      }}
    >   
      <Messages uuid={item.uuid}/>

      <View style={{...styles.footer}}>
        <Input
          onSubmit={createMessage} 
          placeholder='Create New Message'
          theme='dark' 
        /> 
        <Talk />
      </View>
    </View>
  )
}