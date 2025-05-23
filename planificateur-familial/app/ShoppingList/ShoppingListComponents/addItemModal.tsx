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
import {createShoppingList, createShoppingListItem} from "@/app/ShoppingList/shoppingListController";
import {ShoppingListItem} from "@/app/ShoppingList/ShoppingListTypes/shoppingListsTypes";
import QuantityModal from "@/app/ShoppingList/ShoppingListComponents/quantityModal";
import CategoryModal from "@/app/ShoppingList/ShoppingListComponents/categoryModal";
const ScreenWidth = Dimensions.get('window').width;

interface AddTaskModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    listId: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ modalVisible, setModalVisible, listId }) => {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState(null)
    const [quantityModalVisible,setQuantityModalVisible] = useState(false);
    const [categoryModalVisible,setCategoryModalVisible] = useState(false);
    const handleQuantityPress = () => {
        setQuantityModalVisible(true)
    };
    const handleCreateItem = async () => {
        if (!itemName.trim()) {
            console.error("Le titre de la liste ne peut pas être vide.");
            return;
        }

        try {
            const userId = FIREBASE_AUTH.currentUser?.uid;
            if (!userId) {
                console.error("Utilisateur non connecté.");
                return;
            }
            const categoryId = category ? category.id : null;
            const newItem: ShoppingListItem = {
                id: Date.now().toString(),
                name: itemName,
                quantity: quantity,
                checked: false,
                category: categoryId,
            };
            const itemId = await createShoppingListItem(listId, newItem);
            if (itemId) {
                console.log("Item crée avec succès !");
                setItemName("");
                setModalVisible(false);
            }
        } catch (error) {
            console.error("Erreur lors de la création de la liste :", error);
        }
    };

    function handleCategoryPress() {
        setCategoryModalVisible(true)
    }

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
                        <TextInput placeholder="Nom de l'item"
                                   style={styles.titleInput}
                                   value={itemName}
                                   onChangeText={setItemName}/>
                        <LinearGradient
                            colors={['#4FE2FF', '#004B5A', '#002C35']}
                            locations={[0, 0.8, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ width: '100%', height: 10 }}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.parameterContainer} onPress={() => handleQuantityPress()}>
                                <Text style={styles.textScrollList}>Quantité</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.parameterContainer} onPress={() => handleCategoryPress()}>
                                <Text style={styles.textScrollList}>Catégorie</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmContainer} onPress={() => handleCreateItem()}>
                                <Text style={styles.confirmText}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
            <QuantityModal modalVisible={quantityModalVisible}
                           setModalVisible={setQuantityModalVisible}
                           quantity={quantity}
                           setQuantity={setQuantity}
            ></QuantityModal>
            <CategoryModal listId={listId} category={category} setCategory={setCategory} setModalVisible={setCategoryModalVisible} modalVisible={categoryModalVisible}></CategoryModal>
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
        width:(ScreenWidth-(3*30))/2.7,
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
        marginTop:4,
        textAlign:"center",
        marginHorizontal:"auto"
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
        paddingHorizontal:30,
        paddingVertical:15,
        justifyContent:"space-between"
    }
});
export default AddTaskModal;