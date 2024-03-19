import { View } from 'react-native';
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (    
    <View style={{flex: 1}}>

        <Drawer
          screenOptions={{ headerShown: false }}      
        >
          <Drawer.Screen
            name="home"
            options={{
              drawerLabel: "Home",
              title: "Home",
            }}          
          />
          <Drawer.Screen
            name="lists"
            options={{
              drawerLabel: "Lists",
              title: "Listss",
            }}
          />
          <Drawer.Screen
            name="convos"
            options={{
              drawerLabel: "Cosnvos",
              title: "Cornvors",
            }}
          />
          <Drawer.Screen
            name="notes"
            options={{
              drawerLabel: "Notes",
              title: "Collections",
            }}
          />
          <Drawer.Screen
            name="talk"
            options={{
              drawerLabel: "Talssks",
              title: "T",
            }}
          />
          <Drawer.Screen
            name="collections"
            options={{
              drawerLabel: "Collections",
              title: "T",
            }}
          />
        </Drawer>
    </View>
      // </GestureHandlerRootView>
    
  );
}