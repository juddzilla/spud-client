import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQuery } from '@tanstack/react-query';

import Convo from './Convo';
import List from './List';
import Menu from './Menu';
import Note from './Note';

import colors from '../colors';
import DebouncedInput from '../DebouncedInput';
import Icon from '../icons';
import styles from '../styles';

import { queryClient } from '../../../contexts/query-client';


import Fetch from '../../../interfaces/fetch';

const initialData = { context: [], data: null, children: [] };
const standardHeight = 56;

const Title = () => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState([]);

  const { data } = useQuery({
    initialData,
    queryKey: ['details'],
    queryFn: async () => {
      setTitle(data.data.title);
      setContext(data.context);
      return data;
    }
  });

  const titleMutation = useMutation({
    mutationFn: async(data) => {
      try {
        const baseUri = `${context.join('/')}/`;
        return await Fetch.put(baseUri, {title: data});
      } catch (error) {
        console.warn('Update List Error:', error);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['details'], oldData => {            
        return {...oldData, data: {...oldData.data, ...data}};
      });
      queryClient.setQueryData(context, oldData => {             
        return {...oldData, data: {...oldData.data, ...data}};
      });
      queryClient.setQueryData([context[0]], oldData => {                            
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

  return (
    <DebouncedInput
      multiline={false}
      placeholder='title goes here'
      style={{
          fontSize: 26,
          height: '100%',            
          marginRight: 16,        
          paddingHorizontal: 4,  
          color: colors.white,
          backgroundColor: 'transparent',
          // textDecorationLine: 'underline',
          
      }}
      update={titleMutation.mutate} 
      value={title}
    />
  );
};

export default function DetailModal() {
  const insets = useSafeAreaInsets();

  const windowWidth = Dimensions.get('window').width;
  const slideAnim = useRef(new Animated.Value(windowWidth)).current;


  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: windowWidth,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };
    
  // useEffect(() => {
  //   if (!prompt && submitting) {            
  //       setSubmitting(false);
  //   }
  // }, [prompt]);

  const { data } = useQuery({
    initialData,
    queryKey: ['details'],
    queryFn: async () => {
      return data;
    },
  });

  useEffect(() => {
    if (data.context.length) {
      slideIn();      
    } else {
      slideOut();
    }
  }, [data]);

  function onClose() {
    queryClient.setQueryData(['details'], initialData);
  }

  const typeMap = { Convo, Note, List };

  const TypeComponent = () => {
    const Component = typeMap[data.data.type];
    return (<Component item={data.data} />)
  };
  
  if (!data || !data.data) {
    return null;
  }

  const styled = StyleSheet.create({
    animatedView: {
      position: 'absolute',
      top: 0, 
      left: 0, 
      height: Dimensions.get('window').height,            
    },
    heading: {
      backgroundColor: colors.darkText, 
      ...styles.row,
      height: standardHeight, 
      // marginBottom: 8,
      width:  Dimensions.get('window').width,      
      paddingHorizontal: 8,
    },
    content: {
      flexDirection: 'column',
      paddingTop: insets.top, 
      paddingBottom: insets.bottom,
      flex: 1,
      paddingHorizontal: 0,   
      backgroundColor: colors.brand, 
    },
    backButton: {
      width: 40, 
      backgroundColor: 'transparent', 
      height: '100%', 
      ...styles.centered, 
      left: 0
    },
    backIcon: {
      color: colors.white, 
      fontSize: 24
    },
  });
    
    return (
      <Animated.View                
        style={[
          styled.animatedView,
          { transform: [{translateX: slideAnim}] },
        ]}
      >
        <StatusBar style="light" />      
        <View style={styled.content}>              
          <View style={styled.heading}>
              <Pressable
                onPress={onClose}
                style={styled.backButton}
              >
                <Icon name='chevronLeft' styles={styled.backIcon} />
              </Pressable>
              
              <Title />

              <View style={styles.row}>
               
                <Menu />
              </View>
            </View>
            { TypeComponent() }
          </View>       
        
        </Animated.View>
    );
  };