import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import Bold from '../text/Bold';

export default function Prompt(props) {
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