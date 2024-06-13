import { useEffect, useContext, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AnimatedEllipsis from 'rn-animated-ellipsis';

import { DetailStyles } from './styles';

import TalkButton from '../Talk/Button';
import { useLocalSearchParams, } from 'expo-router';

import colors from '../colors';
import styles from '../styles';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import { WebsocketContext } from '../../../contexts/websocket';
import Fetch from '../../../interfaces/fetch';
import { convoDate } from '../../../utils/dates';
import ViewHead from '../View/Header';


const Messages = ({ context }) => {
  const baseUri = `${context.join('/')}/`;
  const awaitingIndex = 1000000;
  const [messages, setMessages] = useState([]);

  const Query = useQuery({
    // enabled: false,
    initialData: {
      children: [],
    },
    queryKey: context,
    queryFn: async () => {
      const response = await Fetch.get(baseUri);
      const { error, messages } = response;
      if (error) {
        return Query.data;
      }
      return { ...Query.data, children: messages };
    },
  });

  useEffect(() => {
    if (!Query.data || !Query.data.children) {
      return;
    }
    const sorted = Query.data.children.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setMessages(sorted);
  }, [Query.data])

  const Message = ({ index, item }) => {

    const styled = StyleSheet.create({
      ellipsis: {
        fontSize: 20,
        color: colors.darkText,
      },
      message: {
        paddingHorizontal: 8,
        marginBottom: 24,
      },
      header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 4,
        paddingHorizontal: 0,
        // backgroundColor: 'yellow', 
      },
      text: {
        color: colors.darkText,
        fontSize: 16,
        lineHeight: 24,
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
          <Bold style={styled.user}>{displayNameMap[item.type]}</Bold>
          {item.created_at &&

            <Light style={styled.date}>{convoDate(item.created_at)}</Light>
          }

        </View>
        <View>
          {(index === awaitingIndex && item.body === 'awaiting') ? (
            <AnimatedEllipsis numberOfDots={5} style={styled.ellipsis} />
          ) : (
            <View>

              <Regular style={styled.text}>{item.body}</Regular>
            </View>
          )}
        </View>
      </View>
    )
  };

  const flatlist = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 44,
      paddingHorizontal: 8,
    }
  });

  const ListFooterComponent = () => {
    if (!messages.length || messages[0].type === 'system') {
      return null;
    }
    return Message({ index: awaitingIndex, item: { type: 'system', created_at: null, body: 'awaiting' } });
  };

  return (
    <View style={{ ...flatlist.container }}>
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

export default function Convo() {
  const local = useLocalSearchParams();
  const context = ['convos', local.slug];
  const { sendMessage } = useContext(WebsocketContext);

  function createMessage(text) {
    sendMessage({
      action: 'create',
      context,
      data: { body: text, },
    });
  }

  const styled = StyleSheet.create({
    view: {
      ...DetailStyles.view
    },
    flex1: { flex: 1 },
    heading: {
      ...DetailStyles.header
    },
    menu: {
      ...DetailStyles.menu
    },
  })

  return (
    <View style={styled.view}>
      <ViewHead />
      <View style={styled.flex1}>
        <Messages context={context} />
      </View>

      <View style={styles.footer}>
        {/* <Input
          onSubmit={createMessage}
          placeholder='Create New Message'
        /> */}
        {/* <TalkButton context={context} /> */}
      </View>
    </View>
  )
}