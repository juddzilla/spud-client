import {
    useEffect,
    useRef,
    useState,
} from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { BaseButton } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import {Picker} from '@react-native-picker/picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import RNPickerSelect from 'react-native-picker-select';
import { useMutation, useQuery } from '@tanstack/react-query';

import Fetch from '../../../interfaces/fetch';

class ActionableItemObserver {
    constructor() {
    this.data = null;
    this.observers = [];
    }

    get() {
    return this.data;
    }

    subscribe(func) {
    this.observers.push(func);
    }

    unsubscribe(inputFunc) {
    this.observers.filter(func => func != inputFunc);
    }

    notify(data) {
    this.data = data;
    this.observers.forEach(func => func(data));
    }
}

export const Observer = new ActionableItemObserver();

export default function Home() {
    const [item, setItem] = useState(null);
    const [lists, setLists] = useState([]);
    const [showLists, setShowLists] = useState(false);
    const [toList, setToList] = useState(null);
    const { showActionSheetWithOptions } = useActionSheet();
    const existingListsRef = useRef(null);

    const listsQuery = useQuery({
        enabled: false,
        // initialData: [],
        queryKey: ['lists'],
        queryFn: async () => {
            const params = {
            page: 1,
            per: 200,
            search: '', 
            sortDirection: 'desc',
            sortProperty: 'updated_at',
            };
            
            const response = await Fetch.get('lists/', params);
            console.log('response', response);

            if (!response.error) {
            console.log(0);
            return response.results;
            }
        },
    });

    useEffect(() => {
        console.log('UE 0 ITEM', item);
    if (item) {
        chooseAction();
    }
    }, [item])

    useEffect(() => {
        console.log('UE 1 listsQuery.data', listsQuery);
        if (listsQuery.data && !listsQuery.isPending && listsQuery.isSuccess) {
            setLists([
            { headline: 'Create as title', uuid: 'new-as-title'},
            { headline: 'Create as item', uuid: 'new-as-item'},
            ...listsQuery.data
            ].map(i => ({
            label: i.headline,
            value: i.uuid,        
            })));
            setShowLists(true);
        }
    }, [listsQuery.data, listsQuery.isPending, listsQuery.isSuccess]);

    useEffect(() => {
        console.log("UE 2", item, lists, showLists);
        if (showLists) {
            console.log('sss');
            showPicker(item);
        }
    }, [item, lists, showLists]);

    useEffect(() => {
        Observer.subscribe((value) => {     
            console.log('action', value);
            setItem(value);
        //   chooseAction();
        })
        return () => Observer.unsubscribe
    }, []);


    function chooseAction() {        
        console.log('CHOOSE ITEM', item);
        const options = ['Search Web', 'Start Convo', 'Create Note', 'Add To List', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        const destructiveButtonIndex = null;
        const title = `What would you like to do with: "${item.headline}"`;        

        showActionSheetWithOptions({
            cancelButtonIndex,
            destructiveButtonIndex,        
            options,
            title,
        }, (selectedIndex) => {
            console.log('selected', item.uuid, options[selectedIndex]);
            if (selectedIndex === cancelButtonIndex) {
                Observer.notify(null);
            }
            if (selectedIndex === 3) {
                // chooseListType(item);
                // Observer.notify(null);
                listsQuery.refetch();
            }
        });
    }

    function showPicker() {
        existingListsRef.current.togglePicker();
    }

    function chooseList() {
        console.log('chooselist', item);
    }

    function listDone() {
        console.log('done', Object.keys(existingListsRef.current));
        // const item = Observer.get();
        Observer.notify(null);
        chooseAction();
        // existingListsRef.current.props.onClose();
    }

    return (
        <View style={{position:'absolute', height: 0, opacity: 0, bottom: 0}}>        
            <RNPickerSelect
            ref={existingListsRef}
            doneText='Back'
            onValueChange={chooseList}
            onDonePress={listDone}
            items={lists}
            />        
        </View>
    )
}