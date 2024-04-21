import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import Modal from '../modal/Modal';
import Bold from '../text/Bold';

import { DetailObservable  } from './observable';

import colors from '../colors';
import DebouncedInput from '../DebouncedInput';
import Icon from '../icons';
import styles from '../styles';
import Light from '../text/Light';

export default function Heading({ headerOptions, mutations }) {    
    const { update } = mutations;
    const [prompt, setPrompt] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const item = DetailObservable.getData();

    useEffect(() => {
        if (!prompt && submitting) {
            setSubmitting(false);
        }
    }, [prompt]);
    
    const Prompt = (props) => {
        const { cta, color, subtitle, title} = props;
        
        const onSubmit = () => {                
            if (!submitting) {
                prompt.cb();
                setSubmitting(true);
            }
        };

        const styled = StyleSheet.create({
            content: {
                backgroundColor: colors.white,
                paddingHorizontal: 16,  
                paddingTop: 20,
                paddingBottom: 4,                    
                borderRadius: 8,
                shadowColor: colors.darkestBg,
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.2,
                shadowRadius: 6.27,
                elevation: 10,
                width: '100%',
                marginBottom: 16,                
            },
            body: {
                flexDirection: 'row', 
                flexWrap: 'wrap',
                textAlign: 'center',
                marginBottom: 16,
            },
            icon: {
                container: {
                    ...styles.centered, 
                    ...styles.buttons.icon, 
                    backgroundColor: color, 
                    borderRadius: 999,
                },
                image: {
                    color: colors.white,
                }
            },
            input: {
                textAlign: 'center',                
                borderWidth: 1, 
                borderColor: colors.darkBg,
                width: '100%',
                height: 44,
                borderRadius: 8,
                marginBottom: 16,
                fontFamily: 'Inter-Bold',   
            },
            option: {
                alignItems: 'center',     
            },
            row: {
                marginBottom: 12,
            },
            button: {
                ...styles.centered,
                borderWidth: 1,          
                borderRadius: 8,
                marginBottom: 12,
                height: 44,
                ...styles.centered,
                backgroundColor: colors.white,
            },
            actions : {
                cancel: {
                    backgroundColor: colors.black,     
                    borderColor: colors.black,        
                },
                remove: {            
                    backgroundColor: colors.remove,     
                    borderColor: colors.remove,        
                },
            }
        })

        return (
            <>
                <View style={styled.content}>
                    <View style={styled.option}>
                        <View style={{...styled.icon.container, ...styled.row}}>
                            <Icon name={actions[prompt.name].icon} styles={styled.icon.image} />
                        </View>
                        
                        <Bold style={styled.row}>{ title }</Bold>
                        
                        <View style={{...styled.row, ...styled.body}}>
                            <Light style={{textAlign: 'center'}}>{ subtitle }</Light>                                            
                        </View>                                                
                    </View>                    
                </View>

                <View style={{width: '100%'}}>
                    <Pressable
                        onPress={onSubmit}
                        style={{ ...styled.button, backgroundColor: color, borderColor: color }}
                    >
                        <Bold style={{color: colors.white}}>{ cta }</Bold>
                    </Pressable>
                    <Pressable style={styled.button} onPress={() => setPrompt(null)}>
                        <Bold>Back</Bold>
                    </Pressable>
                </View>
            </>
        );
    };
   
    const actions = {
        remove: {
            component: () => Prompt({
                cta: 'Delete',
                color: colors.remove,
                subtitle: 'You sure? This action cannot be reversed.',
                title: 'Confirmation Required', 
            }),          
            display: 'Delete',
            icon: 'trash',
        },
        summarize: {
            component: () => Prompt({
                cta: 'Summarize',
                color: colors.black,
                subtitle: 'Summarize this convo into a note. doing so will delete convo from history.',
                title: 'Summarize', 
            }),          
            display: 'Summarize',
            icon: 'summarize',
        },
    };

    return (
        <View style={{...styles.row, backgroundColor: '', height: 44, paddingLeft: 12, paddingRight: 4, marginBottom: 4,}}>
            <Pressable
                onPress={() => DetailObservable.notify(null)}
                style={{width: 40, height: '100%', backgroundColor: '', left: -4, ...styles.centered, left: -8}}
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
            <View>      
                <Modal
                    show={!!prompt}
                    toggleShow={() => setPrompt(null)}
                >                
                    { !!prompt && 
                        <View style={{padding: 16}}>
                            { actions[prompt.name].component() }
                        </View>                 
                    }
                </Modal>
                
                <View style={styles.row}>
                    { headerOptions.map(option => (
                        <Pressable
                            key={option.name}
                            onPress={ () => setPrompt(option)}
                            style={{width: 40, ...styles.centered, height: '100%'}}
                        >
                            <Icon name={actions[option.name].icon} styles={{size: 20, color: colors.white,}} />                    
                        </Pressable>
                    )) }
                </View>
            </View>
      </View>
    )
}