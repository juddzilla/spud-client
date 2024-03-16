import { useEffect } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {useSegments} from 'expo-router';

export default function CustomModal({ show, toggleShow, children }) {
    const segments = useSegments();    
    const compensateForTopBar = getStatusBarHeight() + 35;
    const paddingTop = compensateForTopBar + 48; // ios specifc size?

    useEffect(() => {        
        if (show) {
            toggleShow(false);
        }
    }, [segments]);

    const styles = StyleSheet.create({
        background: {
            backgroundColor: 'rgba(255,255,255,0.4)',
            flex: 1,
            paddingTop,
        },
        main: {
            flex: 1
        }
    });
    
    return (
        <Modal
            transparent={true}
            visible={show}
            onRequestClose={() => toggleShow(false)}
        >
            <View style={styles.background}>
                <View style={styles.main}>
                    {children}
                </View>
            </View>
        </Modal>
    )
}