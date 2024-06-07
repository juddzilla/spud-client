
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useQuery, } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import Search from './Search';

import colors from '../colors';
import styles from '../styles';
import Bold from '../text/Bold';
import Light from '../text/Light';

export default function ListHeader({ keys, title = 'Spud' }) {
    const DataQuery = useQuery({
        enabled: false,
        queryKey: keys,
    });

    let subheadline = '';

    if (DataQuery.data && Object.hasOwn(DataQuery.data, 'count')) {
        subheadline = `Showing ${DataQuery.data.results.length} of ${DataQuery.data.count}`
    } else if (DataQuery.data && DataQuery.data.results) {
        subheadline = `${DataQuery.data.results.length}`;
    }

    const widthConstant = Dimensions.get('window').width * 0.075;
    const slantConstant = 24;

    const styled = StyleSheet.create({
        container: {
            paddingTop: widthConstant,

            // marginBottom: -(Dimensions.get('window').width * 0.075),
            // paddingHorizontal: 20,
            // flexDirection: 'row',
            // justifyContent: 'space-between',
            // height: Dimensions.get('window').width * 0.3,
            backgroundColor: colors.brand,
        },
        content: {
            paddingHorizontal: 20,
            paddingBottom: widthConstant / 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // paddingBottom: 8,
        },
        action: {
            backgroundColor: colors.lightWhite,
            borderRadius: 16,
            ...styles.centered,
            paddingVertical: 18,
            paddingHorizontal: 30,
        },
        curve: {
            // borderTopLeftRadius: Dimensions.get('window').width * 0.2,
            // borderTopLeftRadius: Dimensions.get('window').width * 0.075,
            // borderTopLeftRadius: (Dimensions.get('window').width * 0.15) * 0.5,
            height: slantConstant,
            backgroundColor: colors.brand,
            flex: 1,
            flexDirection: 'row'
            // position: 'absolute',
            // top: 30,
            // zIndex: 10,
        },
        slant: {
            width: 0,
            height: 0,
            borderBottomWidth: slantConstant,
            borderBottomColor: 'white',
            borderLeftWidth: slantConstant,
            borderLeftColor: 'transparent',
            // border-bottom: 100px solid red;
            // border-left: 100px solid transparent;
        }
    });

    return (
        <>
            <View style={styled.container} >
                <View style={styled.content}>
                    <View>
                        <Bold style={{ fontSize: 24 }}>{title}</Bold>
                        <Light style={{ fontSize: 12 }}>{subheadline}</Light>
                    </View>

                    <View>
                        <Pressable style={styled.action}>
                            <Bold style={{ fontSize: 12 }}>Add New</Bold>
                        </Pressable>
                    </View>
                </View>
                <View style={styled.curve}>
                    <View style={styled.slant}></View>
                    <View style={{ flex: 1, backgroundColor: 'white' }}></View>
                </View>
            </View>
        </>
    )
}