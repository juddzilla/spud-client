import { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { queryClient } from '../../../contexts/query-client';
import { CustomRoutingContext } from '../../../contexts/custom-routing';

export default function ViewHeading() {
    const { stack } = useContext(CustomRoutingContext);
    const [context, setContext] = useState(null);
    const [title, setTitle] = useState(null);
    const [totals, setTotals] = useState([null, null])
    const [subtitle, setSubtitle] = useState(null);

    const cached = useQuery({
        enabled: false,
        queryKey: context,
    });

    useEffect(() => {
        console.log('stackhhh', stack);
        setContext(stack[stack.length - 1]);
    }, [stack])

    useEffect(() => {
        setTitle(context);
        console.log('contexthhh', context);
        // setTimeout(() => {

        //     console.log('queryClient', queryClient.getQueryData(context));
        // }, 5000)
    }, [context])

    useEffect(() => {
        console.log('cached jjj', cached.data);
        console.log('queryClient', queryClient.getQueryData(context));
        setTimeout(() => {

        }, 5000)
        if (cached.data) {
            if (Object.hasOwn(cached.data, 'count')) {
                setSubtitle(`Showing ${cached.data.results.length} of ${cached.data.count}`);
            } else {
                setSubtitle(cached.data.updated_at);
            }
        }
    }, [cached.data])

    return (
        <View>
            <Text>{title}</Text>
            <Text>{subtitle}</Text>
        </View>
    )
}