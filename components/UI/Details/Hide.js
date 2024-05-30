import { useContext, useEffect, useRef, } from 'react';
import { Animated, Dimensions, } from 'react-native';
import { DetailStyles } from './styles';
import { CollectionsContext } from '../../../contexts/collections';

export default function Hide(props) {
    const { showCollections, setShowCollections } = useContext(CollectionsContext);
    const windowWidth = Dimensions.get('window').width;

    const translateAnim = useRef(new Animated.Value(windowWidth)).current;
    const backgroundColorAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const backgroundColor = backgroundColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["green", 'red' ],//"rgb(247,247,247)",
        extrapolate: "clamp"
      })

    // const to = () => {    
    //   Animated.timing(hideAnim, {
    //     toValue: -(windowWidth),
    //     duration: 180,
    //     useNativeDriver: true,
    //   }).start();
    // };

    const to = () => {    
        Animated.parallel([
            // Animated.timing(translateAnim, {
            //     toValue: -(windowWidth),
            //     duration: 180,
            //     useNativeDriver: true,
            // }).start(),
            Animated.timing(backgroundColorAnim, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }).start(),
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 300,
                useNativeDriver: true,
            }).start(),            
        ])
      };

    const from = () => {    
        Animated.parallel([
            // Animated.timing(translateAnim, {
            //   toValue: 0,
            //   duration: 300,
            //   useNativeDriver: true,
            // }).start(),
            Animated.timing(backgroundColorAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(),
        ])
    };

    useEffect(() => {
      const op = showCollections ? to : from;
      op();
    }, [showCollections]);

    return (
        <Animated.View style={[
            DetailStyles.section,
            { backgroundColor },
            { transform: [
                {scale: scaleAnim},
                {translateX: translateAnim}
            ] },
        ]}>    
            { props.children}
         </Animated.View>
    )
}