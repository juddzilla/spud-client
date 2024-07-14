import { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { queryClient } from '../../../contexts/query-client';
import { CustomRoutingContext } from '../../../contexts/custom-routing';

const viewMap = {
    queue: 'Inbox',
    lists: 'Lists',
    notes: 'Notes',
    convos: 'Convos',
};
export default function ViewHeading() {
    const { current, stack } = useContext(CustomRoutingContext);
    const [context, setContext] = useState(null);
    const [title, setTitle] = useState(null);
    const [totals, setTotals] = useState([null, null])
    const [subtitle, setSubtitle] = useState(null);

    const cached = useQuery({
        enabled: false,
        queryKey: context,
    });

    useEffect(() => {
        // console.log('stackhhh', stack);
        console.log('22', current);

        setTitle(viewMap[current[0]]);

    }, [current])


    useEffect(() => {
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
            <Text>1{title}</Text>
            <Text>{subtitle}</Text>
        </View>
    )
}