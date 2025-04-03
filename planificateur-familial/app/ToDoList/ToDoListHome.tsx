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
import ListCard from "./ToDoListComponents/listCard";
import AddListModal from "./ToDoListComponents/addListModal";
import {deleteList, useTodoLists} from "@/app/ToDoList/ToDoListController";
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const TodoListHome = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const { todoLists, loading } = useTodoLists();

    
    return (
        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.mainContainer}>
            <View>
                <Header text={""}/>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Mes Todo Lists</Text>
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
                    ) : todoLists.length > 0 ? (
                        todoLists.map(list => (
                            <ListCard
                                key={list.id}
                                list={list}
                            />
                        ))
                    ) : (
                        <Text style={styles.emptyMessage}>Aucune liste de tâches</Text>
                    )}
                </ScrollView>
            </View>
            
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.buttonLabel}>+</Text>
            </TouchableOpacity>
            
            <AddListModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible} 
            />
        </LinearGradient>
    );
};

export default TodoListHome;

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
    }
});