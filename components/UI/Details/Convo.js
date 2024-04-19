// convo list of q's and a's
// ability to click on older bit of convo to use as context (v2)
// ability to summarize entire convo
// archive

import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';

import Options from './Options';

import Input from '../actions/Input';
import Talk from '../actions/Talk';
import DebouncedInput from '../DebouncedInput';
import { DetailObservable } from '../Details/observable';
import Icon from '../icons';
import colors from '../colors';
import styles from '../styles';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import { queryClient } from '../../../contexts/query-client';
import Fetch from '../../../interfaces/fetch';
import { convoDate } from '../../../utils/dates';

export default function Convo({item, left}) {  
  const queryKeys = ['convos', item.uuid];
  const baseUri = `convos/${item.uuid}/`;    
  
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState(item.title);
  
  const Query = useQuery({
    queryKey: queryKeys,
    queryFn: async () => {
      const response = await Fetch.get(baseUri);      
      if (!response.error) {
        setTitle(response.title);
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
        return await Fetch.post(baseUri, {body: text});
      } catch (error) {
        console.warn('Create Convo Message Error: ', error);
      }

    },
    onSuccess: (data) => {
      if (!data.error) {
        setMessages([...messages, data]);
        queryClient.setQueryData([queryKeys[0]], oldData => {                    
          return oldData.map(old => {     
            
            if (old.uuid === item.uuid) {              
              let number = parseInt(old.subheadline);
              number++;
              let subheadline = number + ' Item';            
              if (number !== 1) {
                subheadline = subheadline + 's';
              }
  
              return {
                ...old,
                subheadline,
                updated_at: data.created_at,
              }
            }
            return old;
          });
        });
      }
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
          <Light style={styled.date}>{convoDate(item.created_at)}</Light>
        </View>
        <Regular style={styled.body}>{ item.body }</Regular>
      </View>
    )
  };
const flatlist = StyleSheet.create({
    container: {
      flex: 1,
    }  
  })

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
      <View style={{...styles.row, height: 44, paddingLeft: 12, paddingRight: 4}}>
          <Pressable
            onPress={() => DetailObservable.notify(null)}
            style={{width: 40, marginRight: 0, left: -4, top: -1}}
          >
            <Icon name='close' />
          </Pressable>
          
          <DebouncedInput
            multiline={false}
            placeholder='Convo Title'
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
      <View style={flatlist.container}>
        <FlatList          
          data={messages}
          renderItem={Message}
          keyExtractor={item => item.id}        
          inverted={true}    
        />   
      </View>

      <View style={styles.footer}>
        <Input onSubmit={messageMutation.mutate} placeholder='Create New Message'/> 
        <Talk />
      </View>
    </View>
  )
}