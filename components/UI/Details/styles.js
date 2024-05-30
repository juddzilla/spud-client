import { Dimensions, StyleSheet } from "react-native";
import colors from "../colors";
import styles from "../styles";

export const DetailStyles = StyleSheet.create({
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
    section: {
        borderRadius: 16,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        flex: 1,
        marginHorizontal: 0,
        paddingVertical: 16,
    },
    view: {
        ...styles.View,
        backgroundColor: colors.white,         
        width: Dimensions.get('window').width,               
    },
})