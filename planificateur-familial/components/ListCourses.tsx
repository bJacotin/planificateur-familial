import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { RelativePathString, useRouter } from 'expo-router';


type Props = {
    title: string;
    route: string;
    id:string
    itemsCount?: number;
};

const homeShoppingList = ({ title, route, id , itemsCount = 0}: Props) => {
    const router = useRouter();
    const handlePress = () => {
        router.push(route as RelativePathString );
        console.log(id)
    };

    return (
        <TouchableOpacity style={styles.shopppingContainer} onPress={handlePress}>
            <View style={styles.rowContainer}>
                <View style={styles.leftContainer}>
                    <View style={styles.taskDataContainer}>
                        <Text numberOfLines={1} style={styles.title}>{title}</Text>
                        <Text numberOfLines={1} style={styles.details}>{itemsCount} éléments</Text>
                    </View>
                </View>
                <Image source={require('@/assets/images/arrowLeft.png')} style={{width: 50, height: 50}}/>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    shopppingContainer: {
        backgroundColor: '#3FC3DD',
        opacity: 1.0,
        width: '100%',
        alignSelf: 'center',
        height: 60,
        borderRadius: 20,
        elevation: 5,
        paddingHorizontal: 16,
        marginBottom: 15,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Sépare les éléments gauche et droit
        height: "100%",
        width: "100%",
    },
    leftContainer: {
        maxWidth: '85%', // Limite la largeur pour éviter un chevauchement avec le bouton
    },
    checkButton: {
        width: 24,
        height: 24,
        borderRadius: 5,
    },
    title: {
        fontFamily: "Poppins_Bold",
        fontSize: 20,
        color: "white",
        textAlign: "left",
        top: 10,
    },
    details: {
        fontFamily: "Poppins_Regular",
        fontSize: 12,
        paddingLeft: 5,
        width: 100,
        color: "#3FC3DD",
        backgroundColor: "white",
    },
    taskDataContainer: {
        justifyContent: "center",
        flexDirection: "column",
    },
});

export default homeShoppingList;
