import { View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import Icon from '../../components/UI/icons';
import Home from './home';
import Lists from './lists/_layout';

export default function DrawerLayout() {
  return (    
    <View style={{flex: 1}}>

        <Drawer
          backBehavior="history"
          screenOptions={{
            drawerStyle: {              
              // backgroundColor: 'green',
            },
            headerShown: false
          }}      
        >
          <Drawer.Screen
            name="home"
            options={{
              drawerIcon: () => <Icon name='home' />,
              drawerLabel: "Home",
              title: "Home",
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
            name="list"
            options={{
              drawerIcon: () => <Icon name='list' />,
              drawerLabel: "List", 
              drawerItemStyle: { height: 0 }
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
            name="convo"
            options={{
              drawerIcon: () => <Icon name='convo' />,
              drawerLabel: "Convo",
              title: "Convo",
              drawerItemStyle: { height: 0 }
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
            name="note"
            options={{
              drawerIcon: () => <Icon name='list' />,
              drawerLabel: "List", 
              drawerItemStyle: { height: 0 }
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