import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TodoListItem } from '../ToDoListTypes/ToDoListsTypes';

interface TaskCardProps {
    task: TodoListItem;
    listId: string;
    onToggle: () => void;
    onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
    const handleLongPress = () => {
        Alert.alert(
            "Supprimer la tâche",
            `Voulez-vous vraiment supprimer "${task.name}" ?`,
            [
                { text: "Annuler", style: "cancel" },
                { text: "Supprimer", onPress: onDelete }
            ]
        );
    };

    return (
        <TouchableOpacity
            style={[styles.card, task.checked && styles.checkedCard]}
            onPress={onToggle}
            onLongPress={handleLongPress}
            delayLongPress={500}
        >
            <View style={styles.radioButton}>
                {task.checked && <View style={styles.radioButtonChecked} />}
            </View>
            
            <Text style={[styles.taskText, task.checked && styles.checkedText]}>
                {task.name}
            </Text>
            
            {task.dueDate && (
                <Text style={styles.dueDate}>
                    {new Date(task.dueDate).toLocaleDateString()}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2
    },
    checkedCard: {
        backgroundColor: '#F0F0F0'
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#004B5A',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    radioButtonChecked: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#004B5A'
    },
    taskText: {
        flex: 1,
        fontFamily: 'Poppins_Medium',
        fontSize: 16,
        color: '#004B5A'
    },
    checkedText: {
        textDecorationLine: 'line-through',
        color: '#888'
    },
    dueDate: {
        fontFamily: 'Poppins_Regular',
        fontSize: 12,
        color: '#666',
        marginLeft: 10
    }
});

export default TaskCard;