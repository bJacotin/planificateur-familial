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
    Platform
} from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import firebase from "firebase/compat";
import firestore = firebase.firestore;
import {sendEmailVerification, signOut} from "firebase/auth"
import {addDoc, arrayUnion, collection, doc, getDoc, onSnapshot, setDoc} from "@firebase/firestore";
import {async} from "@firebase/util";
import RNFS from 'react-native-fs';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Header from "@/components/Header";
import auth = firebase.auth;
import generate from "@babel/generator";


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const CreateFamily = () => {
    const [familyName, setFamilyName] = useState('');
    const handleJoinFamily = () => {
        router.push('/joinFamily' as RelativePathString);
    };
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
        if (pathname === "/createFamily"){
            checkIfInFamily();
        }

    }, [pathname]);
    const generateFamilyCode = async (familyId:string) => {

        const rawCode = familyId.slice(0, 8).toUpperCase();

        return `${rawCode.slice(0, 4)}-${rawCode.slice(4, 8)}`;
        //ToDo Vérifier la création de doublon
    };
    const handleCreateFamily = async () => {
        const auth = FIREBASE_AUTH;
        if (auth.currentUser) {

            const familiesCollectionRef = collection(FIREBASE_FIRESTORE, "families");
            const familyDocRef = await addDoc(familiesCollectionRef, {
                name: familyName,
                owner: auth.currentUser.uid,
                createdAt: new Date(),
            });
            const familyId = familyDocRef.id;
            const familyCode = await generateFamilyCode(familyId);

            const familyRef = doc(FIREBASE_FIRESTORE, "families", familyId);
            await setDoc(
                familyRef,
                {code: familyCode,},
                { merge: true }
            );

            const userRef = doc(FIREBASE_FIRESTORE, "users", auth.currentUser.uid);

            try {

                await setDoc(
                    userRef,
                    {families: arrayUnion(familyId)},
                    {merge: true}
                );
            } catch (error) {
                console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
            }
        }
        router.push('/yourFamily' as RelativePathString);
    };
    return (
        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.mainContainer}>
            <Header text={""}></Header>
            <View style={styles.content}>
                <View style={styles.buttonWrapper}>
                    <View style={[styles.fieldWrapper]}>
                        <TextInput
                            style={styles.fieldText}
                            placeholder="Nom de la famille"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            value={familyName}
                            autoCapitalize='sentences'
                            onChangeText={(text) => setFamilyName(text)}
                        />
                    </View>
                    <TouchableOpacity style={[styles.button, {backgroundColor: '#36B1CA'}]}
                                      onPress={handleCreateFamily}>
                        <Text style={styles.buttonText}>Créer une Famille</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </LinearGradient>
    );
};

export default CreateFamily;

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 25,
        width: '100%',
        height: '100%'
    },
    content: {
        height: ScreenHeight * 0.85,
        justifyContent: "center",
        alignItems: "center"
    },

    button: {
        alignItems: "center",
        justifyContent: "center",
        width: ScreenWidth * 0.60,


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
    buttonWrapper: {
        width: ScreenWidth * 0.75,
        height: ScreenHeight * 0.4,
        backgroundColor: 'white',
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 35
    }


});
