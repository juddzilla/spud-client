import { Stack } from "expo-router";
import { screenOptions } from "../../../components/UI/View/screen";

export default function NotesLayout() {
  return (
    <Stack screenOptions={screenOptions} />
  );
}