import React, {useEffect, useState} from "react";
import {RelativePathString, useRouter} from "expo-router";
import {onAuthStateChanged} from "firebase/auth";
import {FIREBASE_AUTH} from "@/FirebaseConfig";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
    Dimensions
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import Header from "@/components/Header";
import {signOut} from "firebase/auth"


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
export default function profile() {
    const [name,setName] = useState<string>("Jean-Michel")
    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('#FFD902');
            NavigationBar.setButtonStyleAsync('dark');
        }
    }, []);
    const profilePicture = '@/assets/images/emptyProfilePicture.png';

    const logout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            console.log("Déconnexion réussie");

        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    }
    return (
        <View style={{backgroundColor:'#FFD902', flex:1}}>
            <StatusBar barStyle="dark-content" backgroundColor="rgba(255, 255, 255, 0)" />
                <Header text={''}></Header>
                <Image source={require(profilePicture)} style={styles.profilePicture} ></Image>
                <View style={styles.userDataDisplay}>
                    <Text style={styles.name}> {name}</Text>
                </View>
                <TouchableOpacity style={styles.logout} onPress={logout} >
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    profilePicture: {
        width: ScreenWidth*0.43,
        height: ScreenWidth*0.43,
        borderWidth:2,
        borderRadius:20000,
        borderColor:'black',
        alignSelf:"center",

        top:20,
        zIndex:3
    },
    userDataDisplay: {
        backgroundColor:'white',
        height:ScreenHeight*0.5,
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
        elevation:4,
        top:-10
    },
    logout: {
        width: ScreenWidth*0.46,
        height: 60,
        backgroundColor:'white',
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        display: "flex",
        justifyContent:"center",
        alignItems:"center",
        elevation: 5,
        borderWidth:2,
        borderBottomWidth:5,
        alignSelf:"center",
        marginTop:30,
    },
    logoutText: {
        marginTop:3,
        fontSize:14,
        fontFamily: "Poppins_Medium",
        textAlign:"center"
    },
    name: {
        marginTop:35,
        fontSize:24,
        fontFamily: "Poppins_SemiBold",
        textAlign:"center"
    }


});