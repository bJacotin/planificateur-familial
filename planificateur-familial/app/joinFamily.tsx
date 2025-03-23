
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

            if (Platform.OS === 'android') {
              NavigationBar.setBackgroundColorAsync('#FED77C');
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
    const sendJoinRequest = async (familyCode:string) => {
        const auth = FIREBASE_AUTH;

        if (!auth.currentUser) {
            throw new Error("L'utilisateur n'est pas connecté.");
        }

        try {

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
                        <View style={styles.imgBulle}>
                          <Image source={require('@/assets/images/Rectangle526.png')} style={{zIndex:5  }} />
                          <Text style={[styles.textBulle, {zIndex:8 }]}>Veuillez insérer votre code Famille.</Text>
                        </View>
                            <TouchableOpacity onPress={() => router.push('/family')} style={[{ zIndex: 7 }, { position: 'absolute' }]}>
                                <LinearGradient
                                    colors={['#4FE2FF', '#4FE2FF']}
                                    style={styles.buttonWrap}
                                    start={{ x: 1, y: -0.2 }}
                                    end={{ x: 0, y: 1 }}
                                >
                                    <Image source={require("@/assets/images/arrowLeft.png")} />
                                </LinearGradient>
                            </TouchableOpacity>
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
                    <Text style={styles.buttonText}>Rejoindre une Famille</Text>
                </TouchableOpacity>


            </View>
        </LinearGradient>
        </SafeAreaView>
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
        height:ScreenHeight*1.2,
        justifyContent:"center",
        alignItems:"center"
    },

    button: {
        alignItems: "center",
        justifyContent: "center",
        width: ScreenWidth * 0.75,
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

    
    buttonWrap: {
        height: 60,
        width: 80,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        marginTop: ScreenHeight * 0.10,
        zIndex: 7,
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
        top: ScreenHeight * 0.2,
        right: ScreenWidth * 0.1,
        width: ScreenWidth * 0.6,
        height: ScreenWidth * 0.24,
        opacity: 0.9,
        zIndex: 5,
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
