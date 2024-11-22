import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from '@/components/Task';
import Header from "@/components/Header";



export default function Todo() {
    const [task, setTask] = useState<string>('');
    const [taskItems, setTaskItems] = useState<string[]>([]);
    const completeTask = (index: number) => {
        let itemsCopy = [...taskItems];
        itemsCopy.splice(index,1);
        setTaskItems(itemsCopy)
    }

    const handleAddTask = () => {
        Keyboard.dismiss();
        setTaskItems([...taskItems, task])
        setTask('')
    }

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
                    colors={['#C153F8', '#E15D5A']} // Dégradé
                    style={styles.mainCard}
                    start={{ x: 1, y: -0.2 }}
                    end={{ x: 0, y: 1 }}
                ><View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.headerDetails}>TO DO LIST :</Text>
                        <Text style={styles.title}>Perso</Text>
                    </View>
                </View>
                    <ScrollView >

                        {taskItems.map((item,index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                                    <Task text={item}/>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </LinearGradient>



                <View

                    style={styles.writeTaskWrapper}>
                    <TextInput style={styles.input}
                               placeholder={'Nouvelle Tache'}
                               value={task}
                               onChangeText={text => setTask(text)}/>
                    <TouchableOpacity onPress={() => handleAddTask()}>
                        <View style={styles.addWrapper}>
                            <Text style={styles.addText}>+</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View>





    );
}

const styles = StyleSheet.create({

    mainCard: {
        alignSelf: "center",

        width: '100%',
        height: '95%',
        backgroundColor: 'red',
        marginBottom: 25,
        borderRadius: 30,
        padding:15,
    },

    container: {

        //height:'83%',
        flex:1,
        padding: 40,
    },
    titre : {
        fontSize: 38,
        fontWeight: "bold"
    },
    writeTaskWrapper: {

        flexDirection: 'row',
        justifyContent:'space-around',
        width:'100%',
        bottom: 10,
        left:40,
        position:'absolute'
    },

    input: {
        width: '80%',
        backgroundColor:'#FFFFFF',
        borderRadius: 23,
        height:46,
        paddingLeft:20,
    },
    addWrapper: {
        height: 46,
        width: 46,
        backgroundColor: '#FFFFFF',
        borderRadius: 23,
        alignItems:'center',
        justifyContent:'center'
    },
    addText: {


    },
    cardHeader: {

    },
    titleContainer: {
        height:60,
        width:160,
        backgroundColor:'white',
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        display: "flex",
        elevation: 5,

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
    }
});


