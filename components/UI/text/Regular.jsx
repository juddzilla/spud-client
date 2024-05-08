import { Text, View } from 'react-native';
import colors from '../colors';

export default function Regular(props) {
    return (    
        <Text
            style={{ color: colors.theme.color, ...props.style, fontFamily: 'Inter-Regular' }}
        >
            {props.children}
        </Text>        
    );
}