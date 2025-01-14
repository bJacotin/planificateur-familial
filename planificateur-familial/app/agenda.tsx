import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    SafeAreaView,
    Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
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
    const [selectedType, setSelectedType] = useState(null);

    const handleAddOrEditTask = () => {
        if (!newTask.name || !newTask.data || !newTask.date || !newTask.time) {
            alert('Veuillez renseigner un nom, une date et une heure pour la tâche.');
            return;
        }

        if (editingTask) {
            const updatedTasks = { ...tasks };
            const taskIndex = updatedTasks[newTask.date]?.findIndex(t => t.id === editingTask.id);
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

    const handleAddOrEditEvent = () => {
      if (!newTask.name || !newTask.date || !newTask.time) {
          alert('Veuillez renseigner un nom, une date et une heure pour l\'événement.');
          return;
      }

      if (editingTask) {
          const updatedTasks = { ...tasks };
          const taskIndex = updatedTasks[newTask.date]?.findIndex(t => t.id === editingTask.id);
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

    const handleAddOrEditAnniversary = () => {
      if (!newTask.name || !newTask.date || !newTask.time) {
          alert('Veuillez renseigner un nom, une date et une heure pour l\'anniversaire');
          return;
      }

      if (editingTask) {
          const updatedTasks = { ...tasks };
          const taskIndex = updatedTasks[newTask.date]?.findIndex(t => t.id === editingTask.id);
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
        const taskIndex = updatedTasks[task.date]?.findIndex(t => t.id === task.id);
        if (taskIndex !== undefined && taskIndex !== -1) {
            updatedTasks[task.date].splice(taskIndex, 1);
            if (updatedTasks[task.date].length === 0) {
                delete updatedTasks[task.date];
            }
            setTasks(updatedTasks);
            setEditingTask(null);
            setModalVisible(false);
        }
        setEditingTask(null);
    };

    const renderAddButton = () => (
      <TouchableOpacity style={styles.addButton} onPress={handleOpenAddTaskModal}>
              <Text style={styles.addButtonText}>Ajouter une tâche</Text>
      </TouchableOpacity>
  );

    const renderTaskColor = (color) => ({ backgroundColor: color || 'lightblue' });


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
            />
        );
    };

    const renderTask = (task) => (
        <View style={[styles.item, renderTaskColor(task.color)]}>
            <View style={styles.taskDetails}>
                <Text style={styles.taskName}>{task.name}</Text>
                <Text style={styles.taskData}>{task.data}</Text>
                <Text style={styles.taskTime}>{task.time}</Text>
            </View>
            <TouchableOpacity onPress={() => handleEditTask(task)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Éditer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(task)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
        </View>
    );

    const renderScreen = () => {
      
        if (currentScreen === 'DayAgenda') {
            return (
              <LinearGradient colors={['#4FE2FF', '#004B5A', '#002C35']} style={styles.gradientBackground}>
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
              </LinearGradient>

            );
        }
        return (
            <SafeAreaView style={styles.container}>
                {renderCalendar()}
                {renderAddButton()}
            </SafeAreaView>
        );
    };

    return (
      <LinearGradient colors={['#4FE2FF', '#004B5A', '#002C35']} style={styles.gradientBackground}>
        <SafeAreaView style={styles.container}>
            {renderScreen()}
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
                       <TouchableOpacity onPress={() => setCalendarVisible(!calendarVisible)} style={styles.datePickerButton}>
    <Text style={styles.datePickerText}>
        {newTask.date ? `Date sélectionnée : ${newTask.date}` : 'Choisir la date'}
    </Text>
</TouchableOpacity>

{calendarVisible && (
    <View style={styles.calendarContainer}>
        <Calendar
            current={newTask.date || moment().format('YYYY-MM-DD')}
            onDayPress={(day) => {
                const selectedDate = day.dateString;
                setNewTask((prev) => ({ ...prev, date: selectedDate }));
                setCalendarVisible(false);
            }}
            monthFormat={'yyyy MM'}
        />
    </View>
)}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleAddOrEditTask}>
                                <Text style={styles.saveButtonText}>
                                    {editingTask ? 'Modifier' : 'Ajouter'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>
                        </View>
                        
                  </View>
                    <TouchableOpacity onPress={handleAddOrEditEvent}>
                      <Text>Événement</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddOrEditTask}>
                      <Text>Tâches</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddOrEditAnniversary}>
                      <Text>Anniversaire</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
      </LinearGradient>

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  gradientBackground: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#36B1CA',
    padding: 20,
    borderRadius: 60,
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#36B1CA',
    borderRadius: 20,
    padding: 30,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dayNumber: {
    fontSize: 50,
    fontWeight: '700',
    color: '#36B1CA',
    marginBottom: 15,
  },
  dayTasksContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#36B1CA',
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  taskSummary: {
    fontSize: 18,
    color: '#36B1CA',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 12,
    backgroundColor: '#4FE2FF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4FE2FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  taskDetails: {
    flex: 1,
    paddingRight: 15,
  },
  taskName: {
    fontWeight: 'bold',
    color: '#004B5A',
    fontSize: 18,
  },
  taskData: {
    color: '#000000',
    fontSize: 16,
  },
  taskTime: {
    color: '#000000',
    fontSize: 14,
  },
  editButton: {
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  editButtonText: {
    color: '#004B5A',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#004B5A',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    maxWidth: 350,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4FE2FF',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#4FE2FF',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    fontSize: 14,
    width: '100%',
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#4FE2FF',
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  datePickerText: {
    color: 'white',
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#4FE2FF',
    borderRadius: 10,
    height: 40,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4FE2FF',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#004B5A',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  noTasksText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
  },
  backButton: {
    padding: 15,
    backgroundColor: '#004B5A',
    borderRadius: 10,
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  
});


