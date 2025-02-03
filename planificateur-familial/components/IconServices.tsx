import React from 'react'
import {StyleSheet, View, Image, ImageSourcePropType, Text, TouchableOpacity, Dimensions} from "react-native";
import {RelativePathString, router, useRouter} from "expo-router";
import {white} from "react-native-paper/lib/typescript/styles/themes/v2/colors";

type Props = {
    image: ImageSourcePropType;
    title: string;
    route: string;
    id: string;

};

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
export const IconServices = ({image, title, route}: Props) => {
    const router = useRouter();
    const handlePress = () => {
        router.push(route as RelativePathString);
    };
    return (

        <TouchableOpacity onPress={handlePress} style={styles.mainContainer}>
            <Text style={styles.title}>{title}</Text>
                <Image
                    style={styles.image}
                    source={image} />

        </TouchableOpacity>



    );
};

const styles = StyleSheet.create({

    mainContainer: {

        borderRadius:20,
        width:ScreenWidth*0.35,
        height:ScreenHeight*0.1,

        elevation:8,
        backgroundColor:"white",
        marginVertical:10
    },

    image: {
        position:"absolute",
        width: ScreenWidth*0.07,
        height: ScreenWidth*0.07,
        bottom:10,
        right:14

    },
    title: {
        position:"absolute",
        fontSize: 18,
        fontFamily: 'Poppins_Medium',
        color: '#004B5AFF',
        top:5,
        left:10,
    }
})