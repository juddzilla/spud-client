import { Dimensions, StyleSheet } from "react-native";
import colors from "../colors";
import styles from "../styles";

export const DetailStyles = StyleSheet.create({
    view: {
        ...styles.View,
        backgroundColor: colors.white,         
        width: Dimensions.get('window').width,               
      },
      content: {
        backgroundColor: colors.white, 
        flex: 1,
      },
      header: {
        ...styles.row, 
        height: 40
      },
      menu: {
        ...styles.row, 
        justifyContent: 'flex-end', 
        flex: 1,
      },
})