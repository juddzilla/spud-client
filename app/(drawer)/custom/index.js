import { View, SafeAreaView, Text } from 'react-native';
import CustomHeader from '../../../components/UI/Custom/Header';
import ViewHeading from '../../../components/UI/Custom/ViewHeading';
import CustomContent from '../../../components/UI/Custom/Content';
export default function CustomRouting() {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CustomHeader />
            <ViewHeading />
            <CustomContent />
        </SafeAreaView>
    )
}