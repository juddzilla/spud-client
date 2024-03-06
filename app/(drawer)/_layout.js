import { View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

console.log('Drawer', Drawer);
export default function DrawerLayout() {
  return (    
    // <View><Text>Juddd</Text></View>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{ headerShown: false}}
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
      </Drawer>
    </GestureHandlerRootView>
  );
}