import React from 'react'
import {StyleSheet, View, Text, Image, Dimensions, TouchableOpacity} from "react-native";

type Props = {
    name: string;

    pp: string;
    onRemove?: () => void;
};



const FamilyMember = ({name, pp}: Props) => {
    console.log(pp);
    return (
        <View style={styles.memberWrapper}>

            <Image
                style={styles.pp}
                source={pp === '' ? require('@/assets/images/emptyProfilePicture.png') : {uri: pp}}

            />
            <View style={styles.taskDataContainer}>
                <Text style={styles.name}>{name}</Text>
            </View>


        </View>
    )
}

const FamilyMemberEdit = ({ name, pp, onRemove }: Props) => {
    return (
        <View style={styles.memberWrapper}>
            <Image
                style={styles.pp}
                source={pp === '' ? require('@/assets/images/emptyProfilePicture.png') : { uri: pp }}
            />
            <View style={[styles.taskDataContainer, { backgroundColor: '#E7E7E7' }]}>
                <Text style={styles.name}>{name}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={onRemove}>
                <Image source={require('@/assets/images/cross.png')} style={styles.iconCross} />
            </TouchableOpacity>
        </View>
    );
};

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({

    button: {
        height: 50,
        width: 50,
        borderRadius: 30,
        backgroundColor: '#CFCFCF',
        marginLeft: "auto",
        marginRight: 10,
        paddingVertical: 6,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        opacity: 1,},

        iconCross: {
            width: 25,
            height: 25,
            opacity: 0.7,
            
        },

        memberWrapper: {
            marginTop: 12,
            backgroundColor: '#E7E7E7',
            width: ScreenWidth * 0.9,
            height: 60,
            borderBottomRightRadius: 35,
            borderBottomLeftRadius: 35,
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            flexDirection: "row",
            alignSelf: "center",
            alignItems: "center",
            elevation: 5,


        },
        pp: {

            height: 50,
            width: 50,
            borderRadius: 30,
            marginLeft: 5,
            marginRight: 10,


        },


        taskDataContainer: {
            alignItems: "flex-start",

        },
        name: {
            marginTop: 4,
            fontFamily: "Poppins_SemiBold",
            fontSize: 18,
            textAlign: "left",
            opacity: 0.7


        }
    }
)
export { FamilyMember, FamilyMemberEdit };
