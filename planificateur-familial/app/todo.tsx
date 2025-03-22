
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
    Image, Platform, KeyboardAvoidingView, Button, FlatList
} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from '@/components/Task';
import Header from "@/components/Header";
import {router, usePathname} from "expo-router";
import {useSearchParams} from "expo-router/build/hooks";
import {FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {collection, doc, getDoc, getDocs, where} from "@firebase/firestore";
import {query} from "@firebase/database";


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
    const [cancel, setCancel] = useState<boolean>(false);
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
        console.log("before modal", cancel)
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
        itemsCopy.splice(index, 1);
        setTaskItems(itemsCopy)
    }

    const handleCancelPress = () => {
        console.log("cancel clicked", cancel)
        setCancel(true)
        console.log("cancel clicked", cancel)
        setDeleteModalVisible(false)
    };

    const pathname = usePathname();

    console.log(pathname)
    const [todoList, setTodoList] = useState(null);
    function getDateRangeFromId() {
        const now = new Date();

        switch ("") {
            case "idAujourd'hui":
                return {
                    start: now,
                    end: new Date(now.getTime() + 24 * 60 * 60 * 1000), // +1 jour
                };
            case "idSemaine":
                return {
                    start: now,
                    end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +1 semaine
                };
            case "idMois":
                return {
                    start: now,
                    end: new Date(now.setMonth(now.getMonth() + 1)), // +1 mois
                };
            default:
                return { start: null, end: null };
        }
    }
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchTasks = async () => {
            const dateRange = getDateRangeFromId(8);

            if (!dateRange.start || !dateRange.end) {
                console.error("ID invalide, aucun filtre appliqué.");
                return;
            }

            try {
                const tasksRef = collection(FIREBASE_FIRESTORE, "tasks"); // Assurez-vous d'avoir une collection "tasks"
                const tasksQuery = query(
                    tasksRef,
                    where("dueDate", ">=", dateRange.start), // Date d'échéance >= début
                    where("dueDate", "<=", dateRange.end) // Date d'échéance <= fin
                );

                const querySnapshot = await getDocs(tasksQuery);
                const fetchedTasks = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setTasks(fetchedTasks);
            } catch (error) {
                console.error("Erreur lors de la récupération des tâches :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();

    }, [pathname]);


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

    const settingslist = [
        { id: '1', date: '31 décembre', icon: require('@/assets/images/agenda.png') },
        { id: '2', date: 'Travail', icon: require('@/assets/images/Todo.png') },
        { id: '3', date: '2 janvier', icon: require('@/assets/images/agenda.png') },
    ];

    const closeModal = () => {
        Keyboard.dismiss();
        setModalVisible(false);
    };
    return (
        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={{height: ScreenHeight * 0.36, marginTop: 25}}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#4FE2FF"/>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/')} style={[{zIndex: 4}, {position: 'absolute'}]}>
                    <LinearGradient
                        colors={['#4FE2FF', '#4FE2FF']}
                        style={styles.buttonWrap}
                        start={{x: 1, y: -0.2}}
                        end={{x: 0, y: 1}}
                    >
                        <Image source={require("@/assets/images/arrowLeft.png")}/>
                    </LinearGradient>
                </TouchableOpacity>

            </View>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Image source={require('@/assets/images/arrow.png')} style={{width: 50, height: 50, opacity: 0.5}}/>
                    <Text style={styles.title}>Aujourd'hui</Text>
                    <Image source={require('@/assets/images/arrow.png')}
                           style={{width: 50, height: 50, opacity: 0.5, transform: [{rotate: '180deg'}]}}/>

                </View>
                <Task title={"toto"} isChecked={false} details={"aze a"}></Task>
                <ScrollView style={{marginTop: 6}}>

                    {taskItems.map((item: TaskItem, index) => {
                        return (
                            <TouchableOpacity key={index}
                                              onPress={() => completeTask(index)}
                                              onLongPress={() => requestDeleteTask(index)}>
                                <Task title={item.title} isChecked={item.isChecked} details={item.details}/>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>

                <TouchableOpacity style={styles.newTaskButton} onPress={(): void => setModalVisible(true)}>
                    <Text style={styles.buttonLabel}>+</Text>
                </TouchableOpacity>


            </View>


            <Modal // Addtask Modal
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
                            <TextInput placeholder="Titre" style={styles.titleInput}/>
                            <TextInput placeholder="Description" style={styles.descriptionInput}/>
                            <LinearGradient
                                colors={['#4FE2FF', '#004B5A', '#002C35']}
                                locations={[0, 0.8, 1]}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={{width: ScreenWidth, height:ScreenHeight*0.012}}
                            ></LinearGradient>
                            <FlatList
                                data={settingslist}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.parameterContainer}>
                                        <Image style={styles.iconScrollList} source={item.icon} />
                                        <Text style={styles.textScrollList}>{item.date}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.id}
                                horizontal={true}
                                showsHorizontalScrollIndicator={true}
                                contentContainerStyle={{
                                    paddingHorizontal: 15,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                style={{ width: '100%' }}
                            />
                        </KeyboardAvoidingView>
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
                        <TouchableWithoutFeedback onPress={() => {
                        }}>
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
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 0}}
                                            style={styles.gradientBar}
                                        />
                                    </Animated.View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                                    <TouchableOpacity
                                        style={styles.addTaskButton}
                                        onPress={() => handleCancelPress()}
                                    >
                                        <Text style={[styles.addTaskButtonText, {marginTop: 10}]}>Annuler</Text>
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
        padding: 10,

        elevation: 10
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
    titre: {
        fontSize: 38,
        fontWeight: "bold"
    },


    titleContainer: {
        backgroundColor: '#EBEBEB',
        alignSelf: "center",
        display: "flex",
        flexDirection: "row",

    },
    headerDetails: {
        fontSize: 10,
        marginTop: 10,
        marginLeft: 10
    },
    title: {
        color: '#3D3D3D',
        fontSize: 30,
        alignSelf: "center",
        fontFamily: "Poppins_SemiBold",
    },
    newTaskButton: {
        position: "absolute",
        top: ScreenHeight * 0.76,
        right: 15,
        backgroundColor: "#4FE2FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: 70,
        borderRadius: 35,


    },
    buttonLabel: {

        color: 'white',
        fontFamily: "Poppins_Regular",
        marginTop: 8,
        marginLeft: 2,
        fontSize: 36,
        alignSelf: "center",
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
        paddingTop: 20,
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
        height: 55,
        backgroundColor: 'white',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderWidth: 2,
        borderBottomWidth: 5,

        borderRadius: 5,
        padding: 10,
        marginBottom: 20
    },

    addTaskWrapper: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",


    },
    sectionNameLabel: {
        marginTop: 3,
        fontFamily: "Poppins_Medium",
        fontSize: 12,
        textAlign: "center"
    },
    sectionNameContainer: {
        height: 55,
        width: "35%",
        backgroundColor: 'white',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderWidth: 2,
        borderBottomWidth: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    addTaskButton: {
        height: 50,
        width: "35%",
        backgroundColor: 'white',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderWidth: 2,
        borderBottomWidth: 5,
    },
    addTaskButtonText: {
        marginTop: 3,
        fontFamily: "Poppins_Medium",
        fontSize: 12,
        textAlign: "center"
    },
    quitButton: {
        position: "relative",
        start: 0
    },
    cancelModalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    cancelModalContent: {
        borderWidth: 2,
        backgroundColor: 'white',
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
        height: 100,
        justifyContent: 'center'
    },

    buttonWrap: {
        height: 60,
        width: 80,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        zIndex: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalView: {
        justifyContent:"space-around",
        backgroundColor: 'white',
        paddingTop:15,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        elevation: 5,
    },
    titleInput: {
        width: '100%',
        fontFamily:"Poppins_SemiBold",
        fontSize:28,
        paddingHorizontal:30,
    },
    descriptionInput: {
        paddingHorizontal:30,
        marginTop:-20,
        marginBottom: -10,
        width: '100%',
        fontFamily:"Poppins_SemiBold",
        fontSize:20,
        opacity:0.6
    },
    iconScrollList: {
        width:30,
        height:30,
        marginLeft:10,
    },
    parameterScrollView:{
        height:80,
        width: '100%',
        flexDirection:"column",



    },
    parameterContainer: {
        borderColor:'#004B5A',
        height:50,
        width:170,
        justifyContent:"flex-start",
        alignItems:'center',
        borderRadius:15,
        borderWidth:4,
        flexDirection:"row",
        margin:10
    },
    textScrollList: {
        color:'#004B5A',
        fontFamily:"Poppins_Medium",
        marginLeft:10,
        marginRight:10,
        marginTop:4
    }


});
