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
    Animated,
    Dimensions,
    StatusBar,
    Image
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from '@/components/Task';
import Header from "@/components/Header";
import { router } from "expo-router";


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;





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
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [cancel,setCancel] = useState<boolean>(false);
    const cancelRef = useRef(false);

    useEffect(() => {
        cancelRef.current = cancel;
    }, [cancel]);

    const completeTask = (index: number) => {
        const itemsCopy = [...taskItems];
        itemsCopy[index].isChecked = !itemsCopy[index].isChecked;
        setTaskItems(itemsCopy);
    };

    const requestDeleteTask = (index: number) => {
        let itemsCopy = [...taskItems];
        setCancel(false);


        deleteTask(index)
        console.log("before modal",cancel)
        setDeleteModalVisible(true);
        setTimeout(() => {
            setDeleteModalVisible(false);
            console.log("before if cancel", cancelRef.current);
            if (cancelRef.current) {
                setTaskItems(itemsCopy);
            }
            console.log("after if cancel", cancelRef.current);
            setCancel(false);
        }, 3000);


    };

    const deleteTask = (index: number) => {
        let itemsCopy = [...taskItems];
        itemsCopy.splice(index,1);
        setTaskItems(itemsCopy)
    }

    const handleCancelPress = () => {
        console.log("cancel clicked",cancel)
        setCancel(true)
        console.log("cancel clicked",cancel)
        setDeleteModalVisible(false)
    };

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

    const progressAnim = useRef(new Animated.Value(100)).current; // Valeur initiale 100%

    useEffect(() => {
        if (deleteModalVisible) {

            Animated.timing(progressAnim, {
                toValue: 0,
                duration: 3000,
                useNativeDriver: false,
            }).start(() => {

                setDeleteModalVisible(false);
            });
        } else {
            
            progressAnim.setValue(100);
        }
    }, [deleteModalVisible]);
    return (
        <LinearGradient
        colors={['#4FE2FF', '#004B5A', '#002C35']}
        locations={[0, 0.8, 1]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        style={{height: ScreenHeight * 0.36,marginTop:25}}
    >
                        <StatusBar barStyle="dark-content" backgroundColor="#4FE2FF"/>
            
                        <View style={styles.header}>
                                    <TouchableOpacity onPress={() => router.push('/')} style={[{ zIndex: 4 }, { position: 'absolute' }]}>
                                      <LinearGradient
                                        colors={['#4FE2FF', '#4FE2FF']}
                                        style={styles.buttonWrap}
                                        start={{ x: 1, y: -0.2 }}
                                        end={{ x: 0, y: 1 }}
                                      >
                                        <Image source={require("@/assets/images/arrowLeft.png")} />
                                      </LinearGradient>
                                    </TouchableOpacity>
            
                        </View>

            <View style={styles.container}>
                   <View style={styles.titleContainer}>
                        <Image source={require('@/assets/images/arrow.png')} style={{width:50,height:50,opacity:0.5}} />
                        <Text style={styles.title}>Aujourd'hui</Text>
                        <Image source={require('@/assets/images/arrow.png')} style={{width:50,height:50,opacity:0.5,transform:[{rotate: '180deg'}]}} />

                    </View>
                    <Task title={"toto"} isChecked={false} details={"aze a"}></Task>

                <View >
 
                </View>
                    <ScrollView style={{marginTop:6}}>

                        {taskItems.map((item:TaskItem,index) => {
                            return (
                                <TouchableOpacity key={index}
                                                  onPress={() => completeTask(index)}
                                                  onLongPress={() => requestDeleteTask(index)}>
                                    <Task title={item.title} isChecked={item.isChecked} details={item.details}/>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
                <TouchableOpacity style={styles.newTaskButton} onPress={():void => setModalVisible(true)}>
                    <Text style={styles.buttonLabel}>Nouvelle Tâche</Text>
                </TouchableOpacity>

            <Modal // Addtask Modal
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


            <Modal //Cancel Modal
                statusBarTranslucent={true}
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
                    <View style={styles.cancelModalContainer}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View

                                style={styles.cancelModalContent}

                            >
                                <View style={styles.progressBarContainer}>
                                    <Animated.View
                                        style={{
                                            width: progressAnim.interpolate({
                                                inputRange: [0, 100],
                                                outputRange: ['0%', '100%'],
                                            }),
                                        }}
                                    >
                                        <LinearGradient
                                            colors={['#C153F8', '#E15D5A']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.gradientBar}
                                        />
                                    </Animated.View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                    <TouchableOpacity
                                        style={styles.addTaskButton}
                                        onPress={() => handleCancelPress()}
                                    >
                                        <Text style={[styles.addTaskButtonText,{marginTop:10}]}>Annuler</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


        </LinearGradient>





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
            elevation: 100,
            backgroundColor: '#EBEBEB',
            width: ScreenWidth,
            height: ScreenHeight,
            marginTop: 7,
            borderRadius: 35,
            paddingTop: ScreenWidth * 0.1
        
    },
    titre : {
        fontSize: 38,
        fontWeight: "bold"
    },




    titleContainer: {
        backgroundColor:'#EBEBEB',
        alignSelf:"center",
        display: "flex",
        flexDirection: "row",

    },
    headerDetails: {
        fontSize:10,
        marginTop:10,
        marginLeft:10
    },
    title: {
        color: '#3D3D3D',
        fontSize:30,
        alignSelf:"center",
        fontFamily:"Poppins_SemiBold",
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
    },
    cancelModalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    cancelModalContent: {
        borderWidth:2,
        backgroundColor:'white',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    progressBarContainer: {
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    gradientBar: {
        height: '100%',
    },
    header: {
        height:100,
        justifyContent:'center'
    },

    buttonWrap: {
        height: 60,
        width: 80,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        zIndex: 4, 
      },


});


