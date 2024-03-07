import { StyleSheet, Text, View } from 'react-native';

export default function ViewContainer(props) {
    const styles = StyleSheet.create({
        container: {
            alignItems: "flex-start",
            flex: 1,
            justifyContent: "flex-start",
            padding: 8,
        },
      });

      return (
        <>
            <View style={styles.container}>
                { props.children }
            </View>
        </>
    )
}