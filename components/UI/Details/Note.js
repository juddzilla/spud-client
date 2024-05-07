import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { relativeDate } from '../../../utils/dates';
import {
  keepPreviousData,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import colors from '../colors';
import DebouncedInput from '../DebouncedInput';
import styles from '../styles';
import Light from '../text/Light';

import Talk from '../actions/Talk';

import Fetch from '../../../interfaces/fetch';
import { queryClient } from '../../../contexts/query-client';

export default function Note({item, left}) {  
  const queryKeys = ['notes', item.uuid];
  const baseUri = `notes/${item.uuid}/`;

  const [body, setBody] = useState(item.body);
  const [updatedAt, setUpdatedAt] = useState(item.updatedAt);

  async function putNote(data) {    
    try {
      return await Fetch.put(baseUri, data);
    } catch (e) {
      console.log('Put Note Error:', e);
    }
  }

  const Query = useQuery({
    queryKey: queryKeys, 
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
      queryClient.setQueryData(queryKeys, oldData => {            
        return {...oldData, ...data};
      });
      queryClient.invalidateQueries([queryKeys[0]]);
    },
  })
  
  const styled = StyleSheet.create({
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
      style={{
        ...styles.View,
        left: - (left),
        paddingBottom: 15,
        width: Dimensions.get('window').width - (left*2),               
      }}
    >                
      { (Query.status === 'pending' && Query.fetchStatus === 'fetching') ? 
        (
          <Light>Loading</Light>
        ) : 
        (
          <DebouncedInput
            multiline={true}
            placeholder='(untitled)'
            style={{
              flexWrap: 'wrap',
              fontSize: 20,        
              paddingHorizontal: 16,
              paddingTop: 16,
              backgroundColor: 'transparent', 
              color: colors.darkText,
            }}
            update={(value) => { updateMutation.mutate({body: value})}} 
            value={body}
          />
        ) 
      
      }
      
      <View style={{...styles.footer, paddingHorizontal: 4, }}>
        <View style={styled.date.container}>
          <Light style={styled.date.body}> {relativeDate(updatedAt)}</Light>          
        </View>        
        <Talk />
      </View>
    </View>
  )
}