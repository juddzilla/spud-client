import { View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import Icon from '../../components/UI/icons';
import Home from './home';
import Lists from './lists/_layout';

export default function DrawerLayout() {
  return (    
    <View style={{flex: 1}}>

        <Drawer
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
            name="convos"
            options={{
              drawerIcon: () => <Icon name='convo' />,
              drawerLabel: "Convos",
              title: "Cornvors",
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