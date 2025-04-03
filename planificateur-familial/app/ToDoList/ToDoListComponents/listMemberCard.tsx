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
import ConfirmDeleteModal from "@/components/modal/confirmDeleteModal";
import {doc, getDoc} from "@firebase/firestore";
import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {User} from "@/types/user";


const ListMemberCard: React.FC<{ user : User, handler : () => void }> = ({ user, handler}) => {
    const ownerCard = FIREBASE_AUTH.currentUser?.uid == user.id;
    const tag = ownerCard ? " (Vous)" : null;



    return (
        <View style={styles.cardWrapper}>
            <View style={styles.userDataContainer}>
                <Text style={styles.text}>{user.name}{tag}</Text>
            </View>
            {!ownerCard && <TouchableOpacity style={styles.button} onPress={handler}>
                <View style={styles.buttonIcon}></View>

            </TouchableOpacity>}
        </View>

    );
};


export default ListMemberCard;
const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    cardWrapper: {
        width:(ScreenWidth-(3*30))/2.2,
        height:43,
        borderRadius:16,
        borderWidth:4,
        borderColor:"#004B5A",
        marginVertical:6,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    pp: {
        width:32,
        height:32,
        borderRadius:30
    },
    userDataContainer: {
        flexDirection:"row",
        marginLeft:10
    },
    button: {
        width:29,
        height:29,
        borderRadius:10,
        backgroundColor:"#ffffff",
        marginRight:3,
        borderColor:"#004B5A",
        borderWidth:3,
    },
    buttonIcon: {
        position:"absolute",
        width:11,
        height:3,
        borderRadius:1,
        backgroundColor:"#004B5A",
        alignSelf:"center",
        margin:"auto",
        marginTop:10
    },
    text: {
        fontFamily:"Poppins_SemiBold",
        marginTop:3,

    }


});
