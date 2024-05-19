import { useEffect, useContext, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AnimatedEllipsis from 'rn-animated-ellipsis';

import Input from './Input';
import Exit from './Exit';
import Title from './Title';
import Menu from './Menu';
import Talk from '../actions/Talk';

import colors from '../colors';
import styles from '../styles';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

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
      const {error, messages} = response;
      if (error) {
        return Query.data;
      }
      return { ...Query.data, children: messages };
    },
  });

  useEffect(() => {
    if (!Query.data.children) {
      return;
    }
    const sorted = Query.data.children.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setMessages(sorted);
  }, [Query.data])

  const Message = ({ index, item }) => {

    const styled = StyleSheet.create({
      message: {
        paddingHorizontal: 8,       
        marginBottom: 24,
        // overflow: 'hidden',
        // backgroundColor: colors.white,
        // paddingVertical: 16,
      },
      header: {        
        // flexDirection: item.type === 'user' ? 'row-reverse' : 'row',
        // alignItems: 'flex-end',
        justifyContent: 'space-between',
        // height: 24,
        flexDirection: 'row', 
        alignItems: 'flex-end',
        marginBottom: 4,
        paddingHorizontal: 0,
        // paddingTop: 4,
      },
      body: {
        // flexDirection: item.type === 'user' ? 'row' : 'row-reverse',
        // justifyContent: 'flex-end',
        // alignItems: 'center',
        // borderRadius: 4,
        
        lineHeight: 24, 
        // paddingVertical: 10,
        paddingHorizontal: 1,
        // right: item.type === 'user' ? -8 : 8,
        // left: item.type === 'system' ? -8 : 0,
        // marginRight: 48,

       },
      date: { paddingBottom: 1, color: colors.lightText, fontSize: 10, marginHorizontal: 6 },
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
          {/* { item.created_at && 
            
          <Light style={styled.date}>{convoDate(item.created_at)}</Light>
          } */}
          
        </View>
        <View>            
          { (index === awaitingIndex && item.body === 'awaiting') ? (
            <AnimatedEllipsis numberOfDots={5} style={{fontSize: 20, color: colors.white}}/>
          ) : (
            <View style={styled.body}>

              <Regular style={{ color: colors.darkText, }}>{ item.body }</Regular>              
            </View>
            )}
        </View>
      </View>
    )
  };
  const flatlist = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 8,
      paddingHorizontal: 12,
    }  
  });

  const ListFooterComponent = () => {
    if (!messages.length || messages[0].type === 'system') {    
      return null;      
    }
    return Message({ index: awaitingIndex, item : {type: 'system', created_at: null, body: 'awaiting'}});
  };

  return (
    <View style={{...flatlist.container}}>
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

export default function Convo({item}) {    
  const queryKeys = item.context;
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
        width: Dimensions.get('window').width,     
        backgroundColor: colors.white,
      }}
    >   
      <View style={{...styles.row, height: 40}}>
        <Exit />
        <View style={{...styles.row, justifyContent: 'flex-end', flex: 1}}>                     
          <Menu />
        </View>
      </View>
      <View style={{flex: 1, paddingLeft: 20}}>
        <Title />
        <Messages uuid={queryKeys[1]}/>
      </View>

      <View style={{...styles.footer}}>
        <Input
          keys={queryKeys}
          onSubmit={createMessage} 
          placeholder='Create New Message'
          theme='dark' 
        /> 
        <Talk />
      </View>
    </View>
  )
}