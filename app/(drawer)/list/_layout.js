import { Stack } from "expo-router";
import colors from "../../../components/UI/colors";

export default function ListLayout() {
  return (
    <Stack 
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.theme.backgroundColor,
        }
      }}
    />
  );
}