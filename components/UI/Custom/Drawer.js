import { useContext } from "react";
import {
    Pressable,
    SafeAreaView,
    Text,
    View
} from "react-native";

import { CustomRoutingContext } from "../../../contexts/custom-routing";

import Icon from "../icons";

const viewsMap = {
    queue: { icon: 'home', label: 'Inbox' },
    lists: { icon: 'list', label: 'Lists' },
    notes: { icon: 'notes', label: 'Notes' },
    convos: { icon: 'convo', label: 'Convos' },
    list: { icon: 'list', label: 'List' },
    note: { icon: 'notes', label: 'Note' },
    convo: { icon: 'convo', label: 'Convo' },
    collections: { icon: 'collection', label: 'Collections' },
    collection: { icon: 'collection', label: 'Collection' },
};

const order = [
    'queue',
    'lists',
    'notes',
    'convos',
    'collections',
    // 'account',
    // 'settings'
];

export default function CustomDrawer(props) {
    const { setStack } = useContext(CustomRoutingContext);

    function onPress(item) {
        props.navigation.closeDrawer();
        setStack(item);
    }

    return (
        <SafeAreaView>
            <View>
                <Text>Custyom Draws</Text>
            </View>
            <View>
                {order.map(j => {
                    const item = viewsMap[j];
                    return (
                        <Pressable
                            key={`item-${j}`}
                            onPress={() => onPress(j)}
                            style={{ flexDirection: 'row' }}
                        >

                            <Icon name={item.icon} />
                            <Text>{item.label}</Text>
                        </Pressable>
                    )
                })}
            </View>
        </SafeAreaView>
    )
}