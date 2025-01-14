import React from 'react'
import {StyleSheet, View, Image, ImageSourcePropType} from "react-native";

type Props = {
    image: ImageSourcePropType;

};

export const ProfilePicture = ({image}: Props) => {
    return (
        <View style={styles.container}>
            <Image 
                style={styles.image} 
                source={image} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 70,
        height: 70,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: 'white',
        borderColor: 'white',
        justifyContent: 'center',
    },
    image: {
        width: '89%',
        height: '89%',
        borderRadius:1000,
        alignSelf: 'center',
    }
})