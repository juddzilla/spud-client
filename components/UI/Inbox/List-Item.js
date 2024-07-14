import { Text, View } from 'react-native';

export default function InboxListItem({ index, item }) {
    console.log('index, ', index);
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text>IndeX: {index + 1}</Text>
            <Text>{item.body}</Text>
        </View>
    )
}