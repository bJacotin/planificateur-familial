import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    SafeAreaView,
    Modal,
    Platform,
    StatusBar
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '@/FirebaseConfig';
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';



interface Task {
  id: string;
  name: string;
  description: string;
  dateTime: {
      seconds: number;
      nanoseconds: number;
  } | Timestamp;  
  completed: boolean;
  createdAt: {
      seconds: number;
      nanoseconds: number;
  } | Timestamp;
}

const AgendaScreen = () => {
    const [tasks, setTasks] = useState<Record<string, Task[]>>({});
    const [currentScreen, setCurrentScreen] = useState('Home');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        date: '',
        time: ''
    });
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                fetchTasks();
            }
        });
        return () => unsubscribe();
    }, []);

    const convertToDate = (timestamp: any) => {
      if (timestamp?.toDate) {
          return timestamp.toDate();
      } else if (timestamp?.seconds) {
          return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
      }
      return new Date(); // Fallback
  };

    const fetchTasks = async () => {
    try {
        const querySnapshot = await getDocs(collection(FIREBASE_FIRESTORE, "tasks"));
        const tasksData: Record<string, Task[]> = {};

        querySnapshot.forEach((doc) => {
            const taskData = doc.data();
            const task = {
                ...taskData,
                id: doc.id
            } as Task;

            if (!task.dateTime) {
                console.warn("Task missing dateTime:", task);
                return;
            }

            const taskDate = moment(convertToDate(task.dateTime)).format('YYYY-MM-DD');

            if (!tasksData[taskDate]) {
                tasksData[taskDate] = [];
            }
            tasksData[taskDate].push(task);
        });

        setTasks(tasksData);
    } catch (error) {
        console.error("Erreur lors de la récupération des tâches:", error);
    }
};
    

  

  const saveTaskToFirebase = async (taskData: Partial<Task>) => {
    try {
        const tasksCollection = collection(FIREBASE_FIRESTORE, "tasks");
        const dateTime = moment(`${newTask.date} ${newTask.time}`).toDate();
        
        const taskDoc = {
            name: newTask.name,
            description: newTask.description,
            dateTime: Timestamp.fromDate(dateTime),
            completed: false,
            createdAt: Timestamp.now()
        };

        if (editingTask && editingTask.id) {
            await updateDoc(doc(tasksCollection, editingTask.id), taskDoc);
        } else {
            const newDocRef = doc(tasksCollection);
            await setDoc(newDocRef, {
                ...taskDoc,
                id: newDocRef.id
            });
        }

        fetchTasks();
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de la tâche:", error);
    }
};

    const deleteTaskFromFirebase = async (taskId: string) => {
        try {
            await deleteDoc(doc(FIREBASE_FIRESTORE, "tasks", taskId));
            fetchTasks();
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche:", error);
        }
    };

    const handleAddOrEditTask = async () => {
      if (!newTask.name || !newTask.date || !newTask.time) {
          alert('Veuillez renseigner un nom, une date et une heure pour la tâche.');
          return;
      }

      await saveTaskToFirebase(newTask);

      setNewTask({ name: '', description: '', date: '', time: '' });
      setEditingTask(null);
      setModalVisible(false);
  };
  

    const handleDateSelect = (date: any) => {
        const formattedDate = moment(date.dateString).format('YYYY-MM-DD');
        setSelectedDate(formattedDate);
        setCurrentScreen('DayAgenda');
    };

    const handleOpenAddTaskModal = () => {
        setEditingTask(null);
        setNewTask({ name: '', description: '', date: '', time: '' });
        setModalVisible(true);
    };

    const handleEditTask = (task: Task) => {
      const taskDate = convertToDate(task.dateTime);
      
      setEditingTask(task);
      setNewTask({
          name: task.name,
          description: task.description,
          date: moment(taskDate).format('YYYY-MM-DD'),
          time: moment(taskDate).format('HH:mm')
      });
      setModalVisible(true);
  };
  

    const handleDeleteTask = async (task: Task) => {
        if (task.id) {
            await deleteTaskFromFirebase(task.id);
        }
        setEditingTask(null);
    };

    const renderAddButton = () => (
        <TouchableOpacity style={styles.addButton} onPress={handleOpenAddTaskModal}>
            <Text style={styles.addButtonText}>Ajouter une tâche</Text>
        </TouchableOpacity>
    );

    const renderCalendar = () => {
        const markedDates = Object.keys(tasks).reduce((acc, date) => {
            acc[date] = {
                marked: true,
                dotColor: '#4FE2FF',
                selectedColor: '#36B1CA',
            };
            return acc;
        }, {} as Record<string, any>);

        return (
            <Calendar
                current={selectedDate || moment().format('YYYY-MM-DD')}
                onDayPress={handleDateSelect}
                monthFormat={'yyyy MM'}
                markedDates={markedDates}
                theme={{
                    backgroundColor: '#002C35',
                    calendarBackground: '#002C35',
                    textSectionTitleColor: '#4FE2FF',
                    selectedDayBackgroundColor: '#36B1CA',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#4FE2FF',
                    dayTextColor: '#ffffff',
                    textDisabledColor: '#004B5A',
                    arrowColor: '#4FE2FF',
                    monthTextColor: '#4FE2FF',
                    indicatorColor: '#4FE2FF',
                }}
            />
        );
    };

    const renderTask = ({ item }: { item: Task }) => {
      const taskDate = convertToDate(item.dateTime);
      
      return (
          <View style={[styles.item, { backgroundColor: item.completed ? '#004B5A' : '#36B1CA' }]}>
              <View style={styles.taskDetails}>
                  <Text style={styles.taskName}>{item.name}</Text>
                  <Text style={styles.taskData}>{item.description}</Text>
                  <Text style={styles.taskTime}>
                      {moment(taskDate).format('HH:mm')}
                  </Text>
                  <Text style={styles.taskDate}>
                      {moment(taskDate).format('DD/MM/YYYY')}
                  </Text>
                  <Text style={styles.taskStatus}>
                      {item.completed ? 'Terminée' : 'En cours'}
                  </Text>
              </View>
              
              <View style={styles.taskActions}>
                  <TouchableOpacity 
                      onPress={() => handleEditTask(item)} 
                      style={styles.editButton}
                  >
                      <Text style={styles.editButtonText}>Éditer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                      onPress={() => handleDeleteTask(item)} 
                      style={styles.deleteButton}
                  >
                      <Text style={styles.deleteButtonText}>Supprimer</Text>
                  </TouchableOpacity>
              </View>
          </View>
      );
  };
  

    const renderScreen = () => {
        if (currentScreen === 'DayAgenda' && selectedDate) {
            return (
                <LinearGradient colors={['#4FE2FF', '#004B5A', '#002C35']} style={styles.gradientBackground}>
                    <SafeAreaView style={styles.container}>
                        <TouchableOpacity onPress={() => setCurrentScreen('Home')} style={styles.backButton}>
                            <Text style={styles.backButtonText}>← Retour</Text>
                        </TouchableOpacity>
                        <Text style={styles.header}>Agenda du {moment(selectedDate).format('DD/MM/YYYY')}</Text>
                        <FlatList
                            data={tasks[selectedDate] || []}
                            keyExtractor={(item) => item.id}
                            renderItem={renderTask}
                            ListEmptyComponent={<Text style={styles.noTasksText}>Aucune tâche pour ce jour.</Text>}
                        />
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
                                style={[styles.input, { height: 80 }]}
                                placeholder="Description"
                                value={newTask.description}
                                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                                multiline
                            />
                            {showTimePicker && (
                                <DateTimePicker
                                    value={selectedTime}
                                    mode="time"
                                    display="spinner" 
                                    onChange={(event, date) => {
                                        setShowTimePicker(false);
                                        if (date) {
                                            setSelectedTime(date);
                                            setNewTask({
                                                ...newTask,
                                                time: moment(date).format('HH:mm')
                                            });
                                        }
                                    }}
                                />
                            )}

                            <TouchableOpacity 
                                onPress={() => setShowTimePicker(true)} 
                                style={styles.timeInput}
                            >
                                <Text style={styles.timeInputText}>
                                    {newTask.time || "Sélectionner l'heure"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setCalendarVisible(!calendarVisible)} 
                                style={styles.datePickerButton}
                            >
                                <Text style={styles.datePickerText}>
                                    {newTask.date ? `Date: ${newTask.date}` : 'Choisir la date'}
                                </Text>
                            </TouchableOpacity>

                            {calendarVisible && (
                                <View style={styles.calendarContainer}>
                                    <Calendar
                                        current={newTask.date || moment().format('YYYY-MM-DD')}
                                        onDayPress={(day) => {
                                            setNewTask({ ...newTask, date: day.dateString });
                                            setCalendarVisible(false);
                                        }}
                                        monthFormat={'yyyy MM'}
                                        theme={{
                                            backgroundColor: '#002C35',
                                            calendarBackground: '#002C35',
                                            textSectionTitleColor: '#4FE2FF',
                                            selectedDayBackgroundColor: '#36B1CA',
                                            selectedDayTextColor: '#ffffff',
                                            todayTextColor: '#4FE2FF',
                                            dayTextColor: '#ffffff',
                                            textDisabledColor: '#004B5A',
                                            arrowColor: '#4FE2FF',
                                            monthTextColor: '#4FE2FF',
                                        }}
                                    />
                                </View>
                            )}

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Annuler</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={handleAddOrEditTask}>
                                    <Text style={styles.saveButtonText}>
                                        {editingTask ? 'Modifier' : 'Ajouter'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    gradientBackground: {
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
        marginVertical: 20,
    },
    addButton: {
        backgroundColor: '#36B1CA',
        padding: 15,
        borderRadius: 30,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 3,
    },
    taskDetails: {
        flex: 1,
    },
    taskName: {
        fontWeight: 'bold',
        color: '#ffffff',
        fontSize: 18,
        marginBottom: 5,
    },
    taskData: {
        color: '#ffffff',
        fontSize: 14,
        marginBottom: 5,
    },
    taskTime: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    taskDate: {
        color: '#ffffff',
        fontSize: 12,
        marginTop: 5,
    },
    taskStatus: {
        color: '#ffffff',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 5,
    },
    taskActions: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    editButton: {
        backgroundColor: '#4FE2FF',
        padding: 8,
        borderRadius: 5,
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: '#FF6B6B',
        padding: 8,
        borderRadius: 5,
    },
    editButtonText: {
        color: '#002C35',
        fontSize: 12,
        fontWeight: 'bold',
    },
    deleteButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#002C35',
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxWidth: 400,
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4FE2FF',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#36B1CA',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        fontSize: 16,
    },
    datePickerButton: {
        padding: 15,
        backgroundColor: '#36B1CA',
        borderRadius: 10,
        marginBottom: 15,
    },
    datePickerText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    calendarContainer: {
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#4FE2FF',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
    },
    saveButtonText: {
        color: '#002C35',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    noTasksText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 16,
        marginTop: 20,
    },
    backButton: {
        padding: 10,
        marginLeft: 15,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#4FE2FF',
        fontSize: 16,
    },

    timeInput: {
      padding: 15,
      backgroundColor: '#36B1CA',
      borderRadius: 10,
      marginBottom: 15,
  },
  timeInputText: {
      color: '#ffffff',
      fontSize: 16,
      textAlign: 'center',
  },
});

export default AgendaScreen;