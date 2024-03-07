import { Text } from 'react-native';

export default function Bold(props) {
    return (
        <Text style={{ ...props.style, fontFamily: 'Inter-Bold' }}>{props.children}</Text>
    );
}