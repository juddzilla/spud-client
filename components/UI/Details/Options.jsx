import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import Modal from '../modal/Modal';
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
                    ...Styles.centered, 
                    ...Styles.buttons.icon, 
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
                ...Styles.centered,
                borderWidth: 1,          
                borderRadius: 8,
                marginBottom: 12,
                height: 44,
                ...Styles.centered,
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
                            <Icon name={prompt.icon} styles={styled.icon.image} />
                        </View>
                        
                        <Bold style={styled.row}>{ title }</Bold>
                        
                        <View style={{...styled.row, ...styled.body}}>
                            <Light style={{textAlign: 'center'}}>{ subtitle }</Light>                                            
                        </View>
                        
                        { onInputChange &&
                            <TextInput
                                value={onInputChange.value}
                                onChangeText={onInputChange.cb}
                                style={{...styled.input, ...styled.row}}
                            />
                        }

                    </View>                    
                </View>

                <View style={{width: '100%'}}>
                    <Pressable
                        onPress={onSubmit}
                        style={{ ...styled.button, backgroundColor: color, borderColor: color }}
                    >
                        <Bold style={{color: colors.white}}>{ cta }</Bold>
                    </Pressable>
                    <Pressable style={styled.button} onPress={() => setPrompt({})}>
                        <Bold>Back</Bold>
                    </Pressable>
                </View>
            </>
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

    const modal = StyleSheet.create({ 
        confirmation: {
            padding: 16,                            
        },
        options: {
            row: {
                width: '100%',
                ...Styles.row,
                ...Styles.centered,
                ...Styles.row, 
                backgroundColor: colors.white, 
                        
                flexDirection: 'row',
                // width: '100%',
                
                paddingHorizontal: 16,
                paddingVertical: 16, 
                borderRadius: 8,
                marginBottom: 16,
                
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 2,
                elevation: 5,
            },
            text: {
                fontSize: 16,
            },
            themes: {
                dark: {
                    backgroundColor: colors.black,
                    text: colors.white,
                },
                red: {
                    backgroundColor: colors.remove,
                    text: colors.white,
                }
            }
        },
    });

    return (
        <View>      
            <Modal
                show={showOptions}
                toggleShow={setShowOptions}
            >
                { !prompt.name && 
                    <View>                
                        { options.map(option => {
                            const action = actions[option.name];         
                            const buttonStyle = {
                                ...modal.options.row, 
                                backgroundColor: modal.options.themes[option.theme].backgroundColor,
                            };
                            const textStyle = {
                                ...modal.options.text,
                                color: modal.options.themes[option.theme].text,
                            }
                            return (
                                <Pressable style={buttonStyle} key={action.icon} onPress={() => setPrompt({...action, ...option})}>
                                    <View>
                                        <Bold style={textStyle}>{action.display}</Bold>                                
                                    </View>                
                                </Pressable>         
                            )
                        })}                                                          
                        
                    </View>
                }

                { prompt.name &&
                    <View style={modal.confirmation}>
                        { actions[prompt.name]().component() }
                    </View>
                }
                
            </Modal>
            <Pressable onPress={ () => setShowOptions(!showOptions)}>
                <Icon name='dots' />
            </Pressable>
        </View>
    );
}