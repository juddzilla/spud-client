import { Stack } from "expo-router";
import { screenOptions } from "../../../components/UI/View/screen";

export default function ListsLayout() {
  return (
    <Stack screenOptions={screenOptions} />
  );
}