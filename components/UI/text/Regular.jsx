import { Text } from 'react-native';

export default function Regular(props) {
    return (
        <Text style={{ ...props.style, fontFamily: 'Inter-Regular' }}>{props.children}</Text>
    );
}