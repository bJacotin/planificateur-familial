import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from '@/components/Task';
import Header from "@/components/Header";



type TaskItem = {
    title: string;
    isChecked: boolean;
    details: string;
};

export default function Todo() {
    const [task, setTask] = useState<string>("");
    const [detail, setDetail] = useState<string>("");
    const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const completeTask = (index: number) => {
        const itemsCopy = [...taskItems];
        itemsCopy[index].isChecked = !itemsCopy[index].isChecked;
        setTaskItems(itemsCopy);
    };

    const deleteTask = (index: number) => {
        let itemsCopy = [...taskItems];
        itemsCopy.splice(index,1);
        setTaskItems(itemsCopy)
    }

    const handleAddTask = () => {
        if (task.trim().length > 0) {
            Keyboard.dismiss();
            setTaskItems([...taskItems, { title: task, isChecked: false, details: detail }]);
            setTask("");
            setDetail("");
            setModalVisible(false)
        }
    };


    // Charger les tâches au démarrage de l'application
    useEffect(() => {
        loadTasks();
    }, []);

    // Sauvegarder les tâches quand taskItems change
    useEffect(() => {
        saveTasks();
    }, [taskItems]);


    const loadTasks = async () => {
        try {
            const savedTasks = await AsyncStorage.getItem('tasks');
            if (savedTasks !== null) {
                setTaskItems(JSON.parse(savedTasks));
            }
        } catch (error) {
            console.error('Erreur lors du chargement des tâches', error);
        }
    };


    const saveTasks = async () => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(taskItems));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des tâches', error);
        }
    };
    return (
        <View style={{flex:1,backgroundColor:'white'}}>
            <Header text={'Votre ToDo'}/>
            <View style={styles.container}>

                <LinearGradient
                    colors={['#C153F8', '#E15D5A']}
                    style={styles.mainCard}
                    start={{ x: 1, y: -0.2 }}
                    end={{ x: 0, y: 1 }}
                ><View >
                    <View style={styles.titleContainer}>
                        <Text style={styles.headerDetails}>TO DO LIST :</Text>
                        <Text style={styles.title}>Perso</Text>
                    </View>
                </View>
                    <ScrollView style={{marginTop:6}}>

                        {taskItems.map((item:TaskItem,index) => {
                            return (
                                <TouchableOpacity key={index}
                                                  onPress={() => completeTask(index)}
                                                  onLongPress={() => deleteTask(index)}>
                                    <Task title={item.title} isChecked={item.isChecked} details={item.details}/>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </LinearGradient>
                <TouchableOpacity style={styles.newTaskButton} onPress={():void => setModalVisible(true)}>
                    <Text style={styles.buttonLabel}>Nouvelle Tâche</Text>
                </TouchableOpacity>
            </View>

            <Modal
                statusBarTranslucent={true}
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <LinearGradient
                                colors={['#C153F8', '#E15D5A']}
                                style={styles.modalContent}
                                start={{ x: 1, y: -0.2 }}
                                end={{ x: 0, y: 1 }}
                            >
                                <View style={styles.addTaskWrapper}>
                                    <View style={styles.sectionNameContainer}>
                                        <Text style={styles.sectionNameLabel}>Nom de la Tâche</Text>
                                    </View>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder=" |"
                                        value={task}
                                        onChangeText={text => setTask(text)}
                                    />
                                </View>
                                <View style={styles.addTaskWrapper}>
                                    <View style={styles.sectionNameContainer}>
                                        <Text style={styles.sectionNameLabel}>Description</Text>
                                    </View>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder=" |"
                                        value={detail}
                                        onChangeText={detail => setDetail(detail)}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.addTaskButton]}
                                    onPress={handleAddTask}
                                >
                                    <Text style={styles.addTaskButtonText}>Ajouter la Tâche</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </View>





    );
}

const styles = StyleSheet.create({

    mainCard: {
        alignSelf: "center",
        width: '100%',
        height: '95%',
        backgroundColor: 'red',
        marginBottom: 15,
        borderRadius: 30,
        padding:10,

        elevation:10
    },

    container: {

        //height:'83%',
        flex:1,
        paddingTop:25,
        padding: 40,
    },
    titre : {
        fontSize: 38,
        fontWeight: "bold"
    },




    titleContainer: {
        height:63,
        width:160,
        backgroundColor:'white',
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        display: "flex",
        elevation: 5,
        borderWidth:2,
        borderBottomWidth:5,

    },
    headerDetails: {
        fontSize:10,
        marginTop:10,
        marginLeft:10
    },
    title: {
        marginTop:-6,
        fontWeight:"500",
        fontSize:24,
        alignSelf:"center"
    },
    newTaskButton: {

        alignSelf:"center",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        width:150,
        height:50,
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomRightRadius:35,
        borderBottomLeftRadius:35,
        borderWidth:2,
        borderBottomWidth:5,


    },
    buttonLabel: {

        marginLeft:1,
        alignSelf:"center",
    },
    modalContainer: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: '85%',

        borderRadius: 30,
        paddingTop:20,
        padding: 10,
        alignItems: 'center',
        elevation: 30
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15
    },
    modalInput: {
        width: '60%',
        height:55,
        backgroundColor: 'white',
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomRightRadius:35,
        borderBottomLeftRadius:35,
        borderWidth:2,
        borderBottomWidth:5,

        borderRadius: 5,
        padding: 10,
        marginBottom: 20
    },

    addTaskWrapper: {
        width:'100%',
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",


    },
    sectionNameLabel: {
        marginTop:3,
        fontFamily:"Poppins_Medium",
        fontSize : 12,
        textAlign:"center"

    },
    sectionNameContainer:{
        height:55,
        width:"35%",
        backgroundColor: 'white',
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomRightRadius:35,
        borderBottomLeftRadius:35,
        borderWidth:2,
        borderBottomWidth:5,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",

    },
    addTaskButton: {
        height:50,
        width:"35%",
        backgroundColor: 'white',
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomRightRadius:35,
        borderBottomLeftRadius:35,
        borderWidth:2,
        borderBottomWidth:5,
    },
    addTaskButtonText: {
        marginTop:3,
        fontFamily:"Poppins_Medium",
        fontSize : 12,
        textAlign:"center"
    },
    quitButton: {
        position:"relative",
        start:0
    }
});


