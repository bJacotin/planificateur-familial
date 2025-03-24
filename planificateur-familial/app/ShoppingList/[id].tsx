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
    ScrollView, ActivityIndicator
} from 'react-native';

import Header from "@/components/Header";
import ListCard from "@/app/ShoppingList/ShoppingListComponents/listCard";
import AddListModal from "@/app/ShoppingList/ShoppingListComponents/addListModal";
import {getShoppingListById, useShoppingListById, useShoppingLists} from "@/app/ShoppingList/shoppingListController";
import {useLocalSearchParams} from "expo-router";
import ItemCard from "@/app/ShoppingList/ShoppingListComponents/itemCard";
import AddItemModal from "@/app/ShoppingList/ShoppingListComponents/addItemModal";

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const ShoppingListHome = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const JSONparams = useLocalSearchParams();
    const id = JSONparams.id

    const { shoppingList, loading } = useShoppingListById(id);


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
                    <Text style={styles.title}>Listes de Courses</Text>
                    <Image style={styles.imgTukki} source={require('@/assets/images/Group20.png')}></Image>
                </View>
            </View>
            <View style={styles.shoppingListContainer}>
                <View style={styles.leftBackgroundContent}>
                    <Image style={styles.shoppingBagBg} source={require('@/assets/images/shoppingBagBg.png')}></Image>
                    <Image style={styles.shoppingBag} source={require('@/assets/images/shoppingBag.png')} ></Image>
                </View>
                <ScrollView style={styles.listCardContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#4FE2FF" />
                    ) : shoppingList.items.length > 0 ? (
                        shoppingList.items.map((item) => <ItemCard key={item.id} item={item} />)
                    ) : (
                        <Text>Aucun item dans cette liste</Text>
                    )}
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.newTaskButton} onPress={(): void => setModalVisible(true)}>
                <Text style={styles.buttonLabel}>+</Text>
            </TouchableOpacity>
            <AddItemModal listId={id} modalVisible={modalVisible} setModalVisible={setModalVisible}></AddItemModal>
        </LinearGradient>
    );
};

export default ShoppingListHome;

const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        marginTop:25,
        paddingTop:5
    },
    title: {
        fontSize:32,
        fontFamily : "Poppins_Bold",
        color: "white",
        marginLeft:35,
        marginTop:35,
        width:190,
        lineHeight:36
    },
    backgroundCircle: {

    },
    imgTukki: {
        height:120,
        bottom:35
    },
    titleContainer: {
        flexDirection:'row'
    },
    shoppingListContainer: {
        flex:1,
        backgroundColor:"white",
        borderTopLeftRadius:35,
        borderTopRightRadius:35,
        top:2,
    },
    leftBackgroundContent: {
        position:'relative',
        top:100,
        left:-78
    },
    shoppingBag: {
        position:"absolute",
        left:90,
        top:80,
        height:180,
        width:140
    },
    shoppingBagBg: {
        position:"absolute",
        height:400
    },
    listCardContainer: {
        paddingTop:25,
        width:ScreenWidth
    },
    newTaskButton: {
        position: "absolute",
        top: ScreenHeight * 0.89,
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


});
