import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { relativeDate } from '../../../utils/dates';
import {
  keepPreviousData,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { DetailObservable  } from './observable';

import Options from './Options';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';
import Light from '../text/Light';

import Talk from '../actions/Talk';

import Fetch from '../../../interfaces/fetch';
import { queryClient } from '../../../contexts/query-client';

import DebouncedInput from '../DebouncedInput';

export default function Note({item, left}) {  
  const queryKeys = ['notes', item.uuid];
  const baseUri = `notes/${item.uuid}/`;

  const [body, setBody] = useState(item.body);
  const [title, setTitle] = useState(item.title);
  const [updatedAt, setUpdatedAt] = useState(item.updatedAt);

  async function putNote(data) {    
    try {
      return await Fetch.put(baseUri, data);
    } catch (e) {
      console.log('Put Note Error:', e);
    }
  }

  async function deleteNote() {    
    try {    
      return await Fetch.remove(baseUri);      
    } catch (e) {
      console.log('Remove Note Error:', e);
      return false;
    }
  }

  const Query = useQuery({
    queryKey: queryKeys, 
    queryFn: async () => {        
      const response = await Fetch.get(baseUri);            
      setBody(response.body);    
      setTitle(response.title);
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
  })

  const removeMutation = useMutation({
    mutationFn: deleteNote,
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`rolling back optimistic update with id ${context.id}`)
    },
    onSuccess: () => {  // data, variables, context                
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

  const headerOptions = [
    {
      cb: removeMutation.mutate,
      name: 'remove',
      theme: 'red',
    }
];

  return (
    <View
      style={{
        ...styles.View,
        left: -(left),
        paddingBottom: 15,
        width: Dimensions.get('window').width - left,                
      }}
    >
            
      <View style={{...styles.row, height: 44, paddingLeft: 12, paddingRight: 4}}>
        <Pressable
          onPress={() => DetailObservable.notify(null)}
          style={{width: 40, marginRight: 16, left: -4, top: -1}}
        >
          <Icon name='close' />
        </Pressable>
        
        <DebouncedInput
          multiline={false}
          placeholder='Note Title'
          style={{
            fontSize: 26,
            height: '100%',            
            marginRight: 16,          
          }}
          update={(value) => { updateMutation.mutate({title: value})}} 
          value={title}
        />        
        <Options options={headerOptions} />
      </View>
      <View style={{flex: 1}}>
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
            }}
            update={(value) => { updateMutation.mutate({body: value})}} 
            value={body}
          />
        ) 
      
      }
      </View>
      <View style={{...styles.footer, paddingHorizontal: 4}}>
        <View style={styled.date.container}>
          <Light style={styled.date.body}> {relativeDate(updatedAt)}</Light>          
        </View>        
        <Talk />
      </View>
    </View>
  )
}