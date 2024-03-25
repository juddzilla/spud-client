import { Stack } from "expo-router";
import colors from "../../../components/UI/colors";

export default function CollectionsLayout() {
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