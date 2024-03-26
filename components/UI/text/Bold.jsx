import { Text } from 'react-native';
import colors from '../colors';

export default function Bold(props) {
    return (
        <Text style={{ color: colors.theme.color, ...props.style, fontFamily: 'Inter-Bold' }}>{props.children}</Text>
    );
}