
import { View } from 'react-native';
import {
    useQuery,
} from '@tanstack/react-query';


import Search from './Search';
import colors from '../colors';
import styles from '../styles';
import Bold from '../text/Bold';

export default function ListHeader({ keys }) {
    const DataQuery = useQuery({
        enabled: false,
        queryKey: keys,
    });

    let headerMessage = 'Loadingff ';

    if (DataQuery.data && DataQuery.data.count !== null) {
        headerMessage = `Showing ${DataQuery.data.results.length} of ${DataQuery.data.count}`
    }

    return (
        <View style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingLeft: 20,
            backgroundColor: colors.darkBg,
            height: 48,
            marginBottom: 4,
            paddingRight: 8,
        }}>
            <View style={{ marginRight: 16 }}>
                <Bold style={{ fontSize: 12, color: colors.lightText }}>{headerMessage}</Bold>
            </View>
            <Search keys={keys} />
        </View>
    )
}