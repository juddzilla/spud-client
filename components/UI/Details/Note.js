import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { relativeDate } from '../../../utils/dates';
import {
  keepPreviousData,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { DetailStyles } from './styles';
import Exit from './Exit';
import Menu from './Menu';
import Title from './Title';
import colors from '../colors';
import DebouncedInput from '../DebouncedInput';
import styles from '../styles';
import Light from '../text/Light';
import TalkButton from '../Talk/Button';

import Fetch from '../../../interfaces/fetch';
import { queryClient } from '../../../contexts/query-client';

export default function Note({item}) {  
  const queryKeys = item.context;
  const baseUri = queryKeys.join('/')+'/';

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
      { (Query.status === 'pending' && Query.fetchStatus === 'fetching') ? 
        (
          <Light>Loading</Light>
        ) : 
        (
          <View style={styled.content}>
            <View style={styled.header}>
              <Exit />
              <View style={styled.menu}>        
                <Menu />
              </View>
            </View>
            
            <Title />

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
                update={(value) => { updateMutation.mutate({body: value})}} 
                value={body}
              />
            </View>
            
          </View>
        ) 
      
      }
      
      <View style={styles.footer}>
        <TalkButton keys={queryKeys} />        
      </View>
    </View>
  )
}