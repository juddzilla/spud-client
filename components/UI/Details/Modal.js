import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import Convo from './Convo';
import List from './List';
import Note from './Note';

import { queryClient } from '../../../contexts/query-client';


export default function DetailModal() {
  const initialData = { context: [], title: null, type: null };
  const insets = useSafeAreaInsets();
  const queryKey = ['details'];

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

      
  const { data } = useQuery({
      initialData,
      queryKey,
      queryFn: async () => {
        return queryClient.getQueryData(queryKey);
      },
    });

  useEffect(() => {    
    const op = data && data.context.length ? slideIn : slideOut;
    op();
  }, [data]);
  
  if (!data || !data.context.length) {
    return null;
  }

  const typeMap = { Convo, Note, List };

  const TypeComponent = () => {    
    const Component = typeMap[data.type];
    return (<Component item={data} />)
  };

  const styled = StyleSheet.create({
    animatedView: {
      position: 'absolute',
      top: 0, 
      left: 0, 
      height: Dimensions.get('window').height,            
    },    
    content: {
      flexDirection: 'column',
      paddingTop: insets.top, 
      paddingBottom: insets.bottom,
      flex: 1,
      paddingHorizontal: 0,   
      backgroundColor: 'rgb(249,249,249)', 
    },    
  });
    
    return (
      <Animated.View                
        style={[
          styled.animatedView,
            { transform: [{translateX: slideAnim}] },
        ]}>
          <View style={styled.content}>
            { TypeComponent() }
          </View>      
      </Animated.View>
    );
  };