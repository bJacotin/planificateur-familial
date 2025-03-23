
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
import { screensEnabled } from 'react-native-screens';


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const Family = () => {
    const pathname = usePathname();

    useEffect(() => {

            if (Platform.OS === 'android') {
              NavigationBar.setBackgroundColorAsync('transparent');
              NavigationBar.setButtonStyleAsync('light');
            }
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

        

        
        <SafeAreaView style={{ flex: 1 }}>


        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.mainContainer}>

                  <Image source={require('@/assets/images/soleil.png')}  style={styles.imgSun} />
                  <Image source={require('@/assets/images/nuages1.png')}  style={styles.imgNuage1} />
                  <Image source={require('@/assets/images/nuages2.png')}  style={styles.imgNuage2} />
                  <Image source={require('@/assets/images/Group20.png')}  style={styles.imgTukki} />
                  <Image source={require('@/assets/images/plage.png')}  style={styles.imgPlage} />
                            <TouchableOpacity onPress={() => router.push('/')} style={[{ zIndex: 4 }, { position: 'absolute' }]}>
                                <LinearGradient
                                    colors={['#4FE2FF', '#4FE2FF']}
                                    style={styles.buttonWrap}
                                    start={{ x: 1, y: -0.2 }}
                                    end={{ x: 0, y: 1 }}
                                >
                                    <Image source={require("@/assets/images/arrowLeft.png")} />
                                </LinearGradient>
                            </TouchableOpacity>

                <Text style={styles.familyText}>Vous n'avez pas de famille pour le moment</Text>
            <View style={styles.content}>                
                <TouchableOpacity style={[styles.button, {backgroundColor:'#3D3D3D'}]} onPress={handleJoinFamily}>
                    <Text style={styles.buttonText}>Rejoindre ma Famille</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {backgroundColor:'#36B1CA'}]} onPress={handleCreateFamily}>
                    <Text style={styles.buttonText}>Créer une Famille</Text>
                </TouchableOpacity>


            </View>
        </LinearGradient>
        </SafeAreaView>

    );
};

export default Family;

const styles = StyleSheet.create({
    familyText: {
        backgroundColor: '#4FE2FF',
        fontFamily: "Poppins_Bold",
        marginTop: ScreenHeight * 0.008,
        color: "white",
        fontSize: 28,
        textAlign: "center",
        elevation: 5,
        
        marginBottom: ScreenWidth * 0.7
    },

    mainContainer: {
        marginTop:25,
        width:'100%',
        height:'100%'
    },
    content: {
        height:ScreenHeight*0.85,
        alignItems:"center"
    },

    buttonWrap: {
        height: 60,
        width: 80,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        marginTop: ScreenHeight * 0.10,
        zIndex: 4,
      },

    button: {
        alignItems: "center",
        justifyContent: "center",
        width: ScreenWidth * 0.75,
        marginTop: 14,
        marginBottom: 14,
        height: 80,
        borderRadius: 95,
        borderWidth: 2,
        borderColor: "white",
    },
    buttonText: {
        marginTop: 3,
        color: "white",
        fontSize: 20,
        fontFamily: "Poppins_Bold",
    },

    imgSun: {
        position: 'absolute',
        top: ScreenHeight * 0.13,
        right: ScreenWidth * 0.05,
        width: ScreenWidth * 0.32,
        height: ScreenWidth * 0.32,
        zIndex: 3,
    
      },
      imgNuage1: {
        position: 'absolute',
        top: ScreenHeight * 0.18,
        left: ScreenWidth * 0.040,
        width: ScreenWidth * 0.4,
        height: ScreenWidth * 0.25,
        zIndex: 4,
      },
      imgNuage2: {
        position: 'absolute',
        top: ScreenHeight * 0.31,
        right: ScreenWidth * 0.15,
        width: ScreenWidth * 0.32,
        height: ScreenWidth * 0.2,
        zIndex: 6,
      },
      imgBulle: {
        position: 'absolute',
        top: ScreenHeight * 0.17,
        right: ScreenWidth * 0.1,
        width: ScreenWidth * 0.6,
        height: ScreenWidth * 0.24,
      },
      imgTukki: {
        position: 'absolute',
        top: ScreenHeight * 0.34,
        left: ScreenWidth * 0.17,
        width: ScreenWidth * 0.3,
        height: ScreenWidth * 0.25,
        zIndex: 2,
      },
      imgPlage: {
        position: 'absolute',
        bottom: 0,
        right: ScreenWidth * -0.15,
        width: ScreenWidth*1.3,
        height: ScreenWidth * 0.7,
        zIndex: 1,
      },
      textBulle: {
        position: 'absolute',
        top: ScreenWidth * 0.028,
        left: ScreenWidth * 0.05,
        color: '#42484F',
        fontFamily: 'Poppins_Bold',
        
        fontSize: 20,
        width: ScreenWidth * 0.6,
        height: ScreenWidth * 0.24,
      }

});
