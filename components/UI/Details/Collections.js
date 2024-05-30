import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
 } from 'react';

 import {
  FlatList,
  Pressable, 
  StyleSheet, 
  TouchableOpacity,
  View,
} from 'react-native';

import {
  keepPreviousData,
  useMutation,  
  useQuery,
} from '@tanstack/react-query';

import Exit from './Exit';
import Title from './Title';

import Menu from './Menu';

import DraggableFlatList, { ScaleDecorator, } from "react-native-draggable-flatlist";
import { BaseButton } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";

import { DetailStyles } from './styles';
import Hide from './Hide';
import Input from './Input';
import TalkButton from '../Talk/Button';
import colors from '../colors';
import DebouncedInput from '../DebouncedInput';
import Icon from '../icons';
import styles from '../styles';
import Bold from '../text/Bold';
import Light from '../text/Light';
import Regular from '../text/Regular';

import { queryClient } from '../../../contexts/query-client';
import Fetch from '../../../interfaces/fetch';

const ListParamsContext = createContext({});

const initialFilters = { completed: null, search: ''};
const textColor = colors.darkText;

function ListParamsProvider(props) {
  const [listParams, setListParams] = useState(initialFilters);

  return (
    <ListParamsContext.Provider value={{listParams, setListParams}}>
      { props.children}
    </ListParamsContext.Provider>
  )
}

const EmptyListState = () => {
  const { context } = queryClient.getQueryData(['details']);
  const queryData = queryClient.getQueryData(context);

  if (!queryData || !queryData.params) {
    return (
      <View style={{...styles.row, color: colors.white}}>            
          <Bold style={{color: colors.darkText}}>LOADING</Bold>
      </View>
    );
  }

  const completedMap = {
    false: "No 'Uncompleted' Items",
    true: '0 Completed Items',
  }

  return (
    <View style={{ padding: 16, flex: 1, alignItems: 'center' }}>        
      { !queryData.results.length ? (          
        <View style={{...styles.row}}>            
          <Bold style={{color: colors.darkText}}>Add your first list item</Bold>
        </View>
      ) : (
        <View style={{...styles.row}}>
          { queryData.params.search.trim().length ?
            (
              <>
                <Light style={{marginRight: 2}}>No list items containing</Light>
                <Bold>"{queryData.params.search}"</Bold>
              </>
            ) : (
              <>
                <Light>{completedMap[queryData.params.completed]}</Light>
              </>
            )
          }
        </View>
      ) }
    </View>
  )
};

const ListList = ({context}) => {   
  console.log('context', context);
  const baseUri = context.join('/')+'/';
  const itemsUri = `${baseUri}items/`;
  const itemUri = (itemId) => `${baseUri}item/${itemId}/`;
  const [items, setItems] = useState([]);
  const {listParams} = useContext(ListParamsContext);

  const initialData = {
    count: null, 
    next: null, 
    params: {
        page: 1,
        per: 100,
        search: '',
        sortDirection: 'desc',
        sortProperty: 'order',
        completed: null,
    }, 
    results: []
  };

  const DataQuery = useQuery({       
    initialData,
    keepPreviousData: true,
    placeholderData: keepPreviousData,
    queryFn: async () => await Fetch.get(baseUri),    
    queryKey: context, 
  });


  useEffect(() => {
    if (DataQuery.data.results) {      
      console.log('DataQuery.data.results', DataQuery.data.results);
      // const newItems = filterItems(DataQuery.data.results, listParams);          
      setItems(DataQuery.data.results);
    }

  }, [DataQuery.data, listParams]);


  // function filterItems(list, filter) {
  //   return list.filter(i => {
  //     if (filter.completed === null) { return true; }
  //     return i.completed === filter.completed;
  //   });
  // }

  // function onReorder({data}) {
  //   const newItems = filterItems(data, listParams);          
  //   setItems(newItems);    
  //   const dataIds = data.map(d => d.id);
  //   const queryData = queryClient.getQueryData(context);
  //   const queryDataIds = queryData.results.map(d => d.id);
  //   const areEqual = JSON.stringify(dataIds) === JSON.stringify(queryDataIds);

  //   if (!areEqual) {
  //     const reordered = data.reduce((acc, cur, index) => {
  //       cur.order = index;
  //       acc.items.push(cur);
  //       acc.ids.push(cur.id);
  //       return acc;
  //     }, { items: [], ids: []});

  //     reorderMutation.mutate({order: reordered.ids});
  //   }
  // }

  // const reorderMutation = useMutation({
  //   mutationFn: async (order) => await Fetch.put(itemsUri, order),
  //   onSuccess: (data) => {      
  //     const newItems = filterItems(reorderMutation.data.results, listParams);          
  //     setItems(newItems);
  //   }
  // });

  const removeListItemMutation = useMutation({
    mutationFn: async ({ id }) => {
      try {
        return await Fetch.remove(itemUri(id));
      } catch (error) {
        console.warn('Delete List Item Error:', error);
      }
    },
    onSuccess: (data) => {          
      if (!data.error) {
        queryClient.invalidateQueries([context[0]]);
      } 
    }
  })


  const ListItem = useCallback((props) => {    
    const {drag, getIndex, isActive, item} = props;   
    
    const number = getIndex()+1;
    
    const styled = StyleSheet.create({
      container: {
        flexDirection: 'row',
        // marginHorizontal: 0,
        // flex: 1,
        // marginRight: 4,
        // marginBottom
      },      
      icon: {
        color: textColor,
        size: 24,
        // left: 1,    
      },
      body: {
        // flex: 1,
        paddingLeft: 12,   
      },
      indexContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 16,
        height: 20,
        width: 20, 
        // borderWidth: item.completed ? 1 : 2,
        // borderRadius: 4,
        // borderColor: item.completed ? colors.lightText : colors.darkText,
        
      },
      index: {
        fontSize: 10,     
      },
      input: {
        backgroundColor: 'transparent',
        color: textColor,
        fontFamily: item.completed ? 'Inter-Light' :'Inter-Regular',  
        fontSize: 16,
        lineHeight: 20,                   
        height: '100%',
        paddingRight: 0,  
        position: 'relative',
        top: -5,
      },
      text: {
        color: colors.lightWhite,
        position: 'relative', 
        top: 3
      }
    });

    const RenderRightActions = () => {    
      const { percentOpen } = useSwipeableItemParams();
      const animStyle = useAnimatedStyle(
        () => ({
          opacity: percentOpen.value,
        }),
        [percentOpen]
      );

      const rightActionStyled = StyleSheet.create({
        base: {alignItems: 'flex-end', justifyContent: 'center', height: 44},
        view: {            
          justifyContent: 'center',
          alignItems: 'center',              
          width: 60,
          flex: 1,
          ...animStyle,
        },
        icon: {backgroundColor: colors.remove, transform: [{ translateX: -16 }]}
      })

      return (
        <BaseButton style={rightActionStyled.base} onPress={() => { removeListItemMutation.mutate(item) }}>
          <Animated.View style={rightActionStyled.view}>            
            <Icon name='trash' styles={rightActionStyled.icon} />
          </Animated.View>
        </BaseButton>
      );
    };



    return (
      <ScaleDecorator>
        <SwipeableItem
          key={item.id}
          item={item}
          renderUnderlayLeft={() => <RenderRightActions drag={drag}/>}
          snapPointsLeft={[48]}
          overSwipe={20}
        >
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            onPress={() => { console.log('pressed', item)}}
            disabled={isActive}          
            style={{...styles.row, marginBottom: 12}}
          >
            <View style={styled.indexContainer}>              
              <Regular style={styled.index}>{ number }</Regular>
              
            </View>
            <Icon name={item.type.toLowerCase()} styles={styled.icon} />              
            <View style={styled.container}>
              <View style={styled.body}>
                <Regular style={{fontSize: 18}}>{item.related_item.title}</Regular>
                
              </View>
            </View>
          </TouchableOpacity>        
        </SwipeableItem>
      </ScaleDecorator>
    )
  }); 

  console.log('ITEMS', items);
  if (!items || !items.length) {
    return null;  
  }
  
  return (
    <View style={{flex: 1, paddingHorizontal: 16, paddingBottom: 0}}>
      <DraggableFlatList
        activationDistance={20}           
        data={items}
        initialNumToRender={20}
        keyExtractor={(item) => `${item.type}+${item.related_item.uuid}`}                      
        ListEmptyComponent={<EmptyListState />}
        // ListFooterComponent={<ListFooterComponent />}
        // onDragEnd={onReorder}
        renderItem={ListItem}
        refreshing={true}
      />      
    </View>
  );
};

const Header = () => {
  const {listParams, setListParams} = useContext(ListParamsContext);

  function toggleShowCompleted() {
    let completed = null;
    
    if (listParams.completed === null) {      
      completed = true;
    } else if (listParams.completed === true) {      
      completed = false;
    }
    setListParams({...listParams, completed})    
  }

  const checkboxToggleIconMap = {
    null: 'checkedFilled',
    true: 'completedOnly',
    false: 'completedNot'
  };

  let checkboxToggleIcon = checkboxToggleIconMap[null];

  if (listParams && !listParams.completed !== null) {
    checkboxToggleIcon = checkboxToggleIconMap[listParams.completed];
  }

  const styled = StyleSheet.create({    
    header: {
      ...DetailStyles.header,
    },
    menu: {
      ...DetailStyles.menu
    },
    button: {
      width: 40, 
      height: 40, 
      ...styles.centered,
    },
    icon: {
      size: 22, 
      color: colors.darkText
    },
  })

  return (
    <View style={styled.header}>
      <Exit />
      <View style={styled.menu}>             
        {/* <Pressable
          onPress={toggleShowCompleted}
          style={styled.button}
        >
          <Icon name={checkboxToggleIcon} styles={styled.icon} />
        </Pressable>   */}
        <Menu noCollectionsToggle={true}/>
      </View>
    </View>
  )
}

export default function Collection({item}) {  
  console.log('Collection');
  
  const queryKeys = item.context;

  const styled = StyleSheet.create({
    view: {
      ...DetailStyles.view,
      backgroundColor: colors.theme.inputs.light.backgroundColor,   
    },
    flex1: {flex: 1},
    content: {
      ...DetailStyles.content
    },
    header: {
      ...DetailStyles.header,
    },
    menu: {
      ...DetailStyles.menu
    },
  });

  return (
    <ListParamsProvider>
      <View
        style={styled.view}
      >   
        <Header />           
        <View style={styled.content}>
          <Title />
          
          <View style={styled.flex1}>
            <ListList context={queryKeys} />            
          </View>                    
          
        </View>

        <View style={styles.footer}>          
          <TalkButton keys={queryKeys} />
        </View>       
      </View>
    </ListParamsProvider>
  );
}