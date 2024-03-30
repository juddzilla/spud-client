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
        input: {
            container: {
                backgroundColor: 'white',
                flexDirection: 'row', 
                alignItems: 'center', 
                flex: 1,  
                borderWidth: 1,
                borderColor: colors.theme.text.lightest,
                borderRadius: 12,
                marginVertical: focus ? 0 : 2,
                position: focus ? 'absolute' : 'relative',
                right: focus ? 16 : 0,
                width: focus ? '100%' : null,                
                zIndex: 10
            },
            field: {                    
                height: 48,
                paddingHorizontal: 16,            
                color: colors.theme.inputs.dark.text.darkest,                            
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
                // backgroundColor: colors.darkBg, 
                // borderRadius: 40,
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
                {/* <Icon name='plus' styles={styled.input.icons.leading} /> */}
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