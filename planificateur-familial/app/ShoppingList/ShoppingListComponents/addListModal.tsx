import React, {useState} from 'react';
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
    Platform, StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {createShoppingList} from "@/app/ShoppingList/shoppingListController";
const ScreenWidth = Dimensions.get('window').width;

interface AddTaskModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ modalVisible, setModalVisible }) => {
    const [listName, setListName] = useState("");

    const handleCreateList = async () => {
        if (!listName.trim()) {
            console.error("Le titre de la liste ne peut pas être vide.");
            return;
        }

        try {
            const userId = FIREBASE_AUTH.currentUser?.uid;
            if (!userId) {
                console.error("Utilisateur non connecté.");
                return;
            }

            const listId = await createShoppingList(listName, [userId]);
            if (listId) {
                console.log("Liste créée avec succès !");
                setListName("");
                setModalVisible(false);
            }
        } catch (error) {
            console.error("Erreur lors de la création de la liste :", error);
        }
    };
    return (
        <Modal
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
                        <TextInput placeholder="Titre de la liste"
                                   style={styles.titleInput}
                                   value={listName}
                                   onChangeText={setListName}/>
                        <LinearGradient
                            colors={['#4FE2FF', '#004B5A', '#002C35']}
                            locations={[0, 0.8, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ width: '100%', height: 10 }}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.parameterContainer}>
                                <Image style={styles.iconScrollList} source={require("@/assets/images/familyIcon.png")} />
                                <Text style={styles.textScrollList}>Membres</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmContainer} onPress={() => handleCreateList()}>
                                <Text style={styles.confirmText}>Valider</Text>
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
        width:(ScreenWidth-(3*30))/2,
        justifyContent:"flex-start",
        alignItems:'center',
        borderRadius:15,
        borderWidth:4,
        flexDirection:"row",
    },
    textScrollList: {
        color:'#004B5A',
        fontFamily:"Poppins_Medium",
        marginLeft:10,
        marginRight:10,
        marginTop:4
    },
    confirmContainer: {
        borderColor:'#004B5A',
        backgroundColor:'#004B5A',
        height:50,
        width:(ScreenWidth-(3*30))/2,
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
        paddingHorizontal:30,
        paddingVertical:15,
        justifyContent:"space-between"
    }
});
export default AddTaskModal;