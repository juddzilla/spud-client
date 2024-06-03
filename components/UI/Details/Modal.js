import { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import Convo from './Convo';
import Collection from './Collections';
import List from './List';
import Note from './Note';
import CollectionsPicker from './Collections-Picker';

import { queryClient } from '../../../contexts/query-client';
import { CollectionsContext } from '../../../contexts/collections';

const queryKey = ['details'];
const initialData = { context: [], title: null, type: null, showCollections: false };

function CollectionsProvider(props) {
  const [showCollections, setShowCollections] = useState(null);

  return (
    <CollectionsContext.Provider value={{ showCollections, setShowCollections }}>
      {props.children}
    </CollectionsContext.Provider>
  )
}

function DetailComponent() {
  const insets = useSafeAreaInsets();

  const DetailQuery = useQuery({
    // initialData,
    queryKey,
    queryFn: async () => {
      return queryClient.getQueryData(queryKey);
    },
  });

  const styled = StyleSheet.create({
    content: {
      flexDirection: 'column',
      // paddingTop: insets.top,
      // paddingBottom: insets.bottom,
      flex: 1,
      paddingHorizontal: 0,
      backgroundColor: 'rgb(249,249,249)',
    },
  });

  const typeMap = { Collection, Convo, Note, List };

  const TypeComponent = () => {
    if (!DetailQuery.data || !DetailQuery.data.context.length) {
      return null;
    }
    const Component = typeMap[DetailQuery.data.type];
    return (<Component item={DetailQuery.data} />)
  };

  return (
    <View style={styled.content}>
      {TypeComponent()}
    </View>

  );
}

export default function DetailModal() {
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
      duration: 300,
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


  const styled = StyleSheet.create({
    animatedView: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: Dimensions.get('window').height,
      width: '100%',
      backgroundColor: 'yellow',
      flex: 1,
    },
  });

  return (
    <CollectionsProvider>
      <Animated.View
        style={[
          styled.animatedView,
          { transform: [{ translateX: slideAnim }] },
        ]}>
        <DetailComponent />
      </Animated.View>
      <CollectionsPicker />
    </CollectionsProvider>
  );
};