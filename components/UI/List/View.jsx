import {
  useEffect,
  useRef,
  useState,
 } from 'react';

import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {
  keepPreviousData,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import DefaultListItem from './DefaultListItem';

import colors from '../colors';
import Icon from '../icons';
import styles from '../styles';

import Talk from '../actions/Talk';
import { DetailObservable } from '../Details/observable';
import Sort from '../filtering/Sort';
import Search from '../filtering/Search';
import Bold from '../text/Bold';

import Fetch from '../../../interfaces/fetch';

export default function ListView({options}) {
  const {
    actions,
    createKey='title',    
    filters,
    ItemTemplate = DefaultListItem,    
    storeKey,    
    noRedirect,
  } = options;

  const initialQuery = {
    page: 1,
    per: 20,
    search: '',    
  };
  
  if (Object.hasOwn(filters, 'sort')) {
    initialQuery.sortDirection = filters.sort.defaults.direction;
    initialQuery.sortProperty = filters.sort.defaults.property;
  }     
  const [total, setTotal] = useState(null);
  
  const [query, setQuery] = useState(initialQuery);
  const [next, setNext] = useState(null);
  const [focus, setFocus] = useState(false);
  const [message, setMessage] = useState('');

  const uri = `${storeKey[0]}/`;

  const unfocusedWidth = Dimensions.get('window').width-48-40;
  const focusedWidth = Dimensions.get('window').width-32;
  const widthAnim = useRef(new Animated.Value(unfocusedWidth)).current; // Initial 

  const Query = useQuery({
    queryKey: storeKey, 
    queryFn: async () => {
      const endpoint = next ? next : uri;
      const args = [endpoint];
      let results = [];
      
      if (!next) {
        args.push(query)
      }
      
      const response = await Fetch.get(...args);
      
      if (next && Query.data) {
        results = [...Query.data];
      }

      results = [...results, ...response.results];
      
      setNext(response.next);    
      setTotal(response.count);
      return results;
    },
    keepPreviousData: true,
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: async () => {      
      try {
        return await Fetch.post(uri, { [createKey]: message });
      } catch (error) {
        console.warn('Create Error: ', error);
      }
    },
    onSuccess: async (value) => {
      setMessage('');
      Query.refetch();      
      if (!noRedirect) {        
        DetailObservable.notify(value);
      }
    },
  })

  useEffect(() => {        
    Query.refetch();
  }, [query]);

  useEffect(() => {
    if (next === null && !Query.isFetching) {      
      Query.refetch();
    }
  }, [next]);
  
  useEffect(() => {
    let toValue = focus ? focusedWidth : unfocusedWidth
    Animated.timing(widthAnim, {
      toValue,
      duration: 90,
      useNativeDriver: false,
    }).start();
    
  }, [widthAnim, focus]);
   
  function getNext() {
    if (next && Query.fetchStatus !== 'fetching') {  
      Query.refetch();
    };
  }            

  function onRefresh() {   
    // idt this is being triggered
    setQuery(initialQuery); 
  }

  function update(params) {      
    setQuery({...query, ...params});
  }

  const ListEmptyComponent = () => {      
    const Empty = (props) => (
      <View style={{                
        flex: 1, 
        ...styles.centered
      }}>
        <View style={{          
          height: Dimensions.get('window').width - 32,
          width: Dimensions.get('window').width - 32,          
          ...styles.centered
        }}>
          {props.children}
        </View>
      </View>
    );
    
    if (Query.fetchStatus === 'fetching') {
      return null;
    }

    if (query.search.trim().length > 0) {
      return (
        <Empty><Bold>No matches for "{query.search}"</Bold></Empty>
      ) 
    }
    
    return (
      <Empty><Bold>Create Your First Below</Bold></Empty>
    )
  };

  const ListHeaderComponent = () => {      
    let headerMessage = '';
    if ([0, null].includes(total) || !Query.data) {
      headerMessage = 'Loading';
      
    } else {
      headerMessage = `Showing ${Query.data.length} of ${total}`
    }

    return (
      <View style={{...styles.row, paddingLeft: 24, backgroundColor: colors.darkBg, height: 40, marginBottom: 4}}>
        <Bold style={{fontSize: 12, color: colors.lightText}}>{ headerMessage }</Bold>        
      </View>
    )
  };
  
  const textInputStyled = StyleSheet.create({    
    input: {
        container: {
            backgroundColor: 'white',
            flexDirection: 'row', 
            alignItems: 'center', 
            flex: 1,              
            borderWidth: 1,
            borderColor: colors.theme.text.lightest,
            borderRadius: 12,            
            // height:  44,    
            zIndex: 10,
            // position: 'absolute',
            // left: 16,
            width: widthAnim,
        },
        field: {                    
            height: 48,    
            paddingHorizontal: 16,
            // backgroundColor: 'red',
            // marginRight: 0, mnmnm
            flex: 1,     
            color: colors.theme.inputs.dark.text.darkest,                            
        },
        icons: {
            leading: {
                size:12, 
                color: focus ? 'transparent' : colors.theme.inputs.dark.text.light, 
                position: 'absolute',
                zIndex: 1, 
                left: 12,
            },
            trailing: {
                size: 16, 
                color: focus ? colors.darkestBg : '#d4d4d4',
                zIndex: 1,
            }
        },
        send: {
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: colors.darkBg, 
            // borderRadius: 40,
            opacity: (focus && message.trim().length) ? 1 : 0,
            position: 'absolute', 
            right: 4
        },
    },
    modal: {
        container: {
            flex: 1,
            paddingTop: 100,
            paddingHorizontal: 16,
        },
        content: {
            fontSize: 36, 
            textAlign: 'center',
        }
    }
  });

  const loadingStyle = StyleSheet.create({
    paddingTop: '20%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',    
    height: '100%', 
    left: 0, 
    position: 'absolute', 
    top: 0, 
    width: '100%', 
  })

  const disableSort = !Query.data || (Query.fetchStatus === 'fetching' || !Query.length === 0);
  const disabledSearch = !Query.data || (Query.fetchStatus === 'fetching' || (query.search.trim().length === 0 && !Query.length === 0));
  
  return (
    <View style={styles.View}>
      <View style={styles.header}>   
        <View style={{paddingLeft:12, ...styles.row}}>              
          <Search
            disabled={disabledSearch}
            placeholder={filters.placeholder} 
            value={query.search}
            update={update} 
          />
          { Object.hasOwn(filters, 'sort') &&
            <Sort
              disabled={disableSort}
              fields={filters.sort.fields}
              query={{direction: query.sortDirection, property: query.sortProperty}} 
              update={update}
            />
          }
        </View> 
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={Query.data}
          renderItem={ItemTemplate}
          keyExtractor={(item, index) => `${item.uuid}+${index}`}                      
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          onRefresh={onRefresh}
          // onEndReached={getNext}
          onScroll={({ nativeEvent }) => {
            // using instead of onEndReached because onEndReach makes 1 extra request
            const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
            const numberOfPixelsFromBottomThreshold = 100;
            const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - numberOfPixelsFromBottomThreshold
            if (isNearBottom) {
                getNext(); // I usually fetchMore when end is reached
            }
        }}
          //if set to true, the UI will show a loading indicator
          refreshing={false}
        />
        
      <View style={{...styles.footer}}>
        <Animated.View style={textInputStyled.input.container}>                            
            <TextInput
                value={message}
                onBlur={() => setFocus(false)}
                onChangeText={(text) => setMessage(text)}
                onFocus={() => setFocus(true)}
                placeholder={actions.placeholder || 'NEW'}
                style={textInputStyled.input.field}
                placeholderTextColor={colors.theme.inputs.dark.text.light}
            />
            <Pressable
                onPress={createMutation.mutate}
                style={textInputStyled.input.send}
            >
                <Icon name='send' styles={textInputStyled.input.icons.trailing} />
            </Pressable>
        </Animated.View>  
        { !focus &&
          <Talk />          
        }
      </View>
      </View>
      {
        Query.fetchStatus === 'fetching' &&
          <View style={loadingStyle}>
            <Bold>Loading</Bold>
          </View>
      }
      {
        createMutation.isPending &&
          <View style={loadingStyle}>
            <Bold>Creating</Bold>
          </View>
      }
    </View>       
  );  
}
