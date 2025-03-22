
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
import {white} from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const ListCard = () => {
    return (
        <View style={styles.card}>
            <View>
                <Text style={styles.title}>Liste de course</Text>
                <View style={styles.sizeBg}>
                    <Text style={styles.size}>8 élements</Text>
                </View>
            </View>
            <Image style={styles.arrow} source={require("@/assets/images/arrowLeft.png")}></Image>
        </View>
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
