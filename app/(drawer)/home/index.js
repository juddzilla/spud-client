import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import SwipeableItem, { useSwipeableItemParams, } from "react-native-swipeable-item";
import * as WebBrowser from 'expo-web-browser';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { BaseButton } from 'react-native-gesture-handler';
import colors from '../../../components/UI/colors';
import styles from '../../../components/UI/styles';


import Icon from '../../../components/UI/icons';
import ListView from '../../../components/UI/List/View';

import Light from '../../../components/UI/text/Light';
import Regular from '../../../components/UI/text/Regular';

import Fetch from '../../../interfaces/fetch';

import { queryClient } from '../../../contexts/query-client';


import { useActionSheet } from '@expo/react-native-action-sheet';

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

const Observer = new ActionableItemObserver();

const styled = StyleSheet.create({
  content: {
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 4,
    borderRightColor: colors.removeHint,
  },
  icon: {
    container: {
      minHeight: 44,
      width: 44,
      marginRight: 0,
      alignItems: 'center',
      justifyContent: 'center',
      ...styles.row,
    },
  },
  indexContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 24,
    minWidth: 16,

  },
  index: {
    color: colors.darkText,
    fontSize: 10,
    letterSpacing: 0.1,
  },
  info: {
    ...styles.row,
    paddingRight: 8,
    paddingLeft: 20,
    // marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: colors.lightWhite,
    flex: 1,
  },
  itemDot: {
    marginRight: 10,
    color: colors.theme.text.medium
  },
  title: {
    color: colors.darkText,
    fontSize: 14,
    letterSpacing: 0.1,
  },
});

const ItemTemplate = ({ index, item }) => {

  const onPress = () => {
    Observer.notify(item);
  };
  const remove = async () => {
    await Fetch.remove(`queue/${item.uuid}/`);
    queryClient.setQueryData(['queue'], oldData => oldData.filter(i => i.uuid !== item.uuid));
  };


  const RenderUnderlayLeftActions = () => {
    const { percentOpen } = useSwipeableItemParams();

    const animStyle = useAnimatedStyle(
      () => ({
        opacity: percentOpen.value,
      }),
      [percentOpen]
    );

    return (
      <BaseButton
        style={{
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}

      >
        <Animated.View
          style={animStyle}>
          <View
            style={{
              ...styles.row,
              paddingLeft: 8,
              backgroundColor: colors.remove,
            }}
          >
            <BaseButton onPress={remove}>
              <View style={styled.icon.container}>
                <Icon name='trash' />
              </View>
            </BaseButton>
          </View>
        </Animated.View>
      </BaseButton>
    );
  };

  return (
    <SwipeableItem
      key={item.id}
      item={item}
      renderUnderlayLeft={() => <RenderUnderlayLeftActions />}
      snapPointsLeft={[48]}
      overSwipe={20}
    >
      <Pressable onPress={onPress}>
        <View style={styled.content}>
          <View style={styled.info}>
            <View style={styled.indexContainer}>
              <Light style={styled.index}>{index + 1}</Light>
            </View>
            <Regular style={styled.title}>{item.body}</Regular>
          </View>
        </View>
      </Pressable>
    </SwipeableItem>
  )
};

export default function HomeView() {
  const ActionSheet = useActionSheet();

  useEffect(() => {
    Observer.subscribe((item) => {
      if (item) { chooseAction(item) }
    });
    return () => Observer.unsubscribe
  }, []);


  const options = {
    actions: {
      placeholder: 'Create New Queue Item',

    },
    filters: {
      placeholder: 'Search Queue',
    },
    ItemTemplate,
    noRedirect: true,
    storeKey: ['queue'],
    title: ['Quick Queue']
  };

  function createConvo(item) {
    console.log('create convo', item);
    // send queue id; create convo; create assoc; delete queie id, return convo; redirecrt
  }

  function createList(param) {
    console.log('create List', param);
    // send queue id; create note; create assoc; delete queie id, return note; redirecrt
  }

  function createNote(param) {
    console.log('create note', param);
    // send queue id; create note; create assoc; delete queie id, return note; redirecrt
  }

  async function searchInBrowser(item) {
    const searchUrl = 'https://www.google.com/search?q=';
    const searchTerm = encodeURIComponent(item.body);
    await WebBrowser.openBrowserAsync(searchUrl + searchTerm);

    setTimeout(() => { promptCreateNote(item) }, 1000);
  }

  function chooseAction(item) {
    const options = ['Search Web', 'Start Convo', 'Create Note', 'Add To List', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    const destructiveButtonIndex = null;
    const title = `What would you like to do with: "${item.body}"`;

    const map = {
      0: searchInBrowser,
      1: promptChooseConvo,
      2: promptCreateNote,
      3: promptChooseList,
    };

    ActionSheet.showActionSheetWithOptions({
      cancelButtonIndex,
      destructiveButtonIndex,
      options,
      title,
    }, (selectedIndex) => {
      if (selectedIndex === cancelButtonIndex) {
        Observer.notify(null);
      } else {
        map[selectedIndex](item);
      }

    });
  }

  function promptChooseConvo(item) {
    const options = ['Create New', 'Existing', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    const destructiveButtonIndex = null;
    const title = `Add "${item.body}" to a new or existing convo?`;

    const config = {
      cancelButtonIndex,
      destructiveButtonIndex,
      options,
      title,
    };

    ActionSheet.showActionSheetWithOptions(config, (selectedIndex) => {
      if (selectedIndex !== cancelButtonIndex) {
        if (selectedIndex === 0) {
          createConvo(item);
        } else {
          // convo picker
          console.log('open convo picker');
        }
      }
      else {
        Observer.notify(null);
      }
    });
  }

  function promptCreateNote(item) {
    const options = ['Yes, as the title', 'Yes, in the body', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    const destructiveButtonIndex = null;
    const title = `Would you like to create a Note for "${item.body}"`;

    const config = {
      cancelButtonIndex,
      destructiveButtonIndex,
      options,
      title,
    };

    ActionSheet.showActionSheetWithOptions(config, (selectedIndex) => {
      if (selectedIndex !== cancelButtonIndex) {
        createNote({
          uuid: item.uuid,
          field: selectedIndex === 0 ? 'title' : 'body',
        });
      }
      else {
        Observer.notify(null);
      }
    });
  }

  function promptChooseList(item) {
    const options = ['Create New, as title', 'Create New, as item', 'Existing', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    const destructiveButtonIndex = null;
    const title = `Add "${item.body}" to a new or existing List?`;

    const config = {
      cancelButtonIndex,
      destructiveButtonIndex,
      options,
      title,
    };

    ActionSheet.showActionSheetWithOptions(config, (selectedIndex) => {
      if (selectedIndex !== cancelButtonIndex) {
        if (selectedIndex === 2) {
          console.log('open list picker');
        } else {

          createList({
            uuid: item.uuid,
            field: selectedIndex === 0 ? 'title' : 'item',
          });
          // convo picker
        }
      }
      else {
        Observer.notify(null);
      }
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <ListView options={{ ...options }} />
    </View>
  );
}
