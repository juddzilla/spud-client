import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';

import colors from '../colors';
import DebouncedInput from '../DebouncedInput';
import Icon from '../icons';
import styles from '../styles';
import { queryClient } from '../../../contexts/query-client';

export default function Heading({headerOptions, mutations, title = 'implement'}) {    
    const { update } = mutations;
    console.log('update', update);
    const [prompt, setPrompt] = useState(null);
    const [submitting, setSubmitting] = useState(false);    
    
    const { showActionSheetWithOptions } = useActionSheet();
    const standardHeight = 44;

    useEffect(() => {
        if (!prompt && submitting) {            
            setSubmitting(false);
        }
    }, [prompt]);
    
    function chooseAction(option) {        
        let cancelButtonIndex = null;
        let destructiveButtonIndex = null;
        let options = [];
        let title = '';
        let message = '';

        if (option.name === 'remove') {            
            options = ['Delete', 'Cancel'];
            destructiveButtonIndex = 0;
            cancelButtonIndex = 2;
            title = 'You sure?';
            message = ' This action cannot be reversed.';
        }
        
        showActionSheetWithOptions({
            cancelButtonIndex,
            destructiveButtonIndex,
            options,
            title,
            message,
          }, (selectedIndex) => {              
              if (selectedIndex === 0) {
                  option.cb();
              }
              setPrompt(null);
          });
    }

    function onClose() {
        queryClient.setQueryData(['details'], { context: null, data: null });
    }
   
    const actions = {
        addToCollection: {
            icon: 'collectionAdd',
        },
        remove: {            
            icon: 'trash',
        },
        summarize: {            
            icon: 'summarize',
        },
    };

    const textColor = colors.darkText;

    return (
        <View style={{...styles.row, height: standardHeight, paddingLeft: 8, backgroundColor: '',paddingRight: 4, marginBottom: 8,}}>
            <Pressable
                // onPress={() => DetailObservable.notify(null)}
                onPress={onClose}
                style={{width: 40, height: '100%', left: -4, ...styles.centered, left: -8}}
            >
                <Icon name='closeModal' styles={{color: textColor, fontSize: 20}} />
            </Pressable>
            
            <DebouncedInput
                multiline={false}
                placeholder='Note Title'
                style={{
                    fontSize: 26,
                    height: '100%',            
                    marginRight: 16,        
                    paddingHorizontal: 4,  
                    color: textColor,
                    backgroundColor: 'transparent',
                    // textDecorationLine: 'underline',
                    
                }}
                update={(value) => { update.mutate({title: value})}} 
                value={title}
            />

            <View style={styles.row}>
                { headerOptions.map(option => (
                    <Pressable
                        key={option.name}
                        onPress={ () => { chooseAction(option)}}
                        style={{width: 40, ...styles.centered, height: standardHeight}}
                    >
                        
                        <Icon name={actions[option.name].icon} styles={{size: 20, color: textColor}} />                    
                    </Pressable>
                )) }
            </View>           
      </View>
    )
}