import React from 'react'
import {StyleSheet, View, Text, Image} from "react-native";



type Props = {
    title: string;
    isChecked: boolean;
    details: string;
    date : string;
    importance: string;
};

const Task = ({ title, isChecked, details, date,importance}: Props) => {
    return (
        <View style = {styles.taskContainer}>
            <View style = {styles.leftContainer}>

                <View style={styles.taskDataContainer}>
                    <Text numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.title}>{title}</Text>
                    <Text numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.details}>{date}</Text>
                    <Text numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.details}>{details}</Text>
                    <Text numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[styles.details,{marginTop:0}]}>{importance}</Text>
                </View>
                <View
                    style={styles.checkButton}>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

        leftContainer: {
            flexDirection: "row",
            justifyContent: 'space-between',

            alignItems: 'center',
            width:'100%'
        },
        taskContainer: {
            backgroundColor: '#EBEBEB',
            height: 100,
            width: '100%',
            flexDirection:"row",
            justifyContent: 'space-between',
            elevation:5,



        },
        button: {

            height:20,
            width:20,
            borderRadius: 14,
            marginLeft:10,
            marginRight:10,
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
        },

        centerButton : {

            backgroundColor:'white',
            height:14,
            width:14,
            borderRadius: 7,
        },
        checkButton: {
            width:24,
            height:24,
            marginLeft:9,
            marginRight:20,
            borderRadius: 5,
            backgroundColor:"transparent",
            borderStyle:"solid",
            borderColor:"#3D3D3D",
            borderWidth:3,
            opacity:0.75,
        },
        title: {
            marginLeft:20,
            fontFamily:"Poppins_SemiBold",
            fontSize : 24,
            textAlign:"left",
            maxWidth: '90%',
        },
        details: {
            marginLeft:20,
            fontFamily:"Poppins_Regular",
            fontSize : 14,
            textAlign:"left",
            color:"grey",
            marginTop:-8,
            //backgroundColor:"green"
        },
        taskDataContainer: {
            alignItems:"flex-start",

            //backgroundColor:"yellow"
        }


    }
)
export default Task;