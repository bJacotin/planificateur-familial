import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    View,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
    Animated, Image,
    KeyboardAvoidingView, Platform
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {useState, useEffect, useRef, SetStateAction} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from '@/components/Task';
import Header from "@/components/Header";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import {AnimatedView} from "react-native-reanimated/lib/typescript/component/View";

type TaskItem = {
    title: string;
    isChecked: boolean;
    description: string;
    creationDate: Date | null;
    endingDate: Date | null;
    favorite: boolean;
    priority: number;
};
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Todo() {
    const [choice, setChoice] = useState('Non');
    const slideAnim = useRef(new Animated.Value(0)).current;
    const toggleChoice = () => {
        const isYes = (choice === 'Oui');

        Animated.timing(slideAnim, {
            toValue: isYes ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setChoice(isYes ? 'Non' : 'Oui');
        setFavorite(!isYes);
    };

    const interpolatedPosition = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.17 * screenWidth, 0],
    });

    const [pickerVisible, setPickerVisible] = useState(false);
    const [task, setTask] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [creationDate, setCreationDate] = useState<Date | null>(null);
    const [endingDate, setEndingDate] = useState<Date | null>(null);
    const [favorite, setFavorite] = useState<boolean>(false);
    const [priority, setPriority] = useState<number>(1);
    const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [cancel, setCancel] = useState<boolean>(false);
    const cancelRef = useRef(false);
    const today = new Date();
    today.setHours(0, 0, 0, 0);


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

    const handleAddTask = () => {
        console.log(task)
        if (task.trim().length > 0) {
            Keyboard.dismiss();
            setTaskItems([...taskItems, {
                title: task,
                isChecked: false,
                description: description,
                creationDate: today,
                endingDate: endingDate,
                favorite: favorite,
                priority: priority
            }]);
            console.log(task)
            setTask("");
            setDescription("");
            setCreationDate(null);
            setEndingDate(null);
            setFavorite(false);
            setPriority(1);
            setModalVisible(false)
        }
    };


    // Charger les tâches au démarrage de l'application
    useEffect(() => {

        loadTasks();

    }, []);

    // Sauvegarder les tâches quand taskItems change
    useEffect(() => {
        console.log( taskItems);
        saveTasks();
        console.log( taskItems);
    }, [taskItems]);


    const loadTasks = async () => {
        try {
            const savedTasks = await AsyncStorage.getItem('tasks');
            if (savedTasks !== null) {
                const parsedTasks = JSON.parse(savedTasks);

                const processedTasks = parsedTasks.map((task: any) => ({
                    ...task,
                    creationDate: task.creationDate ? new Date(task.creationDate) : null,
                    endingDate: task.endingDate ? new Date(task.endingDate) : null,
                }));
                setTaskItems(processedTasks);
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

    const formatDate = (date: Date | null) => {
        if (date == null) return '--/--/----';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const onChangeDate = (event: any, date: Date) => {
        setPickerVisible(false);
        if (event.type === "dismissed") {
            setPickerVisible(false);
            return;
        }
        else{
            if (date < today) {
                setEndingDate(null);
            } else {
                // @ts-ignore
                setEndingDate(date);

            }
        }

    };
    const handleResetDate = () => {
        setEndingDate(null);
        console.log(endingDate);
        setPickerVisible(false);
    };

    return (

        <View style={styles.main}>
            <Header text={'Votre ToDo'}/>
            <View style={styles.content}>
                <LinearGradient
                    colors={['#C153F8', '#E15D5A']}
                    start={{ x: 1, y: -0.2 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.todoContainer}>
                </LinearGradient>
                <View style={styles.todoHeader}>
                    <View style={styles.todoDetail}>
                        <Text style={styles.listTitle}>Liste De La Famille</Text>
                        <View>
                            <Image style={styles.settings}source={require("@/assets/images/todoSettings.png")}></Image>
                            <View style={styles.memberDisplay}></View>
                        </View>
                    </View>
                    <View style={styles.todoHeaderButtonContainer}>
                        <TouchableOpacity style={styles.todoHeaderButton}>
                            <Text style={styles.buttonLabel}>Nouvelle {"\n"}Liste</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.todoHeaderButton}>
                            <Text style={styles.buttonLabel}> Ajouter {"\n"}tâche</Text></TouchableOpacity>
                    </View>
                </View>
                    <ScrollView style={styles.todoTaskContainer}>

                        <View style={styles.todoPrioritySection}>
                            <View style={styles.todoPriorityLabelContainer}>
                                <Text style={styles.todoPriorityLabel}>Haute Priorité</Text>
                            </View>
                        </View>

                        <View style={styles.taskContainer}>

                            {taskItems.map((item:TaskItem,index:number) => {
                                return (
                                    <TouchableOpacity key={index}
                                                      onPress={() => completeTask(index)}
                                                      onLongPress={() => requestDeleteTask(index)}>
                                        <Task title={item.title}
                                              isChecked={item.isChecked}
                                              description={item.description}
                                              creationDate={item.creationDate}
                                              endingDate={item.endingDate}
                                              favorite={item.favorite}
                                              priority={item.priority}
                                        />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        <View style={styles.todoPrioritySection}>
                            <View style={styles.todoPriorityLabelContainer}>
                                <Text style={styles.todoPriorityLabel}>Moyenne Priorité</Text>
                            </View>
                        </View>
                        <View style={styles.taskContainer}>

                        </View>



                        <View style={styles.todoPrioritySection}>
                            <View style={styles.todoPriorityLabelContainer}>
                                <Text style={styles.todoPriorityLabel}>Basse Priorité</Text>
                            </View>
                        </View>
                        <View style={styles.taskContainer}>

                        </View>

                        <View style={styles.todoPrioritySection}>
                            <View style={styles.todoPriorityLabelContainer}>
                                <Text style={styles.todoPriorityLabel}>Non Prioritaire</Text>
                            </View>
                        </View>
                        <View style={styles.taskContainer}>

                        </View>
                    </ScrollView>
                </View>




            <Modal // Addtask Modal
                    statusBarTranslucent={true}
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                    >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.content}>
                                <LinearGradient
                                    colors={['#C153F8', '#E15D5A']}
                                    start={{ x: 1, y: -0.2 }}
                                    end={{ x: 0, y: 1 }}
                                    style={styles.modalGradient}>
                                </LinearGradient>
                                <View style={styles.todoHeader}>
                                    <View style={styles.todoDetail}>
                                        <TextInput
                                            style={[styles.taskNameInput,{fontSize:20}]}
                                            placeholder=" Nom de la Tâche"
                                            multiline={true}
                                            maxLength={200}
                                            value={task}
                                            onChangeText={text => setTask(text)}

                                        />

                                    </View>
                                    <View style={styles.todoHeaderButtonContainer}>
                                        <TouchableOpacity onPress={handleAddTask} style={styles.todoHeaderButton}>
                                            <Text style={styles.buttonLabel}>Valider</Text></TouchableOpacity>
                                        <TouchableOpacity onPress={setModalVisible} style={styles.todoHeaderButton}>
                                            <Text style={styles.buttonLabel}>Annuler</Text></TouchableOpacity>
                                    </View>

                                </View>
                                <View style={styles.todoPriorityLabelContainer}>
                                    <Text style={styles.todoPriorityLabel}>Description</Text>
                                </View>
                                <View style={styles.descriptionContainer}>
                                    <TextInput
                                        style={[styles.taskNameInput,{fontSize:16}]}
                                        placeholder="Description de la Tâche"
                                        multiline={true}
                                        maxLength={200}
                                        value={description}
                                        onChangeText={text => setDescription(text)}

                                    />

                                </View>
                                <View style={styles.todoPriorityLabelContainer}>
                                    <Text style={styles.todoPriorityLabel}>Détails</Text>
                                </View>
                                <View style={styles.detailsContainer}>
                                    <View style={styles.detailsLabelContainer}>
                                        <Text style={styles.detailsLabel}>Favoris</Text>
                                    </View>
                                    <TouchableWithoutFeedback onPress={toggleChoice}>
                                    <View style={styles.rightButtonDetail}>
                                        <Text style={styles.oui}>Oui</Text>
                                        <Text style={styles.non}>Non</Text>

                                            <Animated.View
                                                style={[
                                                    styles.hover,
                                                    {
                                                        transform: [{ translateX: interpolatedPosition }],
                                                    },
                                                ]}
                                            />
                                    </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={styles.detailsContainer}>
                                    <View style={styles.detailsLabelContainer}>
                                        <Text style={styles.detailsLabel}>Date Limite</Text>
                                    </View>
                                    <TouchableWithoutFeedback onLongPress={handleResetDate} onPress={()=>setPickerVisible(true)}>
                                    <View style={styles.rightButtonDetail}>
                                        <Text style={[styles.detailsLabel,{fontSize:16}]}>{formatDate(endingDate)}</Text>
                                    </View>
                                    </TouchableWithoutFeedback>
                                    <Modal
                                        transparent={true}
                                        animationType="slide"
                                        visible={pickerVisible}
                                        onRequestClose={() =>setPickerVisible(false)}
                                    >
                                        <DateTimePicker
                                            minimumDate={today}
                                            value={endingDate || new Date()}
                                            mode="date"
                                            display="spinner"
                                            onChange={onChangeDate}
                                        />
                                    </Modal>
                                </View>
                                <View style={styles.detailsContainer}>
                                    <View style={styles.detailsLabelContainer}>
                                        <Text style={styles.detailsLabel}>Catégorie</Text>
                                    </View>
                                    <View style={styles.rightButtonDetail}>
                                        <TextInput
                                            style={[styles.taskNameInput,{fontSize:16}]}
                                            placeholder="Description de la Tâche"
                                            multiline={true}
                                            maxLength={200}
                                            value={priority.toString()}
                                            onChangeText={text => setPriority(parseInt(text,10))}

                                        />
                                    </View>



                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
                </Modal>



        </View>





    );
}

const styles = StyleSheet.create({



    modalContainer: {
        flex: 1,
        paddingTop: 0.10*screenHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    main: {
        flex:1,
        backgroundColor:'white',
        alignItems:"center",
    },
    content:{
        width:"100%",
        height:"100%",


    },
    todoContainer: {
        position:"absolute",
        marginTop:10,
        width:"85%", //*Utiliser Dimension et un calcul dans le futur
        height:"80%",
        alignSelf:"center",
        borderRadius:35,
    },
    todoHeader: {
        marginLeft:0.13*screenWidth ,
        marginTop:0.04*screenHeight,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    listTitle: {
        fontWeight:"bold",
        fontSize:28,
        marginLeft:18,
        marginTop:8
    },
    todoDetail: {
        width:210,
        height:130,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        backgroundColor:"white",
        justifyContent:"space-between",
        borderWidth:2,
        borderBottomWidth:5,

    },
    memberDisplay: {

    },
    todoHeaderButtonContainer: {
        justifyContent:"space-between",
    },
    todoHeaderButton: {
        height: 0.075*screenHeight,
        width:0.27*screenWidth,
        backgroundColor:"white",
        borderTopLeftRadius:25,
        borderBottomLeftRadius:35,
        borderWidth:2,
        borderBottomWidth:5,
        marginRight:-1,
        borderColor:"black",
        alignItems:"center",
        justifyContent:"center"

    },
    buttonLabel: {
        textAlign: 'center',
        fontWeight:"600",
        marginLeft:8,
    },
    todoTaskContainer: {

        alignSelf:"center",
        width:0.85*screenWidth,
        borderTopLeftRadius:0,
        borderTopRightRadius:0,
        borderRadius:35,
        marginTop:10,
        maxHeight:screenHeight*0.61,
    },
    todoPrioritySection: {

    },
    todoPriorityLabelContainer: {
        height: 0.04*screenHeight,
        width:0.4*screenWidth,
        backgroundColor:"white",
        borderTopRightRadius:25,
        borderBottomRightRadius:35,
        borderWidth:2,
        borderBottomWidth:4,
        marginLeft:-2,
        borderColor:"black",
        marginTop:10,
        alignItems:"center",

    },
    todoPriorityLabel: {
        marginLeft:14,
        fontWeight:'600'
    },
    taskContainer: {


    },
    settings: {
        width:26,
        height:26,
        marginLeft:18,
        marginBottom:12
    },
    taskNameInput:{
        marginTop:5,
        marginLeft:10,
        height:'80%',
        textAlignVertical: 'top',
    },
    descriptionContainer: {
        width:0.74*screenWidth,
        height:0.10*screenHeight,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        backgroundColor:"white",
        borderWidth:2,
        borderBottomWidth:5,
        marginTop:0.01*screenHeight,
        marginLeft:0.13*screenWidth
    },
    modalGradient: {
        position:"absolute",
        marginTop:10,
        width:0.85*screenWidth,
        height:0.8*screenHeight,
        alignSelf:"center",
        borderRadius:35,
    },
    detailsContainer: {
        flexDirection:"row",
        alignSelf:"center",
        width:0.74*screenWidth,
        marginTop:6,
        justifyContent:"space-between",

    },
    detailsLabelContainer: {
        justifyContent:"center",
        backgroundColor:'white',
        width:0.30*screenWidth,
        height:0.08*screenHeight,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        borderWidth:2,
        borderBottomWidth:5,

    },
    detailsLabel: {

        marginTop:-1,
        textAlign:"center"
    },
    rightButtonDetail: {
        width:0.4*screenWidth,
        height:0.08*screenHeight,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        backgroundColor:"white",
        borderWidth:2,
        borderBottomWidth:5,
        alignSelf:"flex-end",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-around"
    },

    hover: {
        width:0.23*screenWidth,
        height:0.08*screenHeight,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        backgroundColor:'rgba(0,0,0,0.1)',
        borderWidth:2,
        borderBottomWidth:5,
        position: 'absolute',
        top: -2,
        left: -2,
    },
    oui: {
        top:-2,
        left:2,
    },
    non: {
        left:-2,
        top:-2,
    },

    menuContainer: {
        position: 'absolute',
        bottom: '100%',  // Le menu apparaîtra en haut du bouton
        marginBottom: 10, // Espace entre le bouton et le menu
        left: '50%',
        transform: [{ translateX: -75 }], // Centrer le menu horizontalement
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menu: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        width: 150,
        zIndex: 100,
    },
    menuItem: {
        paddingVertical: 10,
    },
    menuText: {
        fontSize: 16,
        color: 'black',
    },
});



