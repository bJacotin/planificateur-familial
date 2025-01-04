
import {StyleSheet, View, Text, Image, Dimensions} from "react-native";

type Props = {
    title: string;
    isChecked: boolean;
    description: string;
    creationDate: Date|null;
    endingDate : Date|null;
    favorite : boolean;
    priority: number;
};
const Task = ({ title, isChecked, description,creationDate, endingDate,favorite,priority }: Props) => {
    let displayDate = '';
    if (endingDate) {
        const day = endingDate.getDate().toString().padStart(2, '0');
        const month = (endingDate.getMonth() + 1).toString().padStart(2, '0');
        const year = endingDate.getFullYear();
        displayDate = `${day}/${month}/${year}`;
    }
    return (
        <View style = {styles.taskContainer}>
            <Image
                style={styles.checkButton}
                source={
                   isChecked ? require("@/assets/images/checkedCircle.png") : require("@/assets/images/uncheckedCircle.png")}
            />
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>{title}</Text>

            <Image source={favorite ? require("@/assets/images/star.png"): null} style={styles.star}></Image>

            <Text style={styles.date}>{displayDate}</Text>

        </View>
    )
}
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({


    taskContainer: {
        marginTop:8,
        backgroundColor: '#FFFFFF',
        height: 63,
        width:screenWidth*0.80,
        alignSelf:"center",
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        flexDirection:"row",

        elevation:6,
        margin:10,
        borderWidth:2,
        borderBottomWidth:5,

    },
    checkButton: {
        width:26,
        height:26,
        marginLeft:19,
        marginRight:10,

        alignSelf:"center"
    },
    title: {
        marginTop:6,
        fontFamily:"Poppins_Medium",
        fontSize : 14,
        textAlign:"left",
        width:screenWidth*0.50,
        height:30



    },

    star:{
        marginTop:4,
        marginLeft:10,
        width:24,
        height:24
    }, date:{
        position:"absolute",
        bottom:4,
        right:26
    }


    }
)
export default Task;