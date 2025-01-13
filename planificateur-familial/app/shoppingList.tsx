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
    Image
  } from "react-native";
  import { LinearGradient } from 'expo-linear-gradient';
  import { useState, useEffect } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
  
  type ShoppingItem = {
    name: string;
    quantity: string;
    isBought: boolean;
  };
  
  export default function ShoppingListApp() {
    const [itemName, setItemName] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
  
    useEffect(() => {
        loadShoppingList();
    }, []);
  
    useEffect(() => {
        saveShoppingList();
    }, [shoppingList]);
  
    const addItem = () => {
        if (itemName.trim().length > 0 && quantity.trim().length > 0) {
            Keyboard.dismiss();
            setShoppingList([...shoppingList, { name: itemName, quantity, isBought: false }]);
            setItemName("");
            setQuantity("");
            setModalVisible(false);
        }
    };
  
    const toggleBoughtStatus = (index: number) => {
        const updatedList = [...shoppingList];
        updatedList[index].isBought = !updatedList[index].isBought;
        setShoppingList(updatedList);
    };
  
    const deleteItem = (index: number) => {
        const updatedList = [...shoppingList];
        updatedList.splice(index, 1);
        setShoppingList(updatedList);
    };
  
    const loadShoppingList = async () => {
        try {
            const savedList = await AsyncStorage.getItem('shoppingList');
            if (savedList !== null) {
                setShoppingList(JSON.parse(savedList));
            }
        } catch (error) {
            console.error('Erreur lors du chargement de la liste', error);
        }
    };
  
    const saveShoppingList = async () => {
        try {
            await AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la liste', error);
        }
    };
  
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <LinearGradient
                colors={['#C153F8', '#E15D5A']}
                style={styles.header}
            >
            <Text style={styles.headerTitle}>Ma Liste de Courses</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Image source={require('../assets/images/arrowLeft.png')} style={{ width: 42, height: 60 }} />
            </TouchableOpacity>
            </LinearGradient>
            <View style={styles.container}>
                <ScrollView>
                    {shoppingList.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => toggleBoughtStatus(index)}
                            onLongPress={() => deleteItem(index)}
                        >
                            <View style={[styles.itemContainer, item.isBought && styles.itemBought]}>
                                <Image
                                    source={item.isBought ? require('../assets/images/checkedCircle.png') : require('../assets/images/uncheckedCircle.png')}
                                    style={{ width: 24, height: 24, marginLeft: 10, marginRight: 10 }}
                                />
                                <Text style={styles.itemText}>
                                    {item.name} ({item.quantity})
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <LinearGradient
                        colors={['#C153F8', '#E15D5A']}
                        style={styles.newItemButton}
                    >
                        <Text style={styles.buttonText}>Ajouter un Article</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
  
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Nouvel Article</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nom de l'article"
                                    value={itemName}
                                    onChangeText={setItemName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Quantité"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                />
                                <TouchableOpacity onPress={addItem}>
                                    <LinearGradient
                                        colors={['#C153F8', '#E15D5A']}
                                        style={styles.addItemButton}
                                    >
                                        <Text style={styles.addItemText}>Ajouter</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    header: {
        padding: 30,
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        left: 5,
        top: 5,
        padding: 10,
        borderRadius: 5,
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 5,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        elevation: 5,
        borderWidth: 2,
        borderBottomWidth: 5,
        
    },
    itemBought: {
        backgroundColor: '#D1FAD7',
        textDecorationLine: 'line-through',
    },
    itemText: {
        fontSize: 16,
    },
    newItemButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#F0F0F0',
        padding: 10,
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomRightRadius:35,
        borderBottomLeftRadius:35,
        borderWidth:2,
        borderBottomWidth:5,
  
        borderRadius: 5,
        marginBottom: 10,
    },
    addItemButton: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    addItemText: {
        color: 'white',
        fontWeight: 'bold',
    },
  });
  