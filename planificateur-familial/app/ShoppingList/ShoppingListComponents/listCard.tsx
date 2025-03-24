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

import { ShoppingList } from '../ShoppingListTypes/shoppingListsTypes';

const ListCard: React.FC<{ list: ShoppingList; onPress: () => void }> = ({ list, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View>
                <Text style={styles.title}>{list.name}</Text>
                <View style={styles.sizeBg}>
                    <Text style={styles.size}>{list.items.length} éléments</Text>
                </View>
            </View>
            <Image style={styles.arrow} source={require("@/assets/images/arrowLeft.png")} />
        </TouchableOpacity>
    );
};


export default ListCard;

const styles = StyleSheet.create({
    card: {
        alignSelf:"center",
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        backgroundColor:"#3FC3DD",
        width:330,
        height:62,
        marginTop:25,
        paddingLeft:36,
        elevation:5,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    arrow: {
        transform: [{ rotate: '180deg' }],
        height:44,
        width:51,
        marginTop:8

    },
    sizeBg: {
        backgroundColor:"#ffffff",
        marginBottom:4,
        width:100,
        height:18,
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        borderBottomLeftRadius:35,
        borderBottomRightRadius:35,
        justifyContent:"center",
        alignItems:"center",

    },
    title: {
        color:"#ffffff",
        fontSize:20,
        fontFamily : "Poppins_Medium",

    },
    size: {
        color:"#3FC3DD",
        fontSize:14,
        fontFamily:"Poppins_Medium",
        bottom:2
    }

});
