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
import FamilyMember from "@/components/familyMember";
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
                    }else { setFamilyMembers([])}
                    if (familyData.joinRequests && familyData.joinRequests.length > 0) {
                        const requestsData = await Promise.all(
                            familyData.joinRequests.map(async (requestId: string) => {
                                const requestRef = doc(FIREBASE_FIRESTORE, "users", requestId);
                                const requestSnap = await getDoc(requestRef);
                                if (requestSnap.exists()) {
                                    const requestData = requestSnap.data();
                                    const profilePicture = await fetchProfilePicture(requestId);
                                    return { ...requestData, profilePicture, uid: requestId };
                                }
                                return null;
                            })
                        );

                        setJoinRequests(requestsData);
                    }
                    else { setJoinRequests([])}
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des membres :", error);
        }
    };

    const acceptRequest = async (userId: string) => {

        const userRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
        const userSnap = await getDoc(userRef);

        const familyId = userSnap.data().families[0];
        const familyRef = doc(FIREBASE_FIRESTORE, "families", familyId);

        console.log(userId)
        await updateDoc(familyRef, {
            members: arrayUnion(userId),
            joinRequests: arrayRemove(userId),
        });
        const memberRef = doc(FIREBASE_FIRESTORE, "users", userId);
        await updateDoc(memberRef, {
            families: arrayUnion(familyId),
        });

        fetchFamilyMembers();
    };


    const rejectRequest = async (userId: string) => {

        const userRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
        const userSnap = await getDoc(userRef);

        const familyId = userSnap.data().families[0];
        const familyRef = doc(FIREBASE_FIRESTORE, "families", familyId);


        await updateDoc(familyRef, {
            joinRequests: arrayRemove(userId),
        });


        fetchFamilyMembers();

    };

    useEffect(() => {
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

            <Header text={""}></Header>

            <View style={styles.centerContainer}>

                <View style={styles.nameWrapper}>
                    <Text style={styles.familyNameText}>{name}</Text>
                </View>
                <TouchableOpacity style={styles.imgWrapEdit} >
                    <Image source={require('@/assets/images/edit-pen-icon.jpg')} style={styles.imgEdit}/>
                </TouchableOpacity>

                <Text style={styles.membersText}>{familyMembers.length + 1} membres</Text>

            </View>
            <View style={styles.bottomContainer}>
                <FamilyMember  name={owner.name} pp={owner.profilePicture}/>
                {familyMembers.map((member, index) => (
                    <FamilyMember key={index} name={member.name} pp={member.profilePicture}/>
                ))}
                <Text style={styles.membersText}>Accepter des membres :</Text>

                {joinRequests.map((request, index) => (
                    <JoinRequest
                        key={index}
                        name={request.name}
                        pp={request.profilePicture}
                        onAccept={() => acceptRequest(request.uid)}
                        onReject={() => rejectRequest(request.uid)}
                    />
                ))}
                <TouchableOpacity onPress={toggleModal} style={styles.displayCodeWrapper}>
                    <Image style={styles.displayCodeImg} source={require('@/assets/images/menu-points.png')}></Image>
                    <Text style={styles.displayCodeText}>Partager le code</Text>
                </TouchableOpacity>
                <Modal visible={modalVisible} >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Code de votre famille</Text>
                        <Text style={styles.modalCode}>{code}</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        borderRadius: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },


});
