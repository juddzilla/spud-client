import {
    useEffect,
    useRef,
    useState,
} from 'react';
import { View } from 'react-native';

import { useActionSheet } from '@expo/react-native-action-sheet';
import RNPickerSelect from 'react-native-picker-select';
import { useQuery } from '@tanstack/react-query';

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

            if (!response.error) {            
                return response.results;
            }
        },
    });

    useEffect(() => {
    if (item) {
        chooseAction();
    }
    }, [item])

    useEffect(() => {
        
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
        if (showLists) {        
            showPicker(item);
        }
    }, [item, lists, showLists]);

    useEffect(() => {
        Observer.subscribe((value) => {  
            setItem(value);
        //   chooseAction();
        })
        return () => Observer.unsubscribe
    }, []);


    function chooseAction() {        
        const options = ['Search Web', 'Start Convo', 'Create Note', 'Add To List', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        const destructiveButtonIndex = null;
        const title = `What would you like to do with: "${item.title}"`;        

        showActionSheetWithOptions({
            cancelButtonIndex,
            destructiveButtonIndex,        
            options,
            title,
        }, (selectedIndex) => {
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
        // console.log('chooselist', item);
    }

    function listDone() {        
        Observer.notify(null);
        chooseAction();
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