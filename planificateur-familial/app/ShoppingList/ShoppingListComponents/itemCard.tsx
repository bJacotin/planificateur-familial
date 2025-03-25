import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform, ScrollView
} from 'react-native';

import {ShoppingListItem} from '../ShoppingListTypes/shoppingListsTypes';
import {deleteItem, listenToItemChecked, toggleItemChecked} from "@/app/ShoppingList/shoppingListController";
import ConfirmDeleteModal from "@/components/modal/confirmDeleteModal";


const ItemCard: React.FC<{ listId : string, item: ShoppingListItem }> = ({ item, listId }) => {

    const [modalVisible,setModalVisible] = useState<boolean>(false)
    const [checked, setChecked] = useState<boolean>(item.checked || false);

    useEffect(() => {
        const unsubscribe = listenToItemChecked(listId, item.id, setChecked);
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [listId, item.id]);

    const handleCheckPress = () => {
        toggleItemChecked(listId, item.id, checked);
    };

    return (
        <TouchableOpacity style={styles.card} onLongPress={() => setModalVisible(true)} >
            <View>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.sizeBg}>
                    <Text style={styles.size}>Qte :{item.quantity}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.emptyButton} onPress={() => handleCheckPress()}>
                {checked && <View style={styles.innerButton} />}
            </TouchableOpacity>
            <ConfirmDeleteModal modalVisible={modalVisible} setModalVisible={setModalVisible} handlePress={() =>deleteItem(item,listId)} deletedObject={"l'objet"}></ConfirmDeleteModal>
        </TouchableOpacity>

    );
};


export default ItemCard;

const styles = StyleSheet.create({
    card: {
        alignSelf:"center",
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        backgroundColor:"#3FC3DD",
        width:330,
        height:62,
        marginTop:25,
        paddingLeft:36,
        elevation:5,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    arrow: {
        transform: [{ rotate: '180deg' }],
        height:44,
        width:51,
        marginTop:8

    },
    sizeBg: {
        backgroundColor:"#ffffff",
        marginBottom:4,
        width:100,
        height:18,
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        justifyContent:"center",
        alignItems:"center",

    },
    title: {
        color:"#ffffff",
        fontSize:20,
        fontFamily : "Poppins_Medium",

    },
    size: {
        color:"#3FC3DD",
        fontSize:14,
        fontFamily:"Poppins_Medium",
        bottom:2
    },
    emptyButton: {
        width:24,
        height:24,
        borderRadius:9,
        borderWidth:3,
        borderColor:"white",
        backgroundColor:"#3FC3DD",
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center",
        marginRight:20
    },
    innerButton: {
        width:14,
        height:14,
        borderRadius:4,
        backgroundColor:"white"
    }


});
