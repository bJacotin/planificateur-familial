import React from 'react'
import {StyleSheet, View, Text, Image} from "react-native";

type Props = {
    title: string;
    isChecked: boolean;
    details: string;
};

const Task = ({ title, isChecked, details }: Props) => {
    return (
        <View style = {styles.taskContainer}>
            <View style = {styles.leftContainer}>
                <Image
                    style={styles.checkButton}
                    source={
                        isChecked
                            ? require("@/assets/images/checkedCircle.png")
                            : require("@/assets/images/uncheckedCircle.png")
                    }

                />
                <View style={styles.taskDataContainer}>
                    <Text numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.title}>{title}</Text>
                    <Text numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.details}>{details}</Text>
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    leftContainer: {
        flexDirection: "row",
        alignItems: 'center',
        maxWidth:'80%'
    },
    taskContainer: {
        marginTop:8,
        backgroundColor: '#FFFFFF',
        height: 60,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        flexDirection:"row",
        justifyContent: 'space-between',
        padding:10,
        elevation:5,
        margin:10,
        borderWidth:2,
        borderBottomWidth:5,

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
        marginRight:10
    },
    title: {
        marginTop:4,
        fontFamily:"Poppins_Medium",
        fontSize : 14,
        textAlign:"left",
        //backgroundColor:"red",
        height:22

    },
    details: {
        marginLeft:10,
        fontFamily:"Poppins_Regular",
        fontSize : 10,
        textAlign:"left",
        color:"grey",

        //backgroundColor:"green"
    },
    taskDataContainer: {
        alignItems:"flex-start",

        //backgroundColor:"yellow"
    }


    }
)
export default Task;