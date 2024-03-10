import {
  FlatList,
  Pressable, 
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Bold from '../text/Bold';
import Light from '../text/Light';

// infinite scroll
// find
// sort by date or name
// delete
// hide
// onlongpress, change to checkboxes/change bg color
// if nothing checked, change to list item/remove bg color
// list types: unordered (can sort by date), ordered

export default function ListTable({    
    list,
    ListHeaderComponent,
    onEndReached,
    onLongPress,
    onPress,
    onRefresh,        
    selected,    
}) {  

    const ListItem = ({ index, item }) => {
        const { id, subtitle, title } = item;

        const itemStyle = {
            backgroundColor: !selected.includes(item.id) ? 'white' : 'red',        
            paddingHorizontal: 4,
            paddingVertical: 16,
            marginVertical: 8,
            marginHorizontal: 16,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',            
            
            shadowColor: "#e2e8f0",
            shadowOffset: {
                width: 0,
                height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.00,
            elevation: 24,
        };

        return (
        <Pressable
            style={itemStyle}
            onPress={() => onPress(id)} 
            onLongPress={() => onLongPress(index)}
        >      
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <View style={{ backgroundColor: 'black', height: 44, width:64, marginRight: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="chatbubbles-outline" size={24} color='white' style={{}} />
                </View>
                <View>
                    <Bold style={{ fontSize: 16, marginBottom: 8 }}>{title}</Bold>
                    <Light style={{ fontSize: 12, color: '#6b7280' }}>{ subtitle || "Thse lsast bit on convo goes here..." }</Light>
                </View>
            </View>
        </Pressable>    
    )};

    console.log('ist', list);

  return (
    <>
      <FlatList
        data={list}
        renderItem={ListItem}
        keyExtractor={item => item.id}
        onEndReached={onEndReached}        
        ListHeaderComponent={ListHeaderComponent}
        onRefresh={onRefresh}
        //if set to true, the UI will show a loading indicator
        refreshing={false}
      />      
    </>
  );
}