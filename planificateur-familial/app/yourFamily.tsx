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
import {useSafeAreaInsets} from "react-native-safe-area-context";
import FamilyMember from "@/components/familyMember";


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const YourFamily = () => {


    const [familyMembers, setFamilyMembers] = useState([]);
    const [name, setName] = useState('');
    const [owner,setOwner]= useState('');
    const [code,setCode]= useState('');


    const fetchProfilePicture = async (userId: string): Promise<string | null> => {
        try {
            const docRef = doc(FIREBASE_FIRESTORE, "users", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const profilePictureBase64 = docSnap.data();
                let pp = '';
                for (let i = 1; i <= 6; i++) {
                    const part = profilePictureBase64[`ppPart${i}`];
                    if (part) {
                        pp += part;
                    }
                }
                return pp ;
            }
            console.log(`Aucun utilisateur trouvé pour l'UID : ${userId}`);
            return null;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'image de profil :", error);
            return null;
        }
    };
    const fetchFamilyMembers = async () => {
        const auth = FIREBASE_AUTH;

        if (!auth.currentUser) {
            console.error("L'utilisateur n'est pas connecté.");
            return;
        }

        try {
            const userRef = doc(FIREBASE_FIRESTORE, "users", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                console.error("Le document utilisateur n'existe pas.");
                return;
            }

            const userData = userSnap.data();
            setOwner(userData)
            if (userData.families && userData.families.length > 0) {
                const familyId = userData.families[0]; // ToDo ici on ne prend que la liste n°1
                const familyRef = doc(FIREBASE_FIRESTORE, "families", familyId);
                const familySnap = await getDoc(familyRef);

                if (familySnap.exists()) {
                    const familyData = familySnap.data();
                    setName(familyData.name)
                    setCode(familyData.code)
                    if (familyData.members && familyData.members.length > 0) {
                        const membersData = await Promise.all(
                            familyData.members.map(async (memberId: string) => {
                                const memberRef = doc(FIREBASE_FIRESTORE, "users", memberId);
                                const memberSnap = await getDoc(memberRef);
                                if (memberSnap.exists()) {
                                    const memberData = memberSnap.data();
                                    const profilePicture = await fetchProfilePicture(memberId);
                                    return { ...memberData, profilePicture };
                                }
                                return null;
                            })
                        );

                        setFamilyMembers(membersData); // ToDO potentiel bug user delete
                    }
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des membres :", error);
        }
    };

    useEffect(() => {
        fetchFamilyMembers();
    }, []);

    return (
        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.mainContainer}>
            <Header text={""}></Header>

            <View style={styles.centerContainer}>

                <View style={styles.nameWrapper}>
                    <Text style={styles.familyNameText}>{name}</Text>
                </View>
                <TouchableOpacity style={styles.imgWrapEdit} >
                    <Image source={require('@/assets/images/edit-pen-icon.jpg')} style={styles.imgEdit}/>
                </TouchableOpacity>

                <Text style={styles.membersText}>12 membres</Text>

                <Text style={styles.membersText}>{code}</Text>
            </View>
            <View style={styles.bottomContainer}>
                <FamilyMember  name={owner.name} pp={''} />
                {familyMembers.map((member, index) => (
                    <FamilyMember key={index} name={member.name} pp={member.profilePicture} />
                ))}
            </View>
        </LinearGradient>
    );
};

export default YourFamily;

const styles = StyleSheet.create({
    mainContainer: {
        height: ScreenHeight,
        width: ScreenWidth,
        marginTop: 28,

    },
    centerContainer: {
        width: ScreenWidth * 0.9,
        height: ScreenHeight * 0.2,
        backgroundColor: '#E7E7E7',

        alignSelf: 'center',
        marginTop: ScreenWidth * 0.24,
        borderRadius: 20,
        elevation: 10,
        shadowColor: 'black',
        zIndex:1,
        alignItems:"center"
    },
    imgEdit: {
        width: ScreenWidth * 0.05,
        height: ScreenWidth * 0.05,
    },
    imgWrapEdit: {
        width: ScreenWidth * 0.05,
        height: ScreenWidth * 0.05,
        alignSelf:"flex-end",
        right:12,
        top:-18,
        position: 'relative',
        opacity: 0.6,


    },
    nameWrapper: {
        top:-16,
        elevation:5,
        width: ScreenWidth * 0.4,
        height: ScreenWidth * 0.08,
        backgroundColor:'#E7E7E7',
        justifyContent:"center",
        borderRadius:6

    },
    membersText: {
        textAlign:"center",
        fontFamily:"Poppins_Regular",
        fontSize:20,
        marginTop:10
    },
    familyNameText: {
        textAlign:"center",
        fontFamily:"Poppins_Bold",
        opacity:0.7
    },
    bottomContainer: {
        width:ScreenWidth,
        height:ScreenHeight*0.7,
        backgroundColor:'white',
        top:-ScreenHeight*0.1,
        zIndex:0,
        paddingTop:ScreenHeight*0.1
    }


});
