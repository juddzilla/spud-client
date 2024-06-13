import { Alert, StyleSheet } from "react-native";

import { useLocalSearchParams, useSegments } from "expo-router";
import styles from "../styles";
import colors from "../colors";
import { colorway, singular } from "../type";

import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../contexts/query-client";

import Fetch from "../../../interfaces/fetch";
import { HeaderButton } from "../View/Header";

export default function Add() {
    const local = useLocalSearchParams();
    const segments = useSegments();
    const type = segments[1];
    const uuid = local.slug;
    const context = [type, uuid].filter(Boolean);

    const typeColor = colorway(type);

    const Query = useQuery({
        enabled: false,
        queryKey: context,
        queryFn: async () => {
            const currentData = queryClient.getQueryData(context);
            const params = { ...currentData.params, page: 1 };
            const response = await Fetch.get(`${type}/`, params);
            return { ...response, params };
        }
    });

    const createMutation = useMutation({
        mutationFn: async (title) => {
            try {
                return await Fetch.post(`${type}/`, { title });
            } catch (error) {
                console.warn('Create Error: ', error);
            }
        },
        onSuccess: Query.refetch,
    })

    function onPress() {
        const message = 'Enter the title';
        const title = `Create new ${singular(type)}`;
        Alert.prompt(
            title,
            message,
            createMutation.mutate,
            'plain-text'
        )
    }

    const styled = StyleSheet.create({
        button: {
            paddingHorizontal: 20,
            paddingVertical: 4,
            backgroundColor: colors.white,
            ...styles.centered,
            borderRadius: 16
        },
        icon: {
            color: typeColor,
        },
        text: {
            color: typeColor,
        }
    })

    return (
        <HeaderButton
            onPress={onPress}
            style={styled}
            text='Add New'
        />
    )
}