import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    SafeAreaView,
    Modal,
    Picker,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const initialTasks = {};

export default function App() {
    const [tasks, setTasks] = useState(initialTasks);
    const [currentScreen, setCurrentScreen] = useState('Home');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newTask, setNewTask] = useState({ name: '', data: '', date: '', color: '', time: '' });
    const [selectedColor, setSelectedColor] = useState('');
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const handleAddOrEditTask = () => {
        if (!newTask.name || !newTask.date || !newTask.time) {
            alert('Veuillez renseigner un nom, une date et une heure pour la tâche.');
            return;
        }

        if (editingTask) {
            const updatedTasks = { ...tasks };
            const taskIndex = updatedTasks[newTask.date].findIndex(t => t.id === editingTask.id);
            if (taskIndex !== -1) {
                updatedTasks[newTask.date][taskIndex] = { ...newTask, color: selectedColor };
                setTasks(updatedTasks);
            }
        } else {
            setTasks((prevTasks) => ({
                ...prevTasks,
                [newTask.date]: [
                    ...(prevTasks[newTask.date] || []),
                    { id: Date.now().toString(), ...newTask, color: selectedColor },
                ],
            }));
        }

        setNewTask({ name: '', data: '', date: '', color: '', time: '' });
        setEditingTask(null);
        setModalVisible(false);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setCurrentScreen('DayAgenda');
    };

    const showCalendar = () => setCalendarVisible(true);
    const hideCalendar = () => setCalendarVisible(false);

    const handleConfirmDate = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        setNewTask((prev) => ({ ...prev, date: formattedDate }));
        hideCalendar();
    };

    const handleOpenAddTaskModal = () => {
        setEditingTask(null);
        setModalVisible(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setNewTask({ name: task.name, data: task.data, date: task.date, time: task.time });
        setSelectedColor(task.color);
        setModalVisible(true);
    };

    const handleDeleteTask = (task) => {
        const updatedTasks = { ...tasks };
        const taskIndex = updatedTasks[task.date].findIndex(t => t.id === task.id);
        updatedTasks[task.date].splice(taskIndex, 1);

        if (updatedTasks[task.date].length === 0) {
            delete updatedTasks[task.date];
        }

        setTasks(updatedTasks);
        setEditingTask(null);
    };

    const renderAddButton = () => (
        <TouchableOpacity style={styles.addButton} onPress={handleOpenAddTaskModal}>
            <Text style={styles.addButtonText}>Ajouter une tâche</Text>
        </TouchableOpacity>
    );

    const renderTaskColor = (color) => {
        return { backgroundColor: color || 'lightblue' };
    };

    const renderCalendar = () => {
        const markedDates = Object.keys(tasks).reduce((acc, date) => {
            const taskCount = tasks[date].length;
            acc[date] = {
                marked: true,
                dotColor: taskCount > 2 ? 'red' : 'blue',
                selectedColor: '#007BFF',
            };
            return acc;
        }, {});

        return (
            <Calendar
                current={selectedDate || moment().format('YYYY-MM-DD')}
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    setCurrentScreen('DayAgenda');
                }}
                monthFormat={'yyyy MM'}
                markedDates={markedDates}
                renderDay={(day, item) => {
                    const taskForDay = tasks[day.dateString] || [];
                    return (
                        <View style={styles.dayContainer}>
                            <Text style={styles.dayNumber}>{day.day}</Text>
                            <View style={styles.dayTasksContainer}>
                                {taskForDay.slice(0, 2).map((task, index) => (
                                    <TouchableOpacity key={task.id} onPress={() => handleEditTask(task)}>
                                        <Text
                                            style={[styles.taskSummary, { color: task.color || '#333' }]}
                                        >
                                            {task.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                {taskForDay.length > 2 && (
                                    <Text style={styles.taskSummary}>+{taskForDay.length - 2} autres tâches</Text>
                                )}
                            </View>
                        </View>
                    );
                }}
            />
        );
    };

    const renderTask = (task) => {
        return (
            <View style={[styles.item, renderTaskColor(task.color)]}>
                <View style={styles.taskDetails}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text style={styles.taskData}>{task.data}</Text>
                    <Text style={styles.taskTime}>{task.time}</Text>
                </View>
                <TouchableOpacity onPress={() => handleEditTask(task)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Éditer</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (currentScreen === 'Home') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    {renderCalendar()}
                </View>
                {renderAddButton()}

                <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeader}>
                                {editingTask ? 'Modifier la Tâche' : 'Nouvelle Tâche'}
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nom de la tâche"
                                value={newTask.name}
                                onChangeText={(text) => setNewTask({ ...newTask, name: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Description"
                                value={newTask.data}
                                onChangeText={(text) => setNewTask({ ...newTask, data: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Heure (ex: 14:00)"
                                value={newTask.time}
                                onChangeText={(text) => setNewTask({ ...newTask, time: text })}
                            />

                            <TouchableOpacity onPress={showCalendar} style={styles.datePickerButton}>
                                <Text style={styles.datePickerText}>
                                    {newTask.date ? `Date sélectionnée : ${newTask.date}` : 'Choisir la date'}
                                </Text>
                            </TouchableOpacity>

                            {calendarVisible && (
                                <View style={styles.calendarContainer}>
                                    <Calendar
                                        current={newTask.date || moment().format('YYYY-MM-DD')}
                                        onDayPress={(day) => handleConfirmDate(day.dateString)}
                                        monthFormat={'yyyy MM'}
                                    />
                                </View>
                            )}

                            <Text style={styles.colorText}>Choisir la couleur de la tâche :</Text>
                            <Picker
                                selectedValue={selectedColor}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSelectedColor(itemValue)}>
                                <Picker.Item label="Urgent (Rouge)" value="#FF6347" />
                                <Picker.Item label="Important (Vert)" value="#32CD32" />
                                <Picker.Item label="Normal (Bleu)" value="#1E90FF" />
                            </Picker>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleAddOrEditTask}>
                                    <Text style={styles.saveButtonText}>
                                        {editingTask ? 'Modifier' : 'Ajouter'}
                                    </Text>
                                </TouchableOpacity>
                                {editingTask && (
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteTask(editingTask)}>
                                        <Text style={styles.deleteButtonText}>Supprimer</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Annuler</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    } else if (currentScreen === 'DayAgenda') {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={() => setCurrentScreen('Home')} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Retour</Text>
                </TouchableOpacity>
                <Text style={styles.header}>Agenda du {selectedDate}</Text>
                <FlatList
                    data={tasks[selectedDate] || []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderTask(item)}
                    ListEmptyComponent={<Text style={styles.noTasksText}>Aucune tâche pour ce jour.</Text>}
                />
                {renderAddButton()}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerContainer: {
        marginBottom: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 50,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 24,
    },
    dayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dayTasksContainer: {
        marginTop: 5,
    },
    taskSummary: {
        fontSize: 14,
        color: 'white',
        marginBottom: 5,
    },
    item: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    taskDetails: {
        flex: 1,
    },
    taskName: {
        fontWeight: 'bold',
    },
    taskData: {
        color: '#666',
    },
    taskTime: {
        color: '#666',
    },
    editButton: {
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    editButtonText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    datePickerButton: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    datePickerText: {
        color: 'white',
    },
    picker: {
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 5,
    },
    saveButtonText: {
        color: 'white',
    },
    deleteButtonText: {
        color: 'white',
    },
    cancelButtonText: {
        color: 'white',
    },
    noTasksText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
    backButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginBottom: 10,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
