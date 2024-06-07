import { View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import Icon from '../../components/UI/icons';

export default function DrawerLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Drawer
        backBehavior="history"
        screenOptions={{
          drawerStyle: {
            // backgroundColor: 'green',
            // below four properties will remove the shadow
            borderBottomColor: "transparent",
            shadowColor: 'transparent',
            borderBottomWidth: 0,
            elevation: 0
          },
          headerShown: false
        }}
      >
        <Drawer.Screen
          name="home"
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
          listeners={{
            drawerItemPress: (e) => {
              // Prevent default action
              console.log('list drawerItemPress');
              // e.preventDefault();
            },
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