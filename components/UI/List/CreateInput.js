import { useState } from 'react';
  
  import {
    Pressable,
    StyleSheet,
    TextInput,
  } from 'react-native';
  
  import Animated from 'react-native-reanimated';
  
  import colors from '../colors';
  import Icon from '../icons';

  import { useQuery, useMutation } from '@tanstack/react-query';

  import { queryClient } from '../../../contexts/query-client';

  import Fetch from '../../../interfaces/fetch';

  
  export default function CreateInput({keys, noRedirect, placeholder}) {    
    const [focus, setFocus] = useState(false);
    const [message, setMessage] = useState('');

    const textInputStyled = StyleSheet.create({    
        input: {
            container: {
                flexDirection: 'row', 
                alignItems: 'center', 
                flex: 1,              
                      
                zIndex: 10,
                // overflow: 'hidden',
                marginRight: 8,

                shadowColor: colors.darkText,
                shadowOffset: {
                    width: 2,
                    height: 1,
                },
                shadowOpacity: 0.58,
                shadowRadius: 3,
                elevation: 10,
            },
            field: {                    
                // backgroundColor: 'red', 
                height: 48,    
                borderWidth: 1,
                borderColor: focus ? colors.darkText : colors.white,
                borderRadius: 12,                
                paddingHorizontal: 16,
                borderRadius: 12,                      
                backgroundColor: focus ? colors.white : colors.lightWhite,
                // marginRight: 0, mnmnm
                flex: 1,     
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
                opacity: (focus && message.trim().length) ? 1 : 0,
                position: 'absolute', 
                right: 4,
                // backgroundColor: 'green'
            },
        },
      });

    function onPress() {
        createMutation.mutate(message);
        setMessage('');
    }

    const Query = useQuery({
        enabled: false,
        queryKey: keys,
        queryFn: async () => await Fetch.get(`${keys[0]}/`)
    });

    const createMutation = useMutation({    
        mutationFn: async (title) => {              
          try {
            return await Fetch.post(`${keys[0]}/`, { title });
          } catch (error) {
            console.warn('Create Error: ', error);
          }
        },
        onSuccess: async (item) => {
            const keyMap = {
                List: 'lists',
                Convo: 'convos',
                Note: 'notes',
            };
          
            Query.refetch();      

            if (!noRedirect) {   
                const keys = [keyMap[item.type], item.uuid];
                queryClient.setQueryData(['details'], { context: keys, title: item.title, type: item.type});
                queryClient.setQueryData(keys, { context: keys, ...item });        
            }
        },
      })

    return (
        <Animated.View style={textInputStyled.input.container}>                            
            <TextInput
                value={message}
                onBlur={() => setFocus(false)}
                onChangeText={(text) => setMessage(text)}
                onFocus={() => setFocus(true)}
                placeholder={placeholder}
                style={textInputStyled.input.field}
                placeholderTextColor={colors.darkText}
            />
            <Pressable
                onPress={onPress}
                style={textInputStyled.input.send}
            >
                <Icon name='send' styles={textInputStyled.input.icons.trailing} />
            </Pressable>
        </Animated.View>  
    )
  }