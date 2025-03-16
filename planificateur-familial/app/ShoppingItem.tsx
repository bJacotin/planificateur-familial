
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    StatusBar,
    Image, Platform, KeyboardAvoidingView, Button, FlatList
} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "@/components/Header";
import {router, usePathname} from "expo-router";
import {useLocalSearchParams} from "expo-router/build/hooks";
import {FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {addDoc, collection, doc, getDoc, getDocs, where} from "@firebase/firestore";
import {query} from "@firebase/database";
import Product from "@/components/Product";


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;


type ShoppingItem = {
    title: string;
    quantity: number;
    magasin: string;
    isChecked: boolean;
};


       
const { id } = useLocalSearchParams() as { id: string };
console.log("ID récupéré :", id);

export default function Todo() {
    const [itemTitle, setitemTitle] = useState<string>("");
    const [magasin, setMagasin] = useState<string>("");
    const [detail, setDetail] = useState<string>("");
    const [ShoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [cancel, setCancel] = useState<boolean>(false);
    const cancelRef = useRef(false);

 
    useEffect(() => {
        cancelRef.current = cancel;
    }, [cancel]);

    const completeItem = (index: number) => {
        const itemsCopy = [...ShoppingItems];
        itemsCopy[index].isChecked = !itemsCopy[index].isChecked;
        setShoppingItems(itemsCopy);
    };

    const requestDeleteItem = (index: number) => {
        let itemsCopy = [...ShoppingItems];
        setCancel(false);


        deleteItem(index)
        console.log("before modal", cancel)
        setDeleteModalVisible(true);
        setTimeout(() => {
            setDeleteModalVisible(false);
            console.log("before if cancel", cancelRef.current);
            if (cancelRef.current) {
                setShoppingItems(itemsCopy);
            }
            console.log("after if cancel", cancelRef.current);
            setCancel(false);
        }, 3000);


    };

    const deleteItem = (index: number) => {
        let itemsCopy = [...ShoppingItems];
        itemsCopy.splice(index, 1);
        setShoppingItems(itemsCopy)
    }

    const handleCancelPress = () => {
        console.log("cancel clicked", cancel)
        setCancel(true)
        console.log("cancel clicked", cancel)
        setDeleteModalVisible(false)
    };

    const pathname = usePathname();

    console.log(pathname)
    const [Items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Charger les tâches au démarrage de l'application
    useEffect(() => {
        loadItems(id);
    }, [id]);

    // Sauvegarder les tâches quand taskItems change
    useEffect(() => {
        saveShoppingItems();
    }, [ShoppingItems]);


    const loadItems = async (id: string)=> {

        try {
            const listRef = doc(FIREBASE_FIRESTORE, "shoppingLists", id);
            const itemsRef = collection(listRef, "shoppingItems");
    
            const querySnapshot = await getDocs(itemsRef);
            const loadedItems = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            setShoppingItems(loadedItems);
        } catch (error) {
            console.error("Erreur lors du chargement des articles", error);
        }
    };

    const addShoppingItem = async () => {
        try {
            if (!itemTitle || !detail || !magasin) {
                console.error("Le titre, la quantité et le magasin sont obligatoires.");
                return;
            }
    
            const newItem: ShoppingItem = {
                title: itemTitle,   
                quantity: parseInt(detail),
                magasin: magasin,
                isChecked: false,
            };
    
            const listRef = doc(FIREBASE_FIRESTORE, "shoppingLists", id);
            const itemsRef = collection(listRef, "shoppingItems");

            await addDoc(itemsRef, newItem);
    
            // Réinitialiser les champs du formulaire
            console.log("Article ajouté avec succès !");
            setitemTitle("");
            setDetail("");
            setMagasin("");
            setShoppingItems([...ShoppingItems, newItem]);
            setModalVisible(false);
        } catch (error) {
            console.log("ID récupéré :");
            console.error("Erreur lors de l'ajout de l'article :", error);
        }
    };
    

    const saveShoppingItems = async () => {
        try {
            await AsyncStorage.setItem('shoppingItems', JSON.stringify(ShoppingItems));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des tâches', error);
        }
    };

    const progressAnim = useRef(new Animated.Value(100)).current; // Valeur initiale 100%

    useEffect(() => {
        if (deleteModalVisible) {

            Animated.timing(progressAnim, {
                toValue: 0,
                duration: 3000,
                useNativeDriver: false,
            }).start(() => {

                setDeleteModalVisible(false);
            });
        } else {

            progressAnim.setValue(100);
        }
    }, [deleteModalVisible]);

    const settingslist = [
        { id: '1', date: 'Quantité', icon: require('@/assets/images/agenda.png') },
        { id: '2', date: 'Magasin', icon: require('@/assets/images/Todo.png') },
    ];

    const closeModal = () => {
        Keyboard.dismiss();
        setModalVisible(false);
    };
    return (
        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={{height: ScreenHeight * 0.36, marginTop: 25}}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#4FE2FF"/>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={[{zIndex: 4}, {position: 'absolute'}]}>
                    <LinearGradient
                        colors={['#4FE2FF', '#4FE2FF']}
                        style={styles.buttonWrap}
                        start={{x: 1, y: -0.2}}
                        end={{x: 0, y: 1}}
                    >
                        <Image source={require("@/assets/images/arrowLeft.png")}/>
                    </LinearGradient>
                </TouchableOpacity>
            
            </View>
            <Text style={styles.shoppingText}>Listes de</Text>
            <Text style={styles.shoppingText}>Courses</Text>

            <Image source={require('@/assets/images/Group20.png')} style={styles.imgTukki}/>

            <View style={styles.container}>
                <ScrollView style={{marginTop: 6}}>

                    {ShoppingItems
                    .map((item: ShoppingItem, index) => {
                        return (
                            <TouchableOpacity key={index}
                                              onPress={() => completeItem(index)}
                                              onLongPress={() => requestDeleteItem(index)}>
                                <Product title={item.title} quantity={item.quantity} magasin={item.magasin} isChecked={item.isChecked} />
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>

                <TouchableOpacity style={styles.newTaskButton} onPress={(): void => setModalVisible(true)}>
                    <Text style={styles.buttonLabel}>+</Text>
                </TouchableOpacity>
            </View>

            <Modal
                statusBarTranslucent={true}
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => closeModal()}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.modalView}
                        >
                            <TextInput
                                placeholder="Nom de l'article"
                                style={styles.titleInput}
                                value={itemTitle}
                                onChangeText={setitemTitle}
                            />
                            <TextInput
                                placeholder="Quantité"
                                style={styles.titleInput}
                                keyboardType="numeric"
                                value={detail}
                                onChangeText={setDetail}
                            />
                            <TextInput
                                placeholder="Magasin"
                                value={magasin}
                                onChangeText={setMagasin}
                                style={styles.titleInput}
                            />
                            
                            <TouchableOpacity 
                                style={styles.addTaskButton} 
                                onPress={addShoppingItem}
                            >
                                <Text style={styles.addTaskButtonText}>Ajouter</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            
        </LinearGradient>


    );
}

const styles = StyleSheet.create({

    mainCard: {
        alignSelf: "center",
        width: '100%',
        height: '95%',
        backgroundColor: 'red',
        marginBottom: 15,
        borderRadius: 30,
        padding: 10,

        elevation: 10
    },

    container: {
        elevation: 100,
        backgroundColor: '#EBEBEB',
        width: ScreenWidth,
        height: ScreenHeight,
        marginTop: 7,
        borderRadius: 35,
        paddingTop: ScreenWidth * 0.1

    },
    titre: {
        fontSize: 38,
        fontWeight: "bold"
    },


    titleContainer: {
        backgroundColor: '#EBEBEB',
        alignSelf: "center",
        display: "flex",
        flexDirection: "row",

    },
    headerDetails: {
        fontSize: 10,
        marginTop: 10,
        marginLeft: 10
    },
    title: {
        color: '#3D3D3D',
        fontSize: 30,
        alignSelf: "center",
        fontFamily: "Poppins_SemiBold",
    },
    newTaskButton: {
        position: "absolute",
        top: ScreenHeight * 0.66,
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
    modalContainer: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: '85%',

        borderRadius: 30,
        paddingTop: 20,
        padding: 10,
        alignItems: 'center',
        elevation: 30
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15
    },
    modalInput: {
        width: '60%',
        height: 55,
        backgroundColor: 'white',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderWidth: 2,
        borderBottomWidth: 5,

        borderRadius: 5,
        padding: 10,
        marginBottom: 20
    },

    addTaskWrapper: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",


    },
    sectionNameLabel: {
        marginTop: 3,
        fontFamily: "Poppins_Medium",
        fontSize: 12,
        textAlign: "center"

    },
    sectionNameContainer: {
        height: 55,
        width: "35%",
        backgroundColor: 'white',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderWidth: 2,
        borderBottomWidth: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

    },
    addTaskButton: {
        height: 50,
        width: "35%",
        alignSelf: "center",
        backgroundColor: "#4FE2FF",
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderWidth: 2,
        borderBottomWidth: 5,

    },
    addTaskButtonText: {
        marginTop: 3,
        fontFamily: "Poppins_Medium",
        fontSize: 12,
        textAlign: "center"
    },
    quitButton: {
        position: "relative",
        start: 0
    },
    cancelModalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    cancelModalContent: {
        borderWidth: 2,
        backgroundColor: 'white',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    progressBarContainer: {
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    gradientBar: {
        height: '100%',
    },
    header: {
        height: 100,
        justifyContent: 'center'
    },

    buttonWrap: {
        height: 60,
        width: 80,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        zIndex: 4,
    },
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
    descriptionInput: {
        paddingHorizontal:30,
        marginTop:-20,
        marginBottom: -10,
        width: '100%',
        fontFamily:"Poppins_SemiBold",
        fontSize:20,
        opacity:0.6
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

    shoppingText: {
        fontSize: 25,
        fontFamily: 'Poppins_Bold',
        color:'white',
        left:30,
        zIndex:4,
        marginTop: -ScreenHeight * 0.02,
    },

    imgTukki: {
        position: 'absolute',
        top: ScreenHeight * 0.06,
        left: ScreenWidth * 0.6,
        width: 120,
        height: 100,
        zIndex: 2,
    },

    parameterContainer: {
        borderColor:'#004B5A',
        height:50,
        width:170,
        justifyContent:"flex-start",
        alignItems:'center',
        borderRadius:15,
        borderWidth:4,
        flexDirection:"row",
        margin:10
    },
    textScrollList: {
        color:'#004B5A',
        fontFamily:"Poppins_Medium",
        marginLeft:10,
        marginRight:10,
        marginTop:4
    }


});
