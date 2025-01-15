
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
import {arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc, where} from "@firebase/firestore";
import {async} from "@firebase/util";
import RNFS from 'react-native-fs';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Header from "@/components/Header";
import {query} from "@firebase/database";


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const JoinFamily = () => {
    const pathname = usePathname();
    const [familyCode,setFamilyCode] = useState('')
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
        if (pathname === "/joinFamily"){
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
    const sendJoinRequest = async (familyCode) => {
        const auth = FIREBASE_AUTH;

        if (!auth.currentUser) {
            throw new Error("L'utilisateur n'est pas connecté.");
        }

        try {
            // Trouver la famille correspondant au code
            const familiesCollectionRef = collection(FIREBASE_FIRESTORE, "families");

            const familiesQuery = query(familiesCollectionRef, where("code", "==", familyCode));
            const familySnapshot = await getDocs(familiesQuery);

            if (familySnapshot.empty) {
                throw new Error("Aucune famille trouvée avec ce code.");
            }


            const familyDocRef = familySnapshot.docs[0].ref;


            await updateDoc(familyDocRef, {
                joinRequests: arrayUnion(auth.currentUser.uid), //ToDo Pas de doublon possible je pense mais verif quand meme
            });

            console.log("Demande envoyée avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'envoi de la demande :", error.message);
            throw error;
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

                <View style={[styles.fieldWrapper]}>
                    <TextInput
                        style={styles.fieldText}
                        placeholder="Code de la Famille"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={familyCode}
                        autoCapitalize='characters'
                        onChangeText={(text) => setFamilyCode(text)}
                    />
                </View>
                <TouchableOpacity style={[styles.button, {backgroundColor:'#36B1CA'}]} onPress={() =>sendJoinRequest(familyCode)}>
                    <Text style={styles.buttonText}>Créer une Famille</Text>
                </TouchableOpacity>


            </View>
        </LinearGradient>
    );
};

export default JoinFamily;

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
    fieldText: {
        marginTop: 5,
        color: "white",
        width: "100%",
        height: 60,
        fontSize: 20,
        fontFamily: "Poppins_Medium",
    },
    fieldWrapper: {

        padding: ScreenWidth * 0.05,
        justifyContent: "center",
        width: ScreenWidth * 0.70,
        height: 62,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        backgroundColor: '#3FC3DD',
        marginBottom: 30,
        elevation: 5,


    },

});
