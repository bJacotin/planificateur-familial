import { LinearGradient } from "expo-linear-gradient";
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type shoppingList = {
    id: number;
    name: string;
    ShoppingItems: ShoppingItem[];
};

type ShoppingItem = {
    id: number;
    title: string;
    quantity: number;
    magasin: string;
    isChecked: boolean;
};

const ShoppingListCard = () => {
    const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
    const [newItem, setNewItem] = useState<string>("");
    const [newQuantity, setNewQuantity] = useState<string>("1");

    useEffect(() => {
        loadShoppingList();
    }, []);

    useEffect(() => {
        saveShoppingList();
    }, [shoppingItems]);

    const loadShoppingList = async () => {
        try {
            const savedList = await AsyncStorage.getItem('shoppingLists');
            if (savedList !== null) {
                setShoppingItems(JSON.parse(savedList));
            }
        } catch (error) {
            console.error('Erreur lors du chargement de la liste', error);
        }
    };

    const saveShoppingList = async () => {
        try {
            const savedList = await AsyncStorage.getItem('shoppingLists');
            const parsedList = savedList ? JSON.parse(savedList) : [];
    
            if (JSON.stringify(parsedList) !== JSON.stringify(shoppingItems)) {
                await AsyncStorage.setItem('shoppingLists', JSON.stringify(shoppingItems));
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde', error);
        }
    };

    const addItem = () => {
        if (newItem.trim() === "") return;
        setShoppingItems([...shoppingItems, {
            id: Date.now(),  
            title: newItem,             
            quantity: parseInt(newQuantity),
            magasin: "",                
            isChecked: false        
        }]);
        setNewItem("");
        setNewQuantity("1");
    };

    const toggleChecked = (id: number) => {
        setShoppingItems(prevItems => prevItems.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const deleteItem = (id: number) => {
        setShoppingItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    return (
        <LinearGradient
            colors={['#53F8A1', '#5A9EE1']}
            start={{ x: 1, y: -0.2 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}>

            <ScrollView style={styles.listContainer}>
                {shoppingItems.map((item) => (
                    <TouchableOpacity key={item.id} onPress={() => toggleChecked(item.id)} onLongPress={() => deleteItem(item.id)}>
                        <View style={[styles.item, item.checked && styles.itemChecked]}>
                            <Text style={styles.itemText}>{item.quantity} × {item.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nouvel article"
                    value={newItem}
                    onChangeText={setNewItem}
                />
                <TextInput
                    style={styles.inputQuantity}
                    placeholder="Qté"
                    keyboardType="numeric"
                    value={newQuantity}
                    onChangeText={setNewQuantity}
                />
                <TouchableOpacity style={styles.addButton} onPress={addItem}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: 0.9 * screenWidth,
        height: 0.8 * screenHeight,
        alignSelf: "center",
        borderRadius: 25,
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    listContainer: {
        maxHeight: screenHeight * 0.6,
    },
    item: {
        backgroundColor: "white",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    itemChecked: {
        backgroundColor: "#a1f2a1",
    },
    itemText: {
        fontSize: 18,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    input: {
        flex: 2,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        marginRight: 5,
    },
    inputQuantity: {
        width: 50,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        textAlign: "center",
    },
    addButton: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        marginLeft: 5,
    },
    addButtonText: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default ShoppingListCard;
