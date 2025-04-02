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


import {FIREBASE_AUTH} from "@/FirebaseConfig";
import {User} from "@/types/user";
import {Category} from "@/app/ShoppingList/ShoppingListTypes/shoppingListsTypes";
const ScreenWidth = Dimensions.get('window').width;

const CategoryCard: React.FC<{selectedCategory: Category|null, category: Category, setCategory : (category: Category | null) => void }> = ({ category, setCategory,selectedCategory }) => {

    const checked = selectedCategory ? category.id === selectedCategory.id : false;
    const handleCheckPress = () => {
        if (checked) {
            setCategory(null)
        } else {
            setCategory(category)
        }
    };
    return (
        <View style={styles.cardWrapper}>
            <View style={styles.categoryDataContainer}>
                <Text>{category.name}</Text>
            </View>
            <TouchableOpacity style={styles.emptyButton} onPress={() => handleCheckPress()}>
                {!checked && <View style={styles.innerButton} />}
            </TouchableOpacity>
        </View>
    );
};


export default CategoryCard;

const styles = StyleSheet.create({
    cardWrapper: {
        width:"100%",
        height:43,
        borderRadius:16,
        borderWidth:4,
        borderColor:"#004B5A",
        marginVertical:4,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    categoryDataContainer: {
        flexDirection:"row",
        marginLeft:10
    },

    text: {
        fontFamily:"Poppins_SemiBold",
        marginTop:3,

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
