import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { RelativePathString, useRouter } from 'expo-router';

type Props = {
    title: string;
    categoriesNumber: number;
    color: string;
    route: string;
};

const homeToDo = ({ title, categoriesNumber, color, route }: Props) => {
    const router = useRouter();
    const handlePress = () => {
        router.push(route as RelativePathString);
    };

    return (
        <TouchableOpacity style={styles.taskContainer} onPress={handlePress}>
            <View style={styles.rowContainer}>
                <View style={styles.leftContainer}>
                    <View style={styles.taskDataContainer}>
                        <Text numberOfLines={1} style={styles.title}>{title}</Text>
                        <Text numberOfLines={1} style={styles.details}>{categoriesNumber} tâches</Text>
                    </View>
                </View>
                <View
                    style={[styles.checkButton, { backgroundColor: color }]}
                >
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        alignSelf: 'center',
        height: 80,
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
        fontSize: 24,
        color: "#3D3D3D",
        textAlign: "left",
        top: 10,
    },
    details: {
        fontFamily: "Poppins_Regular",
        fontSize: 16,
        color: "#3D3D3D",
        opacity: 0.5,
    },
    taskDataContainer: {
        justifyContent: "center",
        flexDirection: "column",
    },
});

export default homeToDo;
