import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Modal from './Modal';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Icon from '../icons';

import colors from '../colors';
import Styles from '../styles';

export default function Options({options}) {
    const [showOptions, setShowOptions] = useState(false);
    const [prompt, setPrompt] = useState({});
    const [newTitle, setNewTitle] = useState('');
    
    useEffect(() => {
        if (!showOptions) {
            setPrompt({});
            setNewTitle('');
        }
    }, [showOptions, setPrompt]);

    const Prompt = (props) => {
        const { cta, color, onInputChange, subtitle, title} = props;
        
        const onSubmit = () => {
            if (onInputChange) {
                prompt.cb(onInputChange.value);
            } else {
                prompt.cb();
            }
            setShowOptions(false);
        }
        return (
            <View style={styles.confirmation.content}>
              <View style={styles.confirmation.content.option}>
                <View style={{...Styles.centered, ...Styles.buttons.icon, backgroundColor: color, borderRadius: 999, ...styles.confirmation.content.option.child}}>
                  <Icon name={prompt.icon} styles={{color: colors.white}} />
                </View>
                <Bold style={styles.confirmation.content.option.child}>{ title }</Bold>
                <View style={{ ...styles.confirmation.content.option.child, ...styles.confirmation.content.option.body}}>
                  <Light style={{textAlign: 'center'}}>{ subtitle }</Light>                                            
                </View>
                { onInputChange &&
                    <TextInput
                        value={onInputChange.value}
                        onChangeText={onInputChange.cb}
                        style={{
                            textAlign: 'center',
                            ...styles.confirmation.content.option.child, 
                            borderWidth: 1, 
                            borderColor: colors.darkBg,
                            width: '100%',
                            height: 44,
                            borderRadius: 8,
                            marginBottom: 16,
                            fontFamily: 'Inter-Bold',                        
                        }}
                    />
                }
                <View style={{width: '100%'}}>
                    <Pressable
                        onPress={onSubmit}
                        style={{ ...styles.confirmation.button, backgroundColor: color, borderColor: color }}
                    >
                        <Bold style={{color: colors.white}}>{ cta }</Bold>
                    </Pressable>
                    <Pressable style={styles.confirmation.button} onPress={() => setPrompt({})}>
                        <Bold>Cancel</Bold>
                    </Pressable>
                </View>
              </View>
            </View>
        );
    }
    
    const actions = {
        remove: {
            component: () => Prompt({
                cta: 'Delete',
                color: colors.remove,
                subtitle: 'Are you certain you want to delete this List? This action cannot be reversed.',
                title: 'Confirmation Required', 
            }),          
            display: 'Delete',
            icon: 'trash',
        },
        rename: {
            component: () => Prompt({
                cta: 'Rename',
                color: colors.black,
                onInputChange: {cb: (text) => setNewTitle(text), value: newTitle},
                subtitle: 'What would you like to rename this List to?',
                title: 'Change Title', 
            }),          
            display: 'Rename',
            icon: 'pencil',
        },
    };

    const styles = StyleSheet.create({ 
    confirmation: {
        container: {
        flex: 1, 
        alignItems: 'center',
        padding: 16,
        },
        content: {
        backgroundColor: colors.white,
        padding: 16,          
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
        option: {
            alignItems: 'center',            
            child: {
            marginBottom: 12,
            },
            body: {
            flexDirection: 'row', 
            flexWrap: 'wrap',
            textAlign: 'center',
            marginBottom: 16,
            }
        },
        },
        button: {
            ...Styles.centered,
            borderWidth: 1,          
            borderRadius: 8,
            marginBottom: 8,
            height: 44,
            ...Styles.centered
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
    },
    options: {
        close: {
            ...Styles.centered,
            backgroundColor: colors.white,
            height: 48,
            paddingRight: 16,
            paddingTop: 4,
            position: 'absolute',
            top: -48,
        },
        container: {
            alignItems: 'flex-end',           
            backgroundColor: 'rgba(255,255,255,0.4)',
            // backgroundColor:  'green',
            // paddingTop: getStatusBarHeight() + 35 + 48,
            // paddingTop: 0, 
        },
        option: {
            ...Styles.row, 
            flexDirection: 'row-reverse', 
            // backgroundColor: 'white', 
            paddingLeft: 4, 
            paddingRight: 16,
            paddingVertical: 8, 
            borderRadius: 4,
            marginBottom: 4,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            elevation: 5,
            icon : {
                container: {
                ...Styles.buttons.icon, 
                ...Styles.centered, 
                backgroundColor: colors.black, 
                borderRadius: 999, 
                marginLeft: 16,
                },
                image: {
                color: colors.white,
                }
            },
            text: {
                container: {
                backgroundColor: colors.white,
                padding: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                },
                text: {
                fontSize: 16,
                },
            },
        },
    },
    });

    return (
    <View>      
        <Modal
            show={showOptions}
            toggleShow={setShowOptions}
        >
            <View style={styles.options.container}>
                <Pressable
                    style={styles.options.close}
                    onPress={() => setShowOptions(!showOptions)}>
                <Icon name='close' />
                </Pressable>
                
                <View style={styles.options}> 
                { !prompt.name && options.map(option => {
                    const action = actions[option.name];                        
                    return (
                        <Pressable key={action.icon} onPress={() => setPrompt({...action, ...option})}>
                            <View style={styles.options.option}>
                                <View style={styles.options.option.icon.container}>
                                <Icon name={action.icon} styles={styles.options.option.icon.image} />
                                </View>
                                <View style={styles.options.option.text.container}>
                                <Bold style={styles.options.option.text.text}>{action.display}</Bold>
                                </View>
                            </View>                
                        </Pressable>         
                    )
                })}                                                          
                </View>
            </View>

            <View style={styles.confirmation.container}>
                { prompt.name &&
                    actions[prompt.name].component()
                }
            </View>
            
        </Modal>
        <Pressable onPress={ () => setShowOptions(!showOptions)}>
            <Icon name='dots' />
        </Pressable>
    </View>
    );
}