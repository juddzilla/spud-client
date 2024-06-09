import { useSegments, useLocalSearchParams } from 'expo-router';
import {
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';
import colors from '../colors';
import { useQuery, } from '@tanstack/react-query';
import Bold from '../text/Bold';
import Light from '../text/Light';
import styles from '../styles';

import { typeColorMap } from './styles';
import { titleNameMap } from './title';

export default function ViewHead({ children }) {
    const local = useLocalSearchParams();
    const segments = useSegments();

    const section = segments[1];
    const uuid = local.slug;

    const context = [section, uuid].filter(Boolean);

    const DataQuery = useQuery({
        enabled: false,
        queryKey: context.filter(Boolean),
    });

    let subheadline = '';
    if (DataQuery.data) {
        if (DataQuery.data.count) {
            subheadline = `Showing ${DataQuery.data.results.length} of ${DataQuery.data.count}`;
        } else if (DataQuery.data.results && DataQuery.data.results.length) {
            subheadline = `${DataQuery.data.results.length}`;
        }
    }

    const backgroundColor = typeColorMap(context[0]);
    const slantConstant = 36;
    const title = (DataQuery.data && DataQuery.data.title) ? DataQuery.data.title : titleNameMap[context[0]];
    const widthConstant = Dimensions.get('window').width * 0.075;

    const styled = StyleSheet.create({
        container: {
            paddingTop: 24,
            backgroundColor,
        },
        content: {
            paddingHorizontal: 20,
            paddingBottom: widthConstant / 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        action: {
            backgroundColor: colors.lightWhite,
            borderRadius: 16,
            ...styles.centered,
            paddingVertical: 18,
            paddingHorizontal: 30,
        },
        shape: {
            backgroundColor,
            flex: 1,
            flexDirection: 'row',
            overflow: 'hidden'
        },
        slant: {
            backgroundColor: colors.white,
            width: slantConstant * 2,
            height: slantConstant * 2,
            borderTopLeftRadius: '50%',
            position: 'absolute',
            left: 0,
            top: 0,
        },
        solid: {
            flex: 1,
            height: slantConstant,
            backgroundColor: colors.white,
            marginLeft: slantConstant * 2,
        }
    });


    return (
        <View style={styled.container} >
            <View style={styled.content}>
                <View style={{ flex: 1 }}>
                    <Bold style={{ fontSize: 24, textTransform: 'capitalize' }}>{title}</Bold>
                    <Light style={{ fontSize: 12 }}>{subheadline}</Light>
                </View>

                {children &&
                    { ...children }
                }

            </View>
            <View style={styled.shape}>
                <View style={styled.slant}></View>
                <View style={styled.solid}></View>
            </View>
        </View>
    );
}