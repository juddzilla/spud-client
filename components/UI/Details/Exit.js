import { Pressable, StyleSheet, View } from 'react-native';
import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import { queryClient } from '../../../contexts/query-client';

const initialData = { context: [], title: null, type: null };

export default function Exit() {
  const queryKey = ['details'];

  const styled = StyleSheet.create({    
    backButton: {
      width: 40,
      height: '100%', 
      ...styles.centered, 
      left: 0,
    },
    backIcon: {
      color: colors.darkText, 
      fontSize: 24
    },
  });

  function onClose() {
    queryClient.setQueryData(queryKey, initialData);
  }

  return (
    <Pressable
      onPress={onClose}
      style={styled.backButton}
    >
      <Icon name='close' styles={styled.backIcon} />
    </Pressable>
  )
  
}