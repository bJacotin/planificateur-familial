import React from 'react'
import {StyleSheet, View,Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
type Props = {
    text : string
}
const Task = ({text}: Props) => {
    return (
        <View style = {styles.taskContainer}>
            <View style = {styles.leftContainer}>
                <LinearGradient
                    colors={['#C153F8', '#E15D5A']} // Dégradé
                    style={styles.button}
                    start={{ x: 1, y: -0.2 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={styles.centerButton}></View>
                </LinearGradient>
                <Text >{text}</Text>
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
        marginTop:20,
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
    }


    }
)
export default Task;