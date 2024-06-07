import { Stack } from "expo-router";
import { screenOptions } from "../../../components/UI/View/screen";

export default function ConvosLayout() {
  return (
    <Stack screenOptions={screenOptions} />
  );
}