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
    Platform, Modal
} from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import firebase from "firebase/compat";
import firestore = firebase.firestore;
import {sendEmailVerification, signOut} from "firebase/auth"
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    updateDoc
} from "@firebase/firestore";
import {async} from "@firebase/util";
import RNFS from 'react-native-fs';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Header from "@/components/Header";
import auth = firebase.auth;
import generate from "@babel/generator";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { FamilyMember, FamilyMemberEdit } from '@/components/familyMember';

import JoinRequest from "@/components/JoinRequest";


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const YourFamily = () => {


    const [familyMembers, setFamilyMembers] = useState([]);
    const [name, setName] = useState('');
    const [owner,setOwner]= useState('');
    const [code,setCode]= useState('');
    const [joinRequests, setJoinRequests] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [familyName, setFamilyName] = useState('');

    const updateFamilyName = async (newName) => {
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
    
            const familyId = userSnap.data().families[0];
            const familyRef = doc(FIREBASE_FIRESTORE, "families", familyId);
    
            await updateDoc(familyRef, {
                name: newName,
            });
    
            setName(newName);
            setFamilyName('');
            toggleModal();
    
        } catch (error) {
            console.error("Erreur lors de la mise à jour du nom de la famille :", error);
        }
    };
    
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
            const ownerProfilePicture = await fetchProfilePicture(auth.currentUser.uid);
            setOwner({ ...userData, profilePicture: ownerProfilePicture });
    
            if (userData.families && userData.families.length > 0) {
                const familyId = userData.families[0];
                const familyRef = doc(FIREBASE_FIRESTORE, "families", familyId);
                const familySnap = await getDoc(familyRef);
    
                if (familySnap.exists()) {
                    const familyData = familySnap.data();
                    setName(familyData.name);
                    setCode(familyData.code);
    
                    if (familyData.members && familyData.members.length > 0) {
                        const membersData = await Promise.all(
                            familyData.members.map(async (memberId) => {
                                const memberRef = doc(FIREBASE_FIRESTORE, "users", memberId);
                                const memberSnap = await getDoc(memberRef);
                                if (memberSnap.exists()) {
                                    const memberData = memberSnap.data();
                                    const profilePicture = await fetchProfilePicture(memberId);
                                    return { ...memberData, profilePicture, uid: memberId }; // Inclure uid ici
                                }
                                return null;
                            })
                        );
    
                        setFamilyMembers(membersData);
                    } else {
                        setFamilyMembers([]);
                    }
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des membres :", error);
        }
    };
    
    const removeMember = async (userId:String) => {
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
    
            const familyId = userSnap.data().families[0];
            console.log("Family ID:", familyId); 
            console.log("User ID:", userId); 
    
            if (!familyId || !userId) {
                console.error("Family ID ou User ID est undefined.");
                return;
            }
    
            const familyRef = doc(FIREBASE_FIRESTORE, "families", familyId);
    
            await updateDoc(familyRef, {
                members: arrayRemove(userId),
            });
    
            const memberRef = doc(FIREBASE_FIRESTORE, "users", userId);
            await updateDoc(memberRef, {
                families: arrayRemove(familyId),
            });
    
            fetchFamilyMembers();
        } catch (error) {
            console.error("Erreur lors de la suppression du membre :", error);
        }
    };
    

    

    useEffect(() => {

            if (Platform.OS === 'android') {
              NavigationBar.setBackgroundColorAsync('transparent');
              NavigationBar.setButtonStyleAsync('dark');
            }
        
        fetchFamilyMembers();
    }, []);
    const toggleModal = () => {
        setModalVisible(prevState => !prevState);
    };


    return (
        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.mainContainer}>

                                        <TouchableOpacity onPress={() => router.push('/')} style={[{ zIndex: 7 }, { position: 'absolute' }]}>
                                            <LinearGradient
                                                colors={['#4FE2FF', '#4FE2FF']}
                                                style={styles.buttonWrap}
                                                start={{ x: 1, y: -0.2 }}
                                                end={{ x: 0, y: 1 }}
                                            >
                                                <Image source={require("@/assets/images/arrowLeft.png")} />
                                            </LinearGradient>
                                        </TouchableOpacity>
            <View style={styles.centerContainer}>

                <View style={styles.nameWrapper}>
                    <Text style={styles.familyNameText}>{name} 
                   
                    </Text> 
                    
                    <TouchableOpacity onPress={toggleModal} style={styles.imgWrapEdit} >
                    <Image source={require('@/assets/images/edit-pen-icon.jpg')} style={styles.imgEdit}/>
                    </TouchableOpacity>
                    <Modal visible={modalVisible} transparent={true} animationType="fade">
                    <View style={styles.modalContainer}>
                        
                        <View style={styles.modalContent}>
                            
                            <Text style={styles.modalTitle}>Inserer le nouveau nom de votre famille</Text>
                            <View style={styles.modalCode}>
                                <TextInput
                                    style={{fontSize: 24, textAlign: 'center'}}
                                    placeholder="Nouveau nom"
                                    value={familyName}
                                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                    onChangeText={(text) => setFamilyName(text)}
                                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => updateFamilyName(familyName)}>
                                <Text style={styles.closeButtonText}>Valider</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.closeButton, {backgroundColor: "grey"}]} onPress={toggleModal}>
                                <Text style={styles.closeButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    </Modal>
                </View>

                
                <Text style={styles.membersText}>{familyMembers.length + 1} membres</Text>

            </View>
            <View style={styles.bottomContainer}>
            <FamilyMember  name={owner.name + " (vous)"} pp={owner.profilePicture}/>
                
            {familyMembers.map((member, index) => (
                <FamilyMemberEdit
        key={index}
        name={member.name}
        pp={member.profilePicture}
        uid={member.uid} 
        onRemove={() => removeMember(member.uid)}
    />                ))}
                
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
    buttonWrap: {
        height: 60,
        width: 80,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        marginTop: ScreenHeight * 0.031,
        zIndex: 7,
      },
    imgEdit: {
        width: ScreenWidth * 0.04,
        height: ScreenWidth * 0.04,
        

    },
    imgWrapEdit: {
        marginLeft: 'auto',
        marginRight: 7.5,
        justifyContent:"center",
        alignItems:"center",    
        opacity: 0.6,
    },
    nameWrapper: {
        top:-16,
        elevation:5,
        width: ScreenWidth * 0.4,
        height: ScreenWidth * 0.08,
        backgroundColor:'#E7E7E7',
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:6

    },
    membersText: {
        textAlign:"center",
        fontFamily:"Poppins_Regular",
        fontSize:20,
        marginTop:10
    },
    familyNameText: {
        marginLeft:'auto',
        paddingLeft:ScreenWidth*0.05,
        textAlign:"center",
        alignSelf:"center",
        fontFamily:"Poppins_Bold",
        opacity:0.7
    },
    bottomContainer: {
        width:ScreenWidth,
        height:ScreenHeight*0.8,
        backgroundColor:'white',
        top:-ScreenHeight*0.1,
        zIndex:0,
        paddingTop:ScreenHeight*0.1
    },
    displayCodeWrapper: {
        position:"absolute",
        zIndex:100,
        bottom:20,
        alignSelf:"center",
        backgroundColor:'#4FE2FF',
        height:50,
        width:ScreenWidth*0.6,
        flexDirection:"row",
        borderRadius:30,
        justifyContent:"center",
        alignItems:"center"
    },
    displayCodeImg: {
        width: 30,
        height:30,
        marginRight:10
    },
    displayCodeText: {
        color:'white',
        fontFamily:"Poppins_SemiBold"
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: ScreenWidth * 0.8,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        fontFamily:"Poppins_Bold"
    },
    modalCode: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4FE2FF',
        marginVertical: 20,
    },
    closeButton: {
        backgroundColor: '#4FE2FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },


});
