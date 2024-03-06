import { Redirect } from 'expo-router';

export default function OnLoad() {
  return <Redirect href={"/(drawer)/home"} />;
}