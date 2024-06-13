import { useSegments, useLocalSearchParams } from 'expo-router';
import {
    Alert,
    Dimensions,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import colors from '../colors';
import { useQuery, useMutation } from '@tanstack/react-query';
import Bold from '../text/Bold';
import Light from '../text/Light';
import styles from '../styles';
import Icon from '../icons';

import { colorway } from '../type';
import { drawerTitle } from '../type';

import Fetch from '../../../interfaces/fetch';

const subheadlineTypeMap = {
    lists: (list) => `${list.children_count} List Items`,
    convos: (convo) => `${convo.children_count} Messages`,
    notes: (note) => `Last Updated: ${note.updated_at}`,
    collections: (collection) => { }
};

export const HeaderButton = ({ icon, style = {}, onPress, text }) => {
    const styled = StyleSheet.create({
        button: {
            paddingHorizontal: 20,
            paddingVertical: 4,
            backgroundColor: colors.white,
            ...styles.centered,
            borderRadius: 16,
            ...style.button,
            // height: 40,

        },
        icon: {
            size: 16,
            ...style.icon,
        },
        text: {
            ...style.text,
        }
    });

    return (
        <Pressable onPress={onPress} style={styled.button}>
            {
                icon &&
                <Icon name={icon} styles={styled.icon} />
            }
            {
                text &&
                <Bold style={styled.text}>{text}</Bold>
            }
        </Pressable>
    )
};

export const HeaderToggleableIcon = ({ icon, style = {}, onPress }) => {
    const dimension = 36;
    const styled = StyleSheet.create({
        button: {
            ...styles.centered,
            backgroundColor: styles.backgroundColor,
            border: 1,
            // borderColor: 'black', //styles.borderColor,            
            borderRadius: 4,
            borderWidth: 1,
            height: dimension,
            marginLeft: 3,
            width: dimension,
            ...style.button,

        },
        icon: {
            ...style.icon,
        },
    });
    return (
        <Pressable onPress={onPress} style={styled.button}>
            <Icon name={icon} styles={style.icon} />
        </Pressable>
    );
}

export default function ViewHead({ children }) {
    const local = useLocalSearchParams();
    const segments = useSegments();

    const type = segments[1];
    const uuid = local.slug;

    const context = [type, uuid].filter(Boolean);

    const DataQuery = useQuery({
        enabled: false,
        queryKey: context,
    });

    const updateTitleMutation = useMutation({
        mutationFn: async (title) => {
            const uri = context.join('/') + '/';
            return await Fetch.put(context, { title });
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log(`rolling back optimistic update with id ${context.id}`)
        },
        onSuccess: (data) => {  // variables, context
            console.log('onsuc', data);
            // queryClient.setQueryData(context, oldData => {
            //     return { ...oldData, ...data };
            // });
            // queryClient.invalidateQueries([context[0]]);
        },
    })

    let subheadline = '';
    if (DataQuery.data) {
        if (uuid) {
            subheadline = subheadlineTypeMap[type](DataQuery.data);
        } else {
            subheadline = `Showing ${DataQuery.data.results.length} of ${DataQuery.data.count}`;
        }
    }

    const backgroundColor = colorway(context[0]);
    const title = (DataQuery.data && DataQuery.data.title) ? DataQuery.data.title : drawerTitle[context[0]];
    const widthConstant = Dimensions.get('window').width * 0.075;

    const styled = StyleSheet.create({
        children: { flexDirection: 'row' },
        container: {
            backgroundColor,
            // marginBottom: 200,
        },
        content: {
            paddingBottom: widthConstant / 2,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // marginBottom: 120,
        },
    });

    function onPress() {
        if (!uuid) {
            return;
        }

        Alert.prompt(
            'Rename',
            null,
            updateTitleMutation.mutate,
            'plain-text',
            title,
        )
    }


    return (
        <View style={styled.container}>
            <View style={styled.content}>
                <View style={{ flex: 1 }}>
                    <Pressable onPress={onPress}>
                        <Bold style={{ color: 'white', fontSize: 24, textTransform: 'capitalize' }}>{title}</Bold>
                    </Pressable>
                    <Light style={{ fontSize: 12, color: 'white', }}>{subheadline}</Light>
                </View>

                {children &&
                    <View style={styled.children}>
                        {children}
                    </View>
                }
            </View>
        </View>
    );
}