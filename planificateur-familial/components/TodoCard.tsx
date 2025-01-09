import {LinearGradient} from "expo-linear-gradient";
import {
    Animated,
    Dimensions,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Task from "@/components/Task";
import {useEffect, useRef, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

enum AccessRights {
    Read = "read",
    Write = "write",
    Owner = "owner",
}

type ListCollection = {
    list: List[];
};

type List = {
    id: number;
    name: string;
    tasks: TaskItem[];
    permissions: ListPermission[];
};
type ListPermission = {
    userId: number;
    rights: AccessRights;
};

type TaskItem = {
    id: number;
    title: string;
    isChecked: boolean;
    description: string;
    creationDate: Date | null;
    endingDate: Date | null;
    favorite: boolean;
    priority: number;
};
const TodoCard = (list:List) => {
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



    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
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
    return(

            <LinearGradient
                colors={['#C153F8', '#E15D5A']}
                start={{ x: 1, y: -0.2 }}
                end={{ x: 0, y: 1 }}
                style={styles.todoContainer}>

            <View style={styles.todoHeader}>
                <View style={styles.todoDetail}>
                    <Text style={styles.listTitle}>{list.name}</Text>
                    <View>
                        <Image style={styles.settings} source={require("@/assets/images/todoSettings.png")}></Image>
                        <View style={styles.memberDisplay}></View>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.todoTaskContainer}>
                <View style={styles.todoPrioritySection}>
                    <View style={styles.todoPriorityLabelContainer}>
                        <Text style={styles.todoPriorityLabel}>Haute Priorité</Text>
                    </View>
                </View>

                <View style={styles.taskContainer}>
                    {taskItems.filter((item: TaskItem) => item.favorite && item.priority === 1).map((item:TaskItem,index:number) => {
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
                    {taskItems.filter((item: TaskItem) => !item.favorite && item.priority === 1).map((item:TaskItem,index:number) => {
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
            </LinearGradient>

    )
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
        width:0.85*screenWidth,
        height:0.80*screenHeight,
        alignSelf:"center",
        borderRadius:35,

    },
    todoHeader: {
        marginLeft:0.08*screenWidth ,
        marginTop:0.04*screenHeight,
        flexDirection:"row",

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
export default TodoCard;
