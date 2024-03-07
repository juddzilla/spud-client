import { Text } from 'react-native';

export default function Light(props) {
    return (
        <Text style={{ ...props.style, fontFamily: 'Inter-Light' }}>{props.children}</Text>
    );
}