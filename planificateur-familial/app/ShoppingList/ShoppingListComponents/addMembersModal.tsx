import React, {useEffect, useState} from 'react';
import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {
    Modal,
    View,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    FlatList,
    TouchableOpacity,
    Image,
    Text,
    Platform, StyleSheet, Dimensions, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {createShoppingList} from "@/app/ShoppingList/shoppingListController";
import MemberCard from "@/app/ShoppingList/ShoppingListComponents/listMemberCard";
import {doc, getDoc} from "@firebase/firestore";
import FamilyMemberCard from "@/app/ShoppingList/ShoppingListComponents/familyMemberCard";
import ListMemberCard from "@/app/ShoppingList/ShoppingListComponents/listMemberCard";
import {User} from "@/types/user";
const ScreenWidth = Dimensions.get('window').width;

interface AddMembersModalProps {
    membersModalVisible: boolean;
    setMembersModalVisible: (visible: boolean) => void;
    membersList: User[];
    familyMembersList: User[];
    setMembersList: (members: any[]) => void;
    setFamilyMembersList: (members: any[]) => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({membersModalVisible , setMembersModalVisible, familyMembersList, membersList,setMembersList, setFamilyMembersList}) => {


    const handleClosePress =() => {

    }

    return (
        <Modal
            statusBarTranslucent={true}
            animationType="slide"
            transparent={true}
            visible={membersModalVisible}
            onRequestClose={() => setMembersModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalView}
                    >
                        <View>
                            <Text style={styles.text}>Membres de la Liste</Text>
                            <View style={styles.listMembersSection}>
                                {membersList.map(member => (
                                    <ListMemberCard key={member.id} user={member} />))}
                            </View>
                        </View>
                        <View>
                            <Text style={styles.text}>Votre Famille</Text>
                            <View style={styles.familyMembersSection}>
                                {familyMembersList.map(member => (
                                    <ListMemberCard key={member.id} user={member} />))}
                            </View>
                        </View>


                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButtonWrapper} onPress={()=> setMembersModalVisible(false)}>
                                <Text style={styles.cancelText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButtonWrapper} onPress={() => handleClosePress()}>
                                <Text style={styles.deleteText}>Confirmer</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: "center",
        alignItems:"center"
    },
    modalView: {
        padding:30,
        backgroundColor: 'white',
        justifyContent:"space-between",
        paddingTop:15,
        borderRadius:35,
        elevation: 5,
        height:540,
        width:ScreenWidth*0.88
    },
    titleInput: {
        width: '100%',
        fontFamily:"Poppins_SemiBold",
        fontSize:28,
        paddingHorizontal:30,
    },
    iconScrollList: {
        width:30,
        height:30,
        marginLeft:10,
    },
    confirmContainer: {
        borderColor:'#004B5A',
        backgroundColor:'#004B5A',
        height:50,
        width:(ScreenWidth-(3*30))/3,
        justifyContent:"center",
        alignItems:'center',
        borderRadius:15,
        borderWidth:4,
        flexDirection:"row",
    },
    confirmText: {
        color:'#ffffff',
        fontFamily:"Poppins_Medium",
        marginLeft:10,
        marginRight:10,
        marginTop:4
    },
    buttonContainer: {
        flexDirection:"row",
        justifyContent:"space-between"
    },
    cancelButtonWrapper: {
        borderColor:'#004B5A',
        height:50,
        width:(ScreenWidth-(3*30))/2.2,
        justifyContent:"center",
        alignItems:'center',
        borderRadius:15,
        borderWidth:4,
        flexDirection:"row",
    },
    deleteButtonWrapper: {
        borderColor:'#004B5A',
        backgroundColor:'#004B5A',
        height:50,
        width:(ScreenWidth-(3*30))/2.2,
        justifyContent:"center",
        alignItems:'center',
        borderRadius:15,
        flexDirection:"row",
    },
    deleteText: {
        color:'#ffffff',
        fontFamily:"Poppins_Medium",
        marginLeft:10,
        marginRight:10,
        marginTop:4
    },
    cancelText: {
        color:'#004B5A',
        fontFamily:"Poppins_Medium",
        marginLeft:10,
        marginRight:10,
        marginTop:4
    }, listMembersSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    familyMembersSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",

    },
    text: {
        fontSize:28,
        fontFamily:"Poppins_SemiBold",
        lineHeight:34
    },
    memberWrapper: {
        height:38,
        width:"100%",
        borderRadius:16,
        borderWidth:3,
        borderColor:"#004B5A",
        justifyContent:"center",
        alignItems:"stretch",
        paddingTop:1
    },
    nameText: {
        fontSize:13,
        fontFamily:"Poppins_Medium",
    }

});
export default AddMembersModal;