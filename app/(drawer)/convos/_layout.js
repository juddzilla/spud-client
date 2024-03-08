import { View } from 'react-native';
import { Stack } from "expo-router";

const bg = '#f1f5f9';

export default function HomeLayout() {
  return (
    <Stack 
      screenOptions={{
        headerStyle: {
          backgroundColor: bg,
        },
        contentStyle: {
          backgroundColor: bg
        }
      }} />
  );
}