import { useState } from 'react';
import { StyleSheet, Pressable, TextInput, View } from 'react-native';
import Icon from '../icons';
import colors from '../colors';
import Bold from '../text/Bold';

import CustomModal from './Modal';

// import TalkButton from './Talk';

export default function Input({ onSubmit, placeholder, hideModal }) {
    const [focus, setFocus] = useState(false);
    const [message, setMessage] = useState('');
    const [showModal, toggleModal] = useState(false);

    function onSubmitMessage() {
        if (!hideModal) {
            toggleModal(true);
        }        
        onSubmit(message);
        setMessage('');       
        toggleModal(false); 
    }

    const styled = StyleSheet.create({
        container: {
            alignItems: 'center',             
            borderColor: colors.darkBg,
            borderWidth: 1,
            borderBottomWidth: 0,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            flexDirection: 'row', 
            justifyContent: 'space-between',             
            paddingLeft: 16,
            paddingRight: 16,
            paddingVertical: 12,
        },
        input: {
            container: {
                backgroundColor: colors.theme.inputs.dark.backgroundColor,
                // backgroundColor: focus ? 'white' : colors.lightWhite,
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',                                             
                flex: 1,       
                
                // borderWidth: 1,
                borderColor: colors.darkestBg,
                borderRadius: 32,
                paddingLeft: 32,
                marginRight: 70,            
                opacity: 1,
                paddingRight: 48,            

                shadowColor: colors.darkestBg,
                shadowOffset: {
                    width: 0,
                    height: 7,
                },
                shadowOpacity: focus ? 0.6 : 0.5,
                shadowRadius: 12.00,
                elevation: 24,
            },
            field: {                    
                height: 48,    
                
                marginRight: 0, 
                flex: 1,     
                color: colors.theme.inputs.dark.text.light,                            
            },
            icons: {
                leading: {
                    size:12, 
                    color: focus ? 'transparent' : colors.theme.inputs.dark.text.light, 
                    position: 'absolute',
                    zIndex: 1, 
                    left: 12,
                },
                trailing: {
                    size: 16, 
                    color: focus ? colors.darkestBg : '#d4d4d4',
                    zIndex: 1,
                }
            },
            send: {
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.darkBg, 
                borderRadius: 40,
                opacity: (focus && message.trim().length) ? 1 : 0,
                position: 'absolute', 
                right: 4
            },
        },
        modal: {
            container: {
                flex: 1,
                paddingTop: 100,
                paddingHorizontal: 16,
            },
            content: {
                fontSize: 36, 
                textAlign: 'center',
            }
        }
      });

    return (
        <>
            <CustomModal
                show={showModal}
                toggleShow={toggleModal}
            >
                <View style={styled.modal.container}>
                    <Bold style={styled.modal.content}>Creating {message}</Bold>
                </View>

            </CustomModal>
            <View style={styled.input.container}>          
                <Icon name='plus' styles={styled.input.icons.leading} />
                <TextInput
                    value={message}
                    onBlur={() => setFocus(false)}
                    onChangeText={(text) => setMessage(text)}

                    onFocus={() => setFocus(true)}
                    placeholder={placeholder || 'NEW'}
                    style={styled.input.field}
                    placeholderTextColor={colors.theme.inputs.dark.text.light}
                />
                <Pressable
                    onPress={onSubmitMessage}
                    style={styled.input.send}
                >
                    <Icon name='send' styles={styled.input.icons.trailing} />
                </Pressable>
            </View>
        </>
    )
}