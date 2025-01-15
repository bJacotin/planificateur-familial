import React from 'react'
import {StyleSheet, View, Text, Image, Dimensions} from "react-native";

type Props = {
    name: string;

    pp: string;
};

const FamilyMember = ({name, pp}: Props) => {
    console.log(pp);
    return (
        <View style={styles.memberWrapper}>

            <Image
                style={styles.pp}
                source={
                    pp === ''
                        ? require('@/assets/images/emptyProfilePicture.png')
                        : {uri: pp}
                }

            />
            <View style={styles.taskDataContainer}>
                <Text style={styles.name}>{name}</Text>


            </View>


        </View>
    )
}

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({


        memberWrapper: {
            marginTop: 12,
            backgroundColor: '#E7E7E7',
            width: ScreenWidth * 0.9,
            height: 60,
            borderBottomRightRadius: 35,
            borderBottomLeftRadius: 35,
            borderTopLeftRadius: 35,
            borderTopRightRadius: 25,
            flexDirection: "row",
            alignSelf:"center",
            alignItems:"center",
            elevation: 5,



        },
        pp: {

            height: 50,
            width: 50,
            borderRadius: 30,
            marginLeft: 5,
            marginRight: 10,
            backgroundColor:'red'


        },


        taskDataContainer: {
            alignItems: "flex-start",

        },
        name: {
            marginTop:4,
            fontFamily: "Poppins_SemiBold",
            fontSize: 18,
            textAlign: "left",
            opacity:0.7



        }
    }
)
export default FamilyMember;