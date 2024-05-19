import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';

import colors from '../colors';
import DebouncedInput from '../DebouncedInput';

import { queryClient } from '../../../contexts/query-client';

import Fetch from '../../../interfaces/fetch';
import styles from '../styles';

export default function Title() {
  const queryKey = ['details'];
  const [title, setTitle] = useState('');
    
  const { data } = useQuery({    
    queryKey,
    queryFn: async () => {
        const queryData = queryClient.getQueryData(queryKey);
      setTitle(data.data.title);
      return queryData;
    }
  });

  useEffect(() => {
      console.log('MODAL TITLE DATA', data);
      if (data && data.title) {
        setTitle(data.title);
      }
  }, [data])

  const titleMutation = useMutation({
    mutationFn: async(data) => {
      try {
        const { context } = queryClient.getQueryData(queryKey);
        const baseUri = `${context.join('/')}/`;
        return await Fetch.put(baseUri, {title: data});
      } catch (error) {
        console.warn('Update List Error:', error);
      }
    },
    onSuccess: (data) => {
      const { title, updated_at } = data;
      const { context } = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(context, oldData => ({...oldData, title, updated_at }));
      queryClient.setQueryData([context[0]], oldData => {                                    
        return {
            ...oldData,
            results: oldData.results.map(old => {
              if (old.uuid !== context[1]) { return old; }
              
              return {
                ...old,
                title,
                updated_at,
              }
            })
        }
      });
    },
  });

  return (
    <View style={{...styles.row, marginBottom: 8,  paddingRight: 16, height: 56}}>

        <DebouncedInput
          multiline={false}
          placeholder='title goes here'
          style={{
            fontSize: 26,
            color: colors.darkText,
            backgroundColor: 'transparent',
            fontFamily: 'Inter-Bold',              
          }}
          update={titleMutation.mutate} 
          value={title}
        />
    </View>
  );    
}