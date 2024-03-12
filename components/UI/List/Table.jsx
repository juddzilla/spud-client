import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import Icon from '../icons';
import Bold from '../text/Bold';
import Light from '../text/Light';

import colors from '../colors';

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
        const { id, subtitle, title, type } = item;

        const styled = StyleSheet.create({
          pressable: {
            backgroundColor: !selected.includes(item.id) ? 'white' : 'red',        
            paddingHorizontal: 4,
            paddingVertical: 8,
            marginVertical: 8,
            marginHorizontal: 16,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',     
            // overflow: 'hidden',
            
            shadowColor: "#e2e8f0",
            shadowOffset: {
                width: 0,
                height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.00,
            elevation: 24,
          },
          content: {
            // alignItems: 'center',
            flexDirection: 'row', 
          },
          info: {
            // paddingVertical: 12,
          },
          icon: {
            container: {
              // backgroundColor: colors.darkestBg,
              // height: 44, 
              width:40, 
              marginRight: 0, 
              alignItems: 'center', 
              justifyContent: 'flex-start',
            },
            image: { size: 36, color: colors.lightBg }
          },
          subtitle: { fontSize: 12, color: '#6b7280' },
          title: { fontSize: 16, marginBottom: 4 },
        });

        const typeToIconMap = {
          Collection: 'collection',
          Convo: 'convo',
          List: 'list',
          Note: 'notes',
        };

        return (
          <Pressable
              style={styled.pressable}
              onPress={() => onPress(type, id)} 
              onLongPress={() => onLongPress(index)}
          >      
              <View style={styled.content}>
                  <View style={styled.icon.container}>
                      <Icon name={typeToIconMap[type]} styles={styled.icon.image} />
                      {/* <Bold style={styled.title}>{subtitle}</Bold> */}
                  </View>
                  <View style={styled.info}>
                      <Bold style={styled.title}>{title}</Bold>
                      <Light style={styled.subtitle}>{ subtitle || "Thse lsast bit on convo goes here..." }</Light>
                  </View>
              </View>
          </Pressable>    
      )};

    // console.log('ist', list);

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