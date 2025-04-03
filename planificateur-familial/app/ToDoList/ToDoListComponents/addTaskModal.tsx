import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createTodoListItem } from "@/app/ToDoList/ToDoListController";
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddTaskModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    listId: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ modalVisible, setModalVisible, listId }) => {
    const [taskName, setTaskName] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleCreateTask = async () => {
        if (!taskName.trim()) {
            alert("Veuillez entrer un nom pour la tâche");
            return;
        }

        try {
            const newTask = { // Créez explicitement l'objet task
                name: taskName,
                dueDate: dueDate?.toISOString(),
                checked: false
            };

            await createTodoListItem(listId, newTask);
            setTaskName("");
            setDueDate(undefined);
            setModalVisible(false);
        } catch (error) {
            console.error("Erreur création tâche:", error);
            alert("Erreur lors de la création de la tâche");
        }
    };

    return (
        <Modal
            statusBarTranslucent={true}
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalView}
                    >
                        <TextInput 
                            placeholder="Nom de la tâche"
                            style={styles.titleInput}
                            value={taskName}
                            onChangeText={setTaskName}
                        />
                        
                        <TouchableOpacity 
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateButtonText}>
                                {dueDate ? dueDate.toLocaleDateString() : "Définir une date d'échéance"}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={dueDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        setDueDate(selectedDate);
                                    }
                                }}
                            />
                        )}

                        <LinearGradient
                            colors={['#4FE2FF', '#004B5A', '#002C35']}
                            locations={[0, 0.8, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradient}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={styles.confirmContainer} 
                                onPress={handleCreateTask}
                            >
                                <Text style={styles.confirmText}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalView: {
        justifyContent: "space-around",
        backgroundColor: 'white',
        paddingTop: 15,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        elevation: 5,
    },
    titleInput: {
        width: '100%',
        fontFamily: "Poppins_SemiBold",
        fontSize: 28,
        paddingHorizontal: 30,
    },
    dateButton: {
        padding: 15,
        marginHorizontal: 30,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#004B5A',
        borderRadius: 10,
    },
    dateButtonText: {
        fontFamily: "Poppins_Medium",
        color: '#004B5A',
        textAlign: 'center',
    },
    gradient: {
        width: '100%', 
        height: 10
    },
    confirmContainer: {
        borderColor: '#004B5A',
        backgroundColor: '#004B5A',
        height: 50,
        marginHorizontal: 30,
        marginVertical: 15,
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 4,
    },
    confirmText: {
        color: '#ffffff',
        fontFamily: "Poppins_Medium",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
    }
});

export default AddTaskModal;