import { Stack } from "expo-router";
import colors from "../../../components/UI/colors";

export default function NoteLayout() {
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