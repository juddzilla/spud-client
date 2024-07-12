import { View, SafeAreaView, Text } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import Icon from '../../components/UI/icons';

export default function DrawerLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: 'purple' }}>
      <Drawer
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,

          // drawerStyle: {
          //   backgroundColor: 'yellow',
          // },
          // drawerLabelStyle: {
          //   color: 'green'
          // }
        }}
        drawerContent={(props) => {
          console.log('props', props);
          return (<View><Text>Judd</Text></View>)
        }}
      >
        <Drawer.Screen
          name="queue"
          options={{
            drawerIcon: () => <Icon name='home' />,
            drawerLabel: "Home",
          }}
        />
        <Drawer.Screen
          name="lists"
          options={{
            drawerIcon: () => <Icon name='list' />,
            drawerLabel: "Lists",
          }}
        />

        <Drawer.Screen
          name="convos"
          options={{
            drawerIcon: () => <Icon name='convo' />,
            drawerLabel: "Convos",
            title: "Convos",
          }}
        />

        <Drawer.Screen
          name="notes"
          options={{
            drawerIcon: () => <Icon name='notes' />,
            drawerLabel: "Notes",
            title: "Collections",
          }}
        />


        <Drawer.Screen
          name="collections"
          options={{
            drawerIcon: () => <Icon name='collection' />,
            drawerLabel: "Collections",
            title: "T",
          }}
        />
        <Drawer.Screen
          name="account"
          options={{
            drawerIcon: () => <Icon name='trash' />,
            drawerLabel: "Account",
            title: "Account",
          }}
        />

      </Drawer>
      {/* <View >

            <Black>Logout</Black>
          </View> */}
    </View>
    // </GestureHandlerRootView>

  );
}