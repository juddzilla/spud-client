import { Pressable, StyleSheet, View } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useMutation } from '@tanstack/react-query';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import { queryClient } from '../../../contexts/query-client';
import Fetch from '../../../interfaces/fetch';

export default function Menu() {
    const { context } = queryClient.getQueryData(['details']);
    const { showActionSheetWithOptions } = useActionSheet(); 
    

    const initialData = { context: [], data: null, children: [] };    
    
    const addToCollectionText = 'Add To Collection';
    const cancelText = 'Cancel';
    const deleteText = 'Delete';
    const lockNoteText = 'Lock Note';
    const summarizeToNoteText = 'Summarize To Note';
    
    function openOptionsMenu() {
        const topLevelOptions = [addToCollectionText, deleteText, cancelText];        
        if (context[0] === 'convos') {
            topLevelOptions.unshift(summarizeToNoteText)
        } else if (context[0] === 'notes') {
            topLevelOptions.unshift(lockNoteText)
        }
        const cancelButtonIndex = topLevelOptions.indexOf(cancelText);
        const destructiveButtonIndex = topLevelOptions.indexOf(deleteText);
        const title = '';
        const message = '';

        showActionSheetWithOptions({
            cancelButtonIndex,
            destructiveButtonIndex,
            options: topLevelOptions,
            title,
            message,
        }, (selectedIndex) => {
            if (selectedIndex === destructiveButtonIndex) {
                confirmDeletion()
            } else if (topLevelOptions[selectedIndex] === summarizeToNoteText) {
                confirmSummarizeToNote();
            } else if (topLevelOptions[selectedIndex] === addToCollectionText) {
                chooseCollection();
            } else if (topLevelOptions[selectedIndex] === lockNoteText) {
                confirmLockNote();
            }
            // setPrompt(null);
        });
    }
    
    function confirmDeletion() {
        const cancelButtonIndex = 1;
        const destructiveButtonIndex = 0;
        const confirmationOptions = ['Delete', 'Cancel'];
        const title = 'You sure?';
        const message = ' This action cannot be reversed.';
    
        showActionSheetWithOptions({
          cancelButtonIndex,
          destructiveButtonIndex,
          options: confirmationOptions,
          title,
          message,
        }, (selectedIndex) => {
            if (selectedIndex === 0) {
                // option.cb();
                removeMutation.mutate();
            }
            // setPrompt(null);
        });
    }

    function confirmSummarizeToNote() {
        console.log('SUMMARIZE TO NOTE');
    }

    function chooseCollection() {
        console.log('Add To Collection');
    }

    function confirmLockNote() {
        console.log('Lock Note');
    }
    
    const removeMutation = useMutation({
        mutationFn: async () => {   
        const baseUri = `${context.join('/')}/`;        
        try {
            return await Fetch.remove(baseUri);
        } catch (error) {
            console.warn('Remove Convo Error: ', error);
        }
        
        },
        onSuccess: () => {
        queryClient.setQueryData([context[0]], oldData => {  
                
            return oldData.map(old => {            
            if (old.uuid !== context[1]) {              
                return old;
            }
            return null;
            }).filter(Boolean);        
        });
        queryClient.removeQueries({ queryKey: context, exact: true });        
        queryClient.setQueryData(['details'], initialData);
        },
    });

    const styled = StyleSheet.create({        
        options: {
          ...styles.centered, 
          height: 40,
          width: 40, 
        },
        optionsIcon: {
          color: colors.darkText,  
        }
      });

    const viewOptions = [
        {
            onPress: openOptionsMenu,
            style: styled.options,
            icon: 'dots',
            size: 20,
        },
    ];

    return (
        <View style={styles.row}>
            { viewOptions.map(option => (
                <Pressable
                    key={option.icon}
                    onPress={option.onPress}
                    style={{...styled.options, ...option.style}}
                >              
                    <Icon name={option.icon} styles={{...styled.optionsIcon, size: option.size}} />
                </Pressable>
            ))}
            {/* <Pressable
                onPress={openOptionsMenu}
                style={styled.options}
            >              
                <Icon name='dots' styles={styled.optionsIcon} />
            </Pressable> */}
        </View>
    );
}