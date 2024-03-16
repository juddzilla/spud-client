import { Pressable, Modal, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';

import colors from "../colors";
import Styles from "../styles";

const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.4)',
    },    
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
        // paddingHorizontal: 16,
        // paddingVertical: 8,
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
      display: action === '' ? 'flex' : 'none',
      close: {
        ...Styles.centered,
        backgroundColor: colors.white,
        height: 48,
        paddingRight: 16,
        paddingTop: 4,
      },
      container: {
        alignItems: 'flex-end',           
        backgroundColor: 'rgba(255,255,255,0.4)',
        paddingTop: getStatusBarHeight() + 35, 
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
export default {
    Remove: () => (
        <View style={styles.confirmation.content}>
            <View style={styles.confirmation.content.option}>
            <View style={{...Styles.centered, ...Styles.buttons.icon, backgroundColor: colors.remove, borderRadius: 999, ...styles.confirmation.content.option.child}}>
                <Icon name='trash' styles={{color: colors.white}} />
            </View>
            <Bold style={styles.confirmation.content.option.child}>Confirmation Required</Bold>
            <View style={{ ...styles.confirmation.content.option.child, ...styles.confirmation.content.option.body}}>
                <Light style={{textAlign: 'center'}}>Are you certain you want to delete this List? This action cannot be reversed.</Light>                                            
            </View>
            <View style={{width: '100%'}}>
                <Pressable style={{ ...styles.confirmation.actions.remove, ...styles.confirmation.button}}>
                <Bold style={{color: colors.white}}>Delete</Bold>
                </Pressable>
                <Pressable style={styles.confirmation.button} onPress={() => setAction('')}>
                <Bold>Cancel</Bold>
                </Pressable>
            </View>
            </View>
        </View>
    ),
    EditTitle: () => {},
}