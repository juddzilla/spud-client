import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  keepPreviousData,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { useLocalSearchParams } from 'expo-router';
import { DetailStyles } from './styles';

import colors from '../colors';
import DebouncedInput from '../DebouncedInput';
import styles from '../styles';
import Light from '../text/Light';
import TalkButton from '../Talk/Button';

import Fetch from '../../../interfaces/fetch';
import { queryClient } from '../../../contexts/query-client';

export default function Note() {
  const local = useLocalSearchParams();
  const context = ['notes', local.slug];
  const baseUri = context.join('/') + '/';

  const data = queryClient.getQueryData([context[0]]);
  const note = data.results.find(j => j.uuid === context[1]);
  const [body, setBody] = useState(note.body);
  const [updatedAt, setUpdatedAt] = useState(note.updated_at);

  async function putNote(data) {
    try {
      return await Fetch.put(baseUri, data);
    } catch (e) {
      console.log('Put Note Error:', e);
    }
  }

  const Query = useQuery({
    queryKey: context,
    queryFn: async () => {
      const response = await Fetch.get(baseUri);
      setBody(response.body);
      setUpdatedAt(response.updated_at);
      return response;
    },
    keepPreviousData: true,
    placeholderData: keepPreviousData,
  });

  const updateMutation = useMutation({
    mutationFn: putNote,
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`rolling back optimistic update with id ${context.id}`)
    },
    onSuccess: (data) => {  // variables, context
      setUpdatedAt(data.updated_at);
      queryClient.setQueryData(context, oldData => {
        return { ...oldData, ...data };
      });
      queryClient.invalidateQueries([context[0]]);
    },
  })

  const styled = StyleSheet.create({
    view: {
      ...DetailStyles.view,
      paddingBottom: 15,
    },
    content: {
      ...DetailStyles.content,

    },
    header: {
      ...DetailStyles.header,
    },
    menu: {
      ...DetailStyles.menu
    },
    note: {
      flexWrap: 'wrap',
      fontSize: 18,
      paddingHorizontal: 16,
      // paddingTop: 16,
      paddingBottom: 36,
      backgroundColor: 'transparent',
      color: colors.darkText,
      lineHeight: 28,
    },
    date: {
      container: {
        flexDirection: 'row',
        flex: 1,
        paddingLeft: 8,
      },
      body: {
        fontSize: 12,
      }
    }
  });

  return (
    <View
      style={styled.view}
    >
      {(Query.status === 'pending' && Query.fetchStatus === 'fetching') ?
        (
          <Light>Loading</Light>
        ) :
        (
          <View style={styled.content}>
            <View style={{
              flex: 1,
              // backgroundColor: 'red', 
              // borderRadius: 8, 
              // marginHorizontal: 4,
              // transform: [{ scale: 0.95}]
            }}>
              <DebouncedInput
                multiline={true}
                placeholder='(untitled)'
                style={styled.note}
                update={(value) => { updateMutation.mutate({ body: value }) }}
                value={body}
              />
            </View>

          </View>
        )

      }

      <View style={styles.footer}>
        <TalkButton context={context} />
      </View>
    </View>
  )
}