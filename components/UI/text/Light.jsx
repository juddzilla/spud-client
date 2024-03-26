import { Text } from 'react-native';
import colors from '../colors';

export default function Light(props) {
    return (
        <Text style={{ color: colors.theme.color, ...props.style, fontFamily: 'Inter-Light' }}>{props.children}</Text>
    );
}