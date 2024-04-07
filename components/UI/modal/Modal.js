import { useEffect } from 'react';
import Modal from "react-native-modal";
import { View } from 'react-native';
import { useSegments } from 'expo-router';

export default function CustomModal({ show, toggleShow, children }) {
    const segments = useSegments();

    useEffect(() => {        
        if (show) {
            toggleShow(false);
        }
    }, [segments]);

    return (
        <Modal
            backdropColor='rgba(255,255,255,0.8)'
            transparent={true}
            isVisible={show}
            onBackdropPress={() => toggleShow(false)}            
        >
            <View>
                {children}                
            </View>            
        </Modal>
    )
}