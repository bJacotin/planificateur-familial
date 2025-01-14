import React from 'react'
import {StyleSheet, View, Image, ImageSourcePropType, Text} from "react-native";

type Props = {
    image: ImageSourcePropType;
    isLocal?: boolean; // Indique si l'image est locale
    title: string;
};

export const IconServices = ({image, isLocal = true, title}: Props) => {
    return (
        <>
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={image} />
            </View>
            <Text style={styles.title}>{title}</Text>
        </View>
        </>


    );
};

const styles = StyleSheet.create({

    mainContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: 70,
        height: 70,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#4FE2FF',
        justifyContent: 'center',
        opacity: 0.4,
        elevation: 10,
        margin: 10,
        flexDirection: 'column',
    },
    image: {
        width: '70%',
        height: '70%',
        borderRadius:0,
        alignSelf: 'center',
      
    },
    title: {
        fontSize: 12,
        fontFamily: 'Poppins_Medium',
        color: 'black',
        alignSelf: 'center',
        marginBottom: 10,
    }
})