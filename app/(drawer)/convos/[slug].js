// convo list of q's and a's
// ability to click on older bit of convo to use as context
// ability to summarize entire convo
// archive
// delete
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import DrawerScreen from '../../../components/DrawerScreen';


export default function Page() {
  const [message, setMessage] = useState(null);
  const glob = useGlobalSearchParams();
const local = useLocalSearchParams();

console.log("Local:", local, "Global:", glob.user);

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});


function onChange() {}

  return (
    <View style={{flex: 1}}>
      {DrawerScreen('Convorp')}
      <View style={{flex: 1}}>
        <Text>Here</Text>
        <Text>Here</Text>
        <Text>Here</Text>
        <Text>Here</Text>
      </View>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={onChange}
          value={message}
          placeholder="type here"
        />
      </View>
    </View>
  )
}