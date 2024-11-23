import React from 'react'
import {StyleSheet, View, Text, Image} from "react-native";

type Props = {
    text: string;
    isChecked: boolean;
};

const Task = ({ text, isChecked }: Props) => {
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
        marginTop:15,
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
    }

    }
)
export default Task;