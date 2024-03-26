import { Stack } from "expo-router";
import colors from "../../../components/UI/colors";

export default function HomeLayout() {  
  return (
    <Stack 
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.theme.backgroundColor,
          // height: '100%',
          // flex: 1,
        }
      }}
    />
  );
}