import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from '@/FirebaseConfig';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView, 
    ActivityIndicator
} from 'react-native';

import Header from "@/components/Header";
import TaskCard from "@/app/ToDoList/ToDoListComponents/itemCard"; // Changé de ItemCard à TaskCard
import AddTaskModal from "@/app/ToDoList/ToDoListComponents/addTaskModal";
import {deleteTask, toggleTaskStatus, useTodoListById} from "@/app/ToDoList/ToDoListController";
import {useLocalSearchParams} from "expo-router";

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const TodoListDetail = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const { id } = useLocalSearchParams();
    const { todoList, loading } = useTodoListById(id as string);

    const handleToggle = async (taskId: string) => {
        try {
            await toggleTaskStatus(id as string, taskId);
        } catch (error) {
            console.error("Erreur lors du changement de statut:", error);
        }
    };

    const handleDelete = async (taskId: string) => {
        try {
            await deleteTask(id as string, taskId);
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        }
    };

    return (
        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.mainContainer}>
            <View>
                <Header  text={""}/>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Mes Tâches</Text>
                    <Image style={styles.imgTukki} source={require('@/assets/images/Group20.png')} />
                </View>
            </View>
            
            <View style={styles.todoListContainer}>
                <View style={styles.leftBackgroundContent}>
                    <Image style={styles.todoBg} source={require('@/assets/images/shoppingBagBg.png')} />
                    <Image style={styles.todoIllustration} source={require('@/assets/images/todoillustration.png')} />
                </View>
                
                <ScrollView style={styles.listCardContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#4FE2FF" />
                    ) : todoList?.items?.length > 0 ? (
                        todoList.items.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={() => handleToggle(task.id)}
                                onDelete={() => handleDelete(task.id)}
                            />
                        ))
                    ) : (
                        <Text style={styles.emptyMessage}>Aucune tâche dans cette liste</Text>
                    )}
                </ScrollView>
            </View>
            
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.buttonLabel}>+</Text>
            </TouchableOpacity>
            
            <AddTaskModal 
                listId={id as string}
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible} 
            />
        </LinearGradient>
    );
};

export default TodoListDetail;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: 25,
        paddingTop: 5
    },
    title: {
        fontSize: 32,
        fontFamily: "Poppins_Bold",
        color: "white",
        marginLeft: 35,
        marginTop: 35,
        width: 190,
        lineHeight: 36
    },
    imgTukki: {
        height: 120,
        bottom: 35
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    todoListContainer: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        marginTop: 2,
    },
    leftBackgroundContent: {
        position: 'relative',
        top: 100,
        left: -78
    },
    todoIllustration: {
        position: "absolute",
        left: 90,
        top: 80,
        height: 180,
        width: 140,
        resizeMode: 'contain'
    },
    todoBg: {
        position: "absolute",
        height: 400,
        resizeMode: 'contain'
    },
    listCardContainer: {
        paddingTop: 25,
        width: ScreenWidth,
        marginBottom: 20
    },
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 15,
        backgroundColor: "#4FE2FF",
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: 70,
        borderRadius: 35,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonLabel: {
        color: 'white',
        fontFamily: "Poppins_Regular",
        marginTop: 8,
        marginLeft: 2,
        fontSize: 36,
        alignSelf: "center",
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 50,
        fontFamily: 'Poppins_Medium',
        fontSize: 16,
        color: '#555'
    },
    listName: {
        opacity: 0.8,
        fontFamily: "Poppins_SemiBold",
        fontSize: 28,
        color: "white",}
});