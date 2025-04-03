import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions, Animated
} from 'react-native';
import {Category, ShoppingListItem} from "@/app/ShoppingList/ShoppingListTypes/shoppingListsTypes";
import {FIREBASE_FIRESTORE} from '@/FirebaseConfig';
import {doc, getDoc} from 'firebase/firestore';

const ScreenWidth = Dimensions.get('window').width;
const UNCATEGORIZED: Category = {
    id: 'uncategorized',
    name: 'Sans catégorie'
};

const CategoryDropDownCard: React.FC<{
    listId: string;
    categoryId: string;
    dropped: boolean;
    setDropped: (dropped: boolean) => void;
    items: ShoppingListItem[];
}> = ({listId, categoryId, dropped, setDropped,items}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [category, setCategory] = useState<Category>(UNCATEGORIZED);
    const [progress, setProgress] = useState<number>(0);
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (items && items.length > 0) {
            const completedCount = items.filter(item => item.checked).length;
            const progressPercentage = (completedCount / items.length) * 100;

            Animated.timing(progressAnim, {
                toValue: progressPercentage,
                duration: 500,
                useNativeDriver: false
            }).start();

            setProgress(progressPercentage);
        } else {
            Animated.timing(progressAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }).start();
            setProgress(0);
        }
    }, [items]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const shoppingListDocRef = doc(FIREBASE_FIRESTORE, 'shoppingLists', listId);
                const shoppingListDoc = await getDoc(shoppingListDocRef);

                if (shoppingListDoc.exists()) {
                    const shoppingListData = shoppingListDoc.data();
                    if (shoppingListData.categories && Array.isArray(shoppingListData.categories)) {
                        const foundCategory = shoppingListData.categories.find(
                            (cat: Category) => cat.id === categoryId
                        );
                        if (foundCategory) {
                            setCategory(foundCategory);
                        } else {
                            console.log("Catégorie non trouvée dans le tableau");
                            setCategory(UNCATEGORIZED);
                        }
                    } else {
                        console.log("Aucun tableau categories trouvé");
                        setCategory(UNCATEGORIZED);
                    }
                } else {
                    console.log("Liste de courses non trouvée");
                    setCategory(UNCATEGORIZED);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la catégorie:", error);
                setCategory(UNCATEGORIZED);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [listId, categoryId]);
    const handleCheckPress = () => {
        setDropped(!dropped);
    };



    return (
        <View style={styles.cardWrapper}>
            <View style={styles.categoryDataContainer}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.progressBar}>
                    <Animated.View
                        style={[
                            styles.progressBarStatus,
                            {
                                width: progressAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%']
                                })
                            }
                        ]}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={handleCheckPress}>
                <Image
                    source={require("@/assets/images/arrowBlue.png")}
                    style={[styles.arrowIcon, dropped && styles.arrowIconRotated]}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        left:-4,
        width: 333,
        height: 62,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 35,
        borderWidth: 4,
        borderColor: "#3FC3DD",
        marginVertical: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        backgroundColor: 'white',
        marginBottom:17,
        elevation:4
    },
    categoryDataContainer: {
        flexDirection: "column",
        marginLeft: 10,
        flex: 1,
    },
    categoryName: {
        color:"#3FC3DD",
        fontSize:18,
        fontFamily : "Poppins_Medium"
    },
    arrowIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        transitionDuration: '0.3s',
        transform: [{ rotate: '270deg' }]
    },
    arrowIconRotated: {
        transform: [{ rotate: '0deg' }]
    },
    emptyButton: {
        width: 24,
        height: 24,
        borderRadius: 9,
        borderWidth: 3,
        borderColor: "white",
        backgroundColor: "#3FC3DD",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginRight: 20
    },
    innerButton: {
        width: 14,
        height: 14,
        borderRadius: 4,
        backgroundColor: "white"
    },
    progressBar: {
        width:250,
        height:11,
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        backgroundColor:"#C5F6FF",
        marginBottom:2
    },
    progressBarStatus: {
        backgroundColor:"#3FC3DD",
        height:11,
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        width:30
    }
});

export default CategoryDropDownCard;