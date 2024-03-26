import { Text } from 'react-native';
import colors from '../colors';

export default function Black(props) {
    return (
        <Text style={{ color: colors.theme.color, ...props.style, fontFamily: 'Inter-Black' }}>{props.children}</Text>
    );
}