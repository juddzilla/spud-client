import { useContext, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CustomRoutingContext } from '../../../contexts/custom-routing';
import { queryClient } from '../../../contexts/query-client';

import InboxList from '../Inbox/List';
import ListView from '../List/View';

import List from '../Details/List';
import Note from '../Details/Note';
import Convo from '../Details/Convo';

const componentMap = {
    queue: InboxList,
    lists: ListView,
    convos: ListView,
    notes: ListView,
};

const detailsMap = {
    lists: List,
    convos: Convo,
    notes: Note,
}

const dynamicComponent = (context) => {
    console.log('context', context);

    if (context.length === 2) {
        return detailsMap[context[0]](context);
    } else {
        return componentMap[context[0]];
    }
};
export default function CustomContent() {
    const { current, stack, setStack } = useContext(CustomRoutingContext);
    const [data, setData] = useState(null);
    // const [Component, setComponent] = useState(null);
    const Component = dynamicComponent(current);

    // let Component = componentMap['queue'];
    // useEffect(() => {
    // console.log('current', componentMap[current[0]]);
    // setComponent(dynamicComponent(current))
    // dynamicComponent(current);
    // Component = componentMap[current[0]];
    // console.log('current', componentMap[current[0]]);
    // let context = null;
    // if (!stack.length) {
    //     console.log('show inbox');

    //     context = ['queue'];
    //     // Component = InboxList;
    // } else if (stack[stack.length - 1].includes(':')) {
    //     console.log('has UUID', stack[stack.length - 1]);
    //     context = stack[stack.length - 1].split(':')
    // } else {
    //     console.log('list', stack[stack.length - 1]);
    //     context = stack[stack.length - 1];
    // }

    // console.log('context', context);
    // console.log('cached', queryClient.getQueryData(context));
    // }, [current]);

    return (
        <View style={{ flex: 1 }}>
            <Component />
            {/* {Component !== null &&
                <Component />
            } */}
            {/* {Component !== null &&
            } */}
        </View>
    )
}