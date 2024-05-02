import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';

import { DetailObservable  } from './observable';

import colors from '../colors';
import DebouncedInput from '../DebouncedInput';
import Icon from '../icons';
import styles from '../styles';

export default function Heading({ headerOptions, mutations, theme = 'light' }) {    
    const { update } = mutations;
    const [prompt, setPrompt] = useState(null);
    const [submitting, setSubmitting] = useState(false);    
    const item = DetailObservable.getData();
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

    return (
        <View style={{...styles.row, height: standardHeight, paddingLeft: 16, paddingRight: 4, marginBottom: 8,}}>
            <Pressable
                onPress={() => DetailObservable.notify(null)}
                style={{width: 40, height: '100%', left: -4, ...styles.centered, left: -8}}
            >
                <Icon name='closeModal' styles={{color: colors.white, fontSize: 24}} />
            </Pressable>
            
            <DebouncedInput
                multiline={false}
                placeholder='Note Title'
                style={{
                    fontSize: 26,
                    height: '100%',            
                    marginRight: 16,        
                    paddingHorizontal: 4,  
                    color: colors.white,
                    backgroundColor: 'transparent',
                }}
                update={(value) => { update({title: value})}} 
                value={item.title}
            />

            <View style={styles.row}>
                { headerOptions.map(option => (
                    <Pressable
                        key={option.name}
                        onPress={ () => { chooseAction(option)}}
                        style={{width: 40, ...styles.centered, height: standardHeight}}
                    >
                        
                        <Icon name={actions[option.name].icon} styles={{size: 20, color: colors.white,}} />                    
                    </Pressable>
                )) }
            </View>           
      </View>
    )
}