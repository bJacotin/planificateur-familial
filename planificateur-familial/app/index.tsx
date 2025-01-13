import {
    Button,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    Touchable,
    TouchableOpacity,
    View
} from "react-native";

import { useRouter, RelativePathString} from 'expo-router';
import {StatusBar} from "expo-status-bar";
import React, {useEffect, useState} from "react";
import * as NavigationBar from "expo-navigation-bar";
import {onAuthStateChanged} from "firebase/auth";
import {FIREBASE_AUTH} from "@/FirebaseConfig";

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default function Index() {
    const [name,setName] = useState<string>("Jean-Michel")
    const router = useRouter();
    const handleToDoClick = () => {
        router.push('/todo');
    };
    const handleProfileClick = () => {
        router.push('/profile' as RelativePathString);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                console.log('Utilisateur connecté, reste sur Index');
            } else {
                console.log('Aucun utilisateur connecté');
                router.push('/login' as RelativePathString);
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('#FFFFFF');
            NavigationBar.setButtonStyleAsync('light');
        }
    }, []);

    const profilePicture = '@/assets/images/emptyProfilePicture.png';
    return (
        <ScrollView style={{flex:1,backgroundColor:"#FFD902"}}>
            <StatusBar style="dark" backgroundColor="#FFD902"/>
            <Image source={require('@/assets/images/Group20.png')}  style={styles.imgTukki} />
            <TouchableOpacity onPress={handleProfileClick}>
                <Image source={require(profilePicture)} style={styles.profilePicture} ></Image>
            </TouchableOpacity>
            <View style={styles.content}>
                <Text style={styles.hello}>Bonjour, {name} !</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/shoppingList' as RelativePathString)} style={styles.button}>
                <Text style={styles.buttonText}>Liste des Courses</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    imgTukki: {
        position: 'absolute',
        top: ScreenHeight * 0.145,
        left: ScreenWidth * 0.13,
        width: ScreenWidth * 0.4,
        height: ScreenHeight * 0.17,
        zIndex: 2,
    },
    profilePicture:{
        top: ScreenHeight * 0.07,
        left: ScreenWidth * 0.8,
        width: ScreenWidth * 0.14,
        height: ScreenWidth * 0.14,
    },
    content: {
        elevation:100,
        backgroundColor:'white',
        width:ScreenWidth,
        height:ScreenHeight,
        marginTop:130,
        borderRadius:35,
        padding:ScreenWidth*0.1
    },
    hello:{
        marginTop:6,
        fontSize:28,
        fontFamily: "Poppins_SemiBold",
    }

});