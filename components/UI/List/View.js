
import { createContext, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSegments } from 'expo-router';
import DefaultListItem from './DefaultListItem';
// import FlatList from './FlatList';

import styles from '../styles';
import ViewHeading from './Header';
import Scrollable from './Scrollable';
import { colorway } from '../type';
import colors from '../colors';

import { ListViewContext } from '../../../contexts/list-view';

function ListViewProvider(props) {
  const [scrolled, setScrolled] = useState(0);

  return (
    <ListViewContext.Provider value={{ scrolled, setScrolled }}>
      {props.children}
    </ListViewContext.Provider>
  )
}

function Scrolling({ children }) {
  // const { setScrolled } = useContext(ListViewContext);
  const segments = useSegments();
  const backgroundColor = colorway(segments[1]);

  // function onScroll({ nativeEvent }) {
  //   setScrolled(nativeEvent.contentOffset.y)
  // }

  const slantConstant = 16;

  const styled = StyleSheet.create({
    slant: {
      width: 0,
      height: 0,
      borderBottomWidth: slantConstant,
      borderBottomColor: colors.white,
      borderLeftWidth: slantConstant,
      borderLeftColor: 'transparent',
    },
    shape: {
      backgroundColor,
      flexDirection: 'row',
      height: slantConstant,
      overflow: 'hidden',
    },
    solid: {
      backgroundColor: colors.white,
      height: slantConstant,
      flex: 1,
    },
  })
  return (
    <ScrollView
      stickyHeaderIndices={[1]}
      // onScroll={onScroll}
      scrollEventThrottle={16}
      style={{ flex: 1, backgroundColor }}
    >
      <View style={{ height: 24, backgroundColor }} />
      <ViewHeading />
      <View style={styled.shape}>
        <View style={styled.slant}></View>
        <View style={styled.solid}></View>
      </View>
      {children}
    </ScrollView>
  )
}

export default function ListView({ options }) {


  const { ItemTemplate = DefaultListItem } = options;




  return (
    <>
      {/* <DrawerScreen /> */}
      <ListViewProvider>
        <View style={{ ...styles.View, }}>
          <Scrolling>

            {/* <ViewHeading /> */}
            <View style={{ flex: 1, }}>

              <Scrollable renderItem={ItemTemplate} />
              {/* <FlatList
                filters={filters}
                context={storeKey}
                renderItem={ItemTemplate}
              /> */}

              {/* <View style={{ ...styles.footer, backgroundColor: 'transparent', position: 'absolute', bottom: 0, paddingHorizontal: 8 }}>
                <CreateInput
                  keys={storeKey}
                  noRedirect={noRedirect}
                  placeholder={actions.placeholder}
                />
                <TalkButton keys={storeKey} />
              </View> */}
            </View>
          </Scrolling>
        </View>
      </ListViewProvider>
    </>
  );
}
