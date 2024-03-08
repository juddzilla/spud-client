import { Text } from 'react-native';

export default function Black(props) {
    return (
        <Text style={{ ...props.style, fontFamily: 'Inter-Black' }}>{props.children}</Text>
    );
}