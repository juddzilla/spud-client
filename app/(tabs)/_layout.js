import { Tabs } from 'expo-router';
import { View } from 'react-native';
import Icon from '../../components/UI/icons';

export default function TabLayout() {
    return (
        <View style={{ backgroundColor: 'red', flex: 1 }}>
            <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
                {/* <Tabs.Screen
                    name="history"
                    options={{
                        headerShown: false,
                        title: 'History',
                        tabBarIcon: ({ color }) => <Icon size={28} name="history" color={color} />,
                    }}
                /> */}
                <Tabs.Screen
                    name="organization"
                    options={{
                        headerShown: false,
                        title: 'Stuff',
                        tabBarIcon: ({ color }) => <Icon size={28} name="layers" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="in"
                    options={{
                        headerShown: false,
                        title: 'In',
                        tabBarIcon: ({ color }) => <Icon size={28} name="down" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="out"
                    options={{
                        headerShown: false,
                        title: 'Out',
                        tabBarIcon: ({ color }) => <Icon size={28} name="up" color={color} />,
                    }}
                />
            </Tabs>
        </View>
    );
}
