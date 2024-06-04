import {
  useEffect
} from 'react';
import { router } from 'expo-router'
import { Drawer } from 'expo-router/drawer';
import { useLocalSearchParams, useNavigation, useSegments } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import Icon from './UI/icons';
import colors from './UI/colors';

export default function DrawerScreen(props) {
  const { headerRight, title } = props;
  const navigation = useNavigation();

  const local = useLocalSearchParams();

  function canGoBack() {
    return router.back && router.canGoBack();
  }
  function goBack() {

    router.setParams({ title: null, uuid: null });
  }

  function toggleMenu() {
    navigation.openDrawer();
  }

  return (
    <Drawer.Screen
      options={{
        title,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.brand, //'transparent',
          // height: 100,
          borderBottomColor: 'transparent',
          borderBottomWidth: 0,
          shadowColor: 'transparent',
          shadowOpacity: 0,
          shadowOffset: { height: 0, width: 0 }
        },
        headerLeft: () => {
          if (!canGoBack()) {
            return (
              <TouchableOpacity onPress={toggleMenu}>
                <Icon name="navicon" />
              </TouchableOpacity>
            )
          }
          return (
            <TouchableOpacity onPress={goBack}>
              <Icon name="leftArrowLong" />
            </TouchableOpacity>
          )
        },
        headerRight: headerRight || null,
      }}
    />
  )
}