
import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from '@/FirebaseConfig';

import {LinearGradient} from 'expo-linear-gradient';
import {RelativePathString, router, usePathname} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform, BackHandler
} from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import firebase from "firebase/compat";
import firestore = firebase.firestore;
import {signOut} from "firebase/auth"
import {doc, getDoc, onSnapshot, setDoc} from "@firebase/firestore";
import {async} from "@firebase/util";
import RNFS from 'react-native-fs';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Header from "@/components/Header";


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const Family = () => {
    const pathname = usePathname();

    useEffect(() => {
        const checkIfInFamily = async () => {
            try {
                const inFamily = await isInAFamily();
                if (inFamily) {
                    router.push("/yourFamily" as RelativePathString);
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de la famille :", error);
            }
        };
        if (pathname === "/family"){
            checkIfInFamily();
        }

    }, [pathname]);
    const isInAFamily = async () => {
        const auth = FIREBASE_AUTH;

        if (!auth.currentUser) {
            throw new Error("L'utilisateur n'est pas connecté.");
        }


        const userRef = doc(FIREBASE_FIRESTORE, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);


        const userData = userSnap.data();
        // @ts-ignore
        if (userData.families && userData.families.length > 0) {
            return true;
        } else {
            return false;
        }

    };

    const handleJoinFamily = () => {
        router.push('/joinFamily' as RelativePathString);
    };
    const handleCreateFamily = () => {
        router.push('/createFamily' as RelativePathString);
    };
    return (
        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.mainContainer}>
            <Header text={"Votre Famille"}></Header>
            <View style={styles.content}>
                <TouchableOpacity style={[styles.button, {backgroundColor:'#36B1CA'}]} onPress={handleCreateFamily}>
                    <Text style={styles.buttonText}>Créer une Famille</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, {backgroundColor:'#3D3D3D'}]} onPress={handleJoinFamily}>
                    <Text style={styles.buttonText}>Rejoindre une Famille</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default Family;

const styles = StyleSheet.create({
    mainContainer: {
        marginTop:25,
        width:'100%',
        height:'100%'
    },
    content: {
        height:ScreenHeight*0.85,
        justifyContent:"center",
        alignItems:"center"
    },

    button: {
        alignItems: "center",
        justifyContent: "center",
        width: ScreenWidth * 0.75,
        marginTop: 14,
        marginBottom: 14,
        height: 46,
        borderRadius: 95,
        borderWidth: 2,
        borderColor: "white",
    },
    buttonText: {
        marginTop: 3,
        color: "white",
        fontSize: 14,
        fontFamily: "Poppins_Bold",
    },

});
