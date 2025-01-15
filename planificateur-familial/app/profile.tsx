import Header from '@/components/Header';

import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from '@/FirebaseConfig';

import {LinearGradient} from 'expo-linear-gradient';
import {RelativePathString, router} from 'expo-router';
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
import {signOut} from "firebase/auth"
import {doc, getDoc, onSnapshot, setDoc} from "@firebase/firestore";
import {async} from "@firebase/util";
import RNFS from 'react-native-fs';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const Profile = () => {

    const [age, setAge] = useState<number>();
    const [name, setName] = useState<string>('');
    const [PPBase64, setPPBase64] = useState<string>('');




    const convertLocalImageToBase64 = async (imageUri) => {
        try {
            const base64Image = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            console.log('conversion réussie',base64Image)
            return `data:image/jpeg;base64,${base64Image}`;
        } catch (error) {
            console.error("Error converting image to base64: ", error);
            return null;
        }
    };


    const saveProfilePictureToFirestore = async (base64Image: string) => {
        const userRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
        try {
            const segmentLength = Math.ceil(base64Image.length / 6);


            const imageSegments = {
                ppPart1: base64Image.slice(0, segmentLength),
                ppPart2: base64Image.slice(segmentLength, segmentLength * 2),
                ppPart3: base64Image.slice(segmentLength * 2, segmentLength * 3),
                ppPart4: base64Image.slice(segmentLength * 3, segmentLength * 4),
                ppPart5: base64Image.slice(segmentLength * 4, segmentLength * 5),
                ppPart6: base64Image.slice(segmentLength * 5),
            };


            await setDoc(userRef, imageSegments, { merge: true });
            console.log("Image de profil sauvegardée avec succès !");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde dans Firestore : ", error);
        }
    };

    const fetchProfilePicture = async () => {
        if (FIREBASE_AUTH.currentUser.uid) {
            const docRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const profilePictureBase64 = docSnap.data();

                if (profilePictureBase64) {
                    let pp = '';

                    // Ensure that all parts exist and concatenate them
                    for (let i = 1; i <= 6; i++) {
                        const part = profilePictureBase64[`ppPart${i}`];
                        if (part) {
                            pp += part;
                        } else {
                            console.log(`ppPart${i} is missing`);
                        }
                    }


                    if (pp) {
                        console.log("Image récupérée : ", pp);
                        setPPBase64(pp);
                    } else {
                        console.log("Aucune image de profil trouvée.");
                    }
                } else {
                    console.log("Aucune image de profil trouvée dans la base de données.");
                }
            } else {
                console.log("Aucun utilisateur trouvé avec cet UID.");
            }
        }
    };

    fetchProfilePicture();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userUID = FIREBASE_AUTH.currentUser?.uid;
                if (userUID) {
                    const docRef = doc(FIREBASE_FIRESTORE, "users", userUID);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setName(data?.name ?? '');
                        setAge(data?.age ?? 0);

                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data: ", error);
            }
        };

        fetchUserData();

    }, []);


    const handleForgotPasswordClick = () => {
        router.push('/forgotPassword' as RelativePathString);
    };

    const handleSignupClick = () => {
        router.push('/signup' as RelativePathString);
    };


    const handleChoosePhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [3, 3],
            quality: 0.2,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const {uri} = result.assets[0];

            const base64Image = await convertLocalImageToBase64(uri);

            if (base64Image) {
                await saveProfilePictureToFirestore(base64Image);
                setPPBase64(base64Image);
            }
        } else {
            console.log("Image selection cancelled");
        }
    };

    const logout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            console.log("Déconnexion réussie");
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };
    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('white');
            NavigationBar.setButtonStyleAsync('light');
        }
    }, []);


    return (

        <SafeAreaView style={styles.SafeArea}>
            <StatusBar backgroundColor='#4FE2FF'/>
            <TouchableOpacity style={styles.imgWrapEdit} onPress={handleChoosePhoto}>
                <Image source={require('@/assets/images/edit-pen-icon.jpg')} style={styles.imgEdit}/>
            </TouchableOpacity>
            <Image source={
                PPBase64 === ''
                    ? require('@/assets/images/emptyProfilePicture.png')
                    : {uri: PPBase64}
            } style={styles.pp}>

            </Image>

            <View style={styles.mainContainer}>

                <LinearGradient
                    colors={['#4FE2FF', '#004B5A', '#002C35']}
                    locations={[0, 0.8, 1]}                    start={{x: 0.5, y: 0}}
                    end={{x: 0.5, y: 1}}
                    style={{height: ScreenHeight * 0.36}}
                >
                    <TouchableOpacity onPress={logout} style={styles.logoutWrapper}>
                        <Image style={styles.logoutImg} source={require('@/assets/images/power.png')}></Image>
                        <Text style={styles.logoutText}>Déconnexion</Text>
                    </TouchableOpacity>
                </LinearGradient>
                <View style={styles.centerContainer}>
                    <View>
                        <Text style={styles.nameText}>{name}</Text>
                        <Text style={styles.ageText}>{age} ans</Text>

                    </View>
                </View>
            </View>
            <View style={styles.Container}>
                <Text style={styles.titleText}>Famille</Text>
                <Image source={require('@/assets/images/three-points.png')}
                       style={[styles.imgThreePoints, {top: ScreenHeight * 0.028}]}/>

                <TouchableOpacity style={styles.familyContainer}>
                    <Text style={styles.familyText}>Boubakar</Text>
                </TouchableOpacity>
                <Text style={[styles.titleText, {marginTop: ScreenHeight * 0.035}]}>
                    Badges <Image source={require('@/assets/images/info.png')} style={[styles.imgInfo]}/>
                </Text>

            </View>

        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({

    Container: {
        marginTop: -ScreenHeight * 0.1,
        marginLeft: ScreenWidth * 0.1,
        alignContent: 'center',
        alignItems: 'center',
        flex: 1,

    },
    mainContainer: {
        flex: 1,
        alignContent: 'center',
        marginTop:25
    },
    centerContainer: {
        width: ScreenWidth * 0.9,
        height: ScreenHeight * 0.2,
        backgroundColor: '#E7E7E7',
        position: 'absolute',
        alignSelf: 'center',
        marginTop: ScreenWidth * 0.47,
        borderRadius: 20,
        elevation: 10,
        shadowColor: 'black',
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 20,
        fontFamily: 'Poppins_Bold',
        color: 'black',
        marginTop: ScreenHeight * 0.04,
        alignSelf: 'center'
    },
    titleText: {
        fontSize: 26,
        fontFamily: 'Poppins_Bold',
        color: 'black',
        marginTop: ScreenHeight * 0.01,
        alignSelf: 'flex-start'
    },
    ageText: {
        fontSize: 20,
        fontFamily: 'Poppins_Regular',
        color: 'black',
        alignSelf: 'center',
        opacity: 0.5,
        marginTop: -ScreenHeight * 0.005,
    },
    SafeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    imgThreePoints: {
        width: ScreenWidth * 0.05,
        height: ScreenWidth * 0.05,
        position: 'absolute',
        zIndex: 10,
        opacity: 0.5,
        right: ScreenWidth * 0.09,
    },

    familyContainer: {
        width: ScreenWidth * 0.8,
        height: ScreenHeight * 0.08,
        backgroundColor: '#E7E7E7',
        borderRadius: 1000,
        elevation: 10,
        shadowColor: 'black',
        justifyContent: 'center',
        marginTop: ScreenHeight * 0.01,
        alignSelf: 'flex-start',


    },
    pp: {
        width: ScreenWidth * 0.3,
        height: ScreenWidth * 0.3,
        borderRadius: 1000,
        position: 'absolute',
        zIndex: 10,
        top: ScreenHeight * 0.18,
        alignSelf: 'center',
        elevation: 10,
        borderWidth: 3,
        borderColor: 'white',
    },

    familyText: {
        fontSize: 20,
        fontFamily: 'Poppins_Bold',
        color: 'black',
        alignSelf: 'flex-start',
        paddingLeft: ScreenWidth * 0.2,
        opacity: 0.5,
        paddingTop: ScreenHeight * 0.008,
    },
    imgWrapEdit: {
        width: ScreenWidth * 0.05,
        height: ScreenWidth * 0.05,
        marginTop: ScreenHeight * 0.065,
        marginLeft: ScreenWidth * 0.8,
        position: 'absolute',
        zIndex: 10,
        opacity: 0.5,
        top: ScreenHeight * 0.22,
        right: ScreenWidth * 0.09,
    },
    imgEdit: {
        width: ScreenWidth * 0.05,
        height: ScreenWidth * 0.05,

    },

    imgInfo: {
        width: ScreenWidth * 0.05,
        height: ScreenWidth * 0.05,
        position: 'absolute',
        zIndex: 10,
        opacity: 0.5,

    }, logoutWrapper: {
        marginTop: 30,
        width: 180,
        height: 50,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        flexDirection: 'row',
        alignItems: "center",
        alignSelf: "flex-end",
        right: 10,
    },
    logoutImg: {
        width: 30,
        height: 30,
        marginLeft: 14,
        opacity:0.5
    },
    logoutText: {
        fontFamily: 'Poppins_SemiBold',
        marginTop: 3,
        marginLeft: 8,
        color:'white'
    }
});
