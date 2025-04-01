import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

type Props = {
    title: string;
    isChecked: boolean;
    details: string;
    date: string;
    importance: string;
    onLongPress: () => void;
    onPress: () => void;
    onDelete: () => void; // New prop for handling deletion
};

const Task = ({ title, isChecked: initialChecked, details, date, importance, onLongPress, onPress, onDelete }: Props) => {
    const [isChecked, setIsChecked] = useState(initialChecked);

    const toggleCheck = () => {
        setIsChecked(!isChecked);
        onPress(); // Appel de la fonction onPress passée en prop
    };

    return (
        <TouchableOpacity onLongPress={onLongPress} style={styles.taskContainer}> {/* Use onLongPress for long press actions */}
            <View style={styles.leftContainer}>
                <View style={styles.taskDataContainer}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, isChecked && styles.checkedText]} >{title}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.details,isChecked && styles.checkedText]}>{date}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.details,isChecked && styles.checkedText]}>{details}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.details,isChecked && styles.checkedText, { marginTop: 0 }]}>{importance}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.checkButton,
                        isChecked && styles.checked 
                    ]}
                    onPress={toggleCheck}
                >
                    {isChecked && <View />}
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}> {/* Add a delete button */}
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    leftContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    taskContainer: {
        backgroundColor: '#EBEBEB',
        height: 100,
        width: '100%',
        flexDirection: "row",
        justifyContent: 'space-between',
        elevation: 5,
        marginBottom: 2, // Ajoute un petit espace entre les tâches
    },
    button: {
        height: 20,
        width: 20,
        borderRadius: 14,
        marginLeft: 10,
        marginRight: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    centerButton: {
        backgroundColor: 'white',
        height: 14,
        width: 14,
        borderRadius: 7,
    },
    checkButton: {
        width: 24,
        height: 24,
        marginLeft: 9,
        marginRight: 20,
        borderRadius: 5,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderColor: "#3D3D3D",
        borderWidth: 3,
        opacity: 0.75,
    },
    checked: {
        backgroundColor: "#3D3D3D", 
        opacity: 0.1,
    },
    checkedText: {
        opacity: 0.2,
        textDecorationLine: "line-through",
    },
    title: {
        marginLeft: 20,
        fontFamily: "Poppins_SemiBold",
        fontSize: 24,
        textAlign: "left",
        maxWidth: '90%',
    },
    details: {
        marginLeft: 20,
        fontFamily: "Poppins_Regular",
        fontSize: 14,
        textAlign: "left",
        color: "grey",
        marginTop: -8,
    },
    taskDataContainer: {
        alignItems: "flex-start",
    },
    deleteButton: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Task;