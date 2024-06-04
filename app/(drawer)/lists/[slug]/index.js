
import { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import List from "../../../../components/UI/Details/List";

export default function ListDetail() {
    const local = useLocalSearchParams();

    return (
        <View>
            <Text>List Detail</Text>
        </View>
    )
}
