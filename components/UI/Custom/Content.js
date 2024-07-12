import { useContext, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CustomRoutingContext } from '../../../contexts/custom-routing';
import { queryClient } from '../../../contexts/query-client';

import InboxList from '../Inbox/List';
export default function CustomContent() {
    const { stack, setStack } = useContext(CustomRoutingContext);
    const [data, setData] = useState(null);

    let Component = InboxList;
    // useEffect(() => {
    //     console.log('Stack', stack);
    //     let context = null;
    //     if (!stack.length) {
    //         console.log('show inbox');

    //         context = ['queue'];
    //         // Component = InboxList;
    //     } else if (stack[stack.length - 1].includes(':')) {
    //         console.log('has UUID', stack[stack.length - 1]);
    //         context = stack[stack.length - 1].split(':')
    //     } else {
    //         console.log('list', stack[stack.length - 1]);
    //         context = stack[stack.length - 1];
    //     }

    //     console.log('context', context);
    //     console.log('cached', queryClient.getQueryData(context));
    // }, [stack])

    return (
        <View style={{ flex: 1 }}>
            <Component />
            {/* {Component !== null &&
            } */}
        </View>
    )
}