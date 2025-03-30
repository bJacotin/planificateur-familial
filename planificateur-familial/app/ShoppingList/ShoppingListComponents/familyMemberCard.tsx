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
const ScreenWidth = Dimensions.get('window').width;

const FamilyMemberCard: React.FC<{ userId : string }> = ({ userId }) => {



    return (
        <View style={styles.cardWrapper}>
            <View style={styles.userDataContainer}>

                <Text> Test</Text>
            </View>
            <TouchableOpacity style={styles.button}>
                <View style={styles.buttonIcon}></View>
                <View style={[styles.buttonIcon, { transform: [{ rotate: '90deg' }] }]}></View>
            </TouchableOpacity>
        </View>

    );
};


export default FamilyMemberCard;

const styles = StyleSheet.create({
    cardWrapper: {
        width:(ScreenWidth-(3*30))/2.2,
        height:43,
        borderRadius:16,
        borderWidth:4,
        borderColor:"#004B5A",
        marginVertical:6,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    pp: {
        width:32,
        height:32,
        borderRadius:30
    },
    userDataContainer: {
        flexDirection:"row",
        marginLeft:10
    },
    button: {
        width:29,
        height:29,
        borderRadius:10,
        backgroundColor:"#ffffff",
        marginRight:3,
        borderColor:"#004B5A",
        borderWidth:3,
    },
    buttonIcon: {
        position:"absolute",
        width:11,
        height:3,
        borderRadius:1,
        backgroundColor:"#004B5A",
        alignSelf:"center",
        margin:"auto",
        marginTop:10
    }


});
