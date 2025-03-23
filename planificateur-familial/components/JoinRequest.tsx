import React from 'react'
import {StyleSheet, View, Text, Image, Dimensions, TouchableOpacity} from "react-native";

type JoinRequestProps = {
    name: string;
    pp: string;
    onAccept: () => void;
    onReject: () => void;
};

const JoinRequest = ({name, pp, onAccept, onReject}: JoinRequestProps) => {
    return (
        <View style={styles.requestWrapper}>
            <Image
                source={pp === '' ? require('@/assets/images/emptyProfilePicture.png') : {uri: pp}}
                style={styles.pp}
            />
            <Text style={styles.name}>{name}</Text>
            <View style={styles.buttonContainer}>
                               <TouchableOpacity style={[styles.button]} onPress={onAccept}>
                    <Image source={require('@/assets/images/check.png')}style={styles.iconCheck}  />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button]} onPress={onReject}>
                                      <Image source={require('@/assets/images/cross.png')}  style={styles.iconCross}/>
                </TouchableOpacity>



            </View>
        </View>
    );
};

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
        buttonContainer: {
            flexDirection: 'row',
            marginLeft: 'auto', 
            marginRight: 10,
        },
        button: {
            height: 50,
            width: 50,
            borderRadius: 30,
            backgroundColor: '#CFCFCF',
            marginLeft: 10,
            paddingVertical: 6,
            paddingHorizontal: 12,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            opacity: 1,},
        buttonText: {
            color: 'white',
            fontFamily: 'Poppins_Bold',
        },

        requestWrapper: {
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
        iconCross: {
            width: 25,
            height: 25,
            opacity: 0.7,
            
        },
        iconCheck: {
            marginTop: 3,
            width: 34,
            height: 25,
            tintColor: '#1B90A7',
            
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
export default JoinRequest;