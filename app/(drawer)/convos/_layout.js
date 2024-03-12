import { View } from 'react-native';
import { Stack } from "expo-router";
import colors from '../../../components/UI/colors';

export default function HomeLayout() {
  return (
    <Stack 
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.lightBg,
        }
      }}
    />
  );
}