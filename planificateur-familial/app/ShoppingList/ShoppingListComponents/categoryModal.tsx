import React, {useEffect, useRef, useState} from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {createCategory, listenToCategories} from "@/app/ShoppingList/shoppingListController";
import FamilyMemberCard from "@/app/ShoppingList/ShoppingListComponents/familyMemberCard";
import CategoryCard from "@/app/ShoppingList/ShoppingListComponents/categoryCard";
import {Category} from "@/app/ShoppingList/ShoppingListTypes/shoppingListsTypes";
const ScreenWidth = Dimensions.get('window').width;

interface CategoryModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    category: Category | null;
    setCategory: (category: Category | null)=> void;
    listId: string
}



const CategoryModal: React.FC<CategoryModalProps> = ({ modalVisible, setModalVisible, category, setCategory, listId }) => {
    const lastCat = useRef(category)
    const [categoryName,setCategoryName] = useState("")
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const unsubscribe = listenToCategories(listId, (newCategories) => {
            setCategories(newCategories);
        });

        return () => unsubscribe();
    }, [listId]);
    const handleCancelPress = () => {
        setCategory(lastCat.current)
        setModalVisible(false)
    };
    const handleConfirmPress = () => {
        setModalVisible(false)
        lastCat.current = category;
    };
    return(
        <Modal
            statusBarTranslucent={true}
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <TouchableWithoutFeedback onPress={() => {}} style={styles.modalOverlay}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.text}>Catégorie</Text>
                        <View style={styles.createCatContainer}>
                            <TextInput
                            value={categoryName}
                            placeholder={"Nom de la Catégorie"}
                            style={styles.textInput}
                            onChangeText={(text)=>setCategoryName(text)}>
                            </TextInput>
                            <TouchableOpacity style={styles.button} onPress={()=>createCategory(categoryName,listId )}>
                                <View style={styles.buttonIcon}></View>
                                <View style={[styles.buttonIcon, { transform: [{ rotate: '90deg' }] }]}></View>
                            </TouchableOpacity>
                        </View>
                        {categories && categories.map((categoryData: Category) => (
                            <CategoryCard
                                key={categoryData.id}

                                category={categoryData}
                                selectedCategory={category}
                                setCategory={setCategory}
                            />
                        ))}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButtonWrapper} onPress={()=> handleCancelPress()}>
                                <Text style={styles.cancelText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButtonWrapper} onPress={() => handleConfirmPress()}>
                                <Text style={styles.deleteText}>Confirmer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}


const styles = StyleSheet.create({
    modalOverlay: {
        flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent:"center"

    },
    modalView: {
        justifyContent:"space-between",
        backgroundColor: 'white',
        padding:35,
        minHeight:240,
        width:0.88*ScreenWidth,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        elevation: 5,
        marginHorizontal:"auto"
    },
    text: {
        fontSize:28,
        fontFamily:"Poppins_SemiBold",
        lineHeight:34,
        color:"#004B5A"
    },
    button: {
        width:40,
        height:40,
        borderRadius:15,
        backgroundColor:"#004B5A",
        marginRight:3
    },
    buttonIcon: {
        marginTop:18,
        position:"absolute",
        width:11,
        height:3,
        borderRadius:1,
        backgroundColor:"white",
        alignSelf:"center",
        margin:"auto"
    },
    buttonContainer: {
        flexDirection:"row",
        justifyContent:"space-between",
        marginTop:40
    },
    cancelButtonWrapper: {
        borderColor:'#004B5A',
        height:50,
        width:(ScreenWidth-(3*30))/2.35,
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
        width:(ScreenWidth-(3*30))/2.35,
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
    },
    createCatContainer: {
        marginVertical:9,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    textInput: {
        borderRadius:15,
        borderColor:"#004B5A",
        borderWidth:3,
        height:40,
        width:ScreenWidth*0.58,
        paddingTop:6,
        paddingBottom:6
    }

});

export default CategoryModal;