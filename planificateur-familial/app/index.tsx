import {
    BackHandler,
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

import {useRouter, RelativePathString, usePathname} from 'expo-router';
import {StatusBar} from "expo-status-bar";
import React, {useEffect, useState} from "react";
import * as NavigationBar from "expo-navigation-bar";
import {onAuthStateChanged} from "firebase/auth";

import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {LinearGradient} from "expo-linear-gradient";
import {ProfilePicture} from '@/components/ProfilePicture';
import {IconServices} from "@/components/IconServices";
import {doc, getDoc} from "@firebase/firestore";
import {useUserAndFamily} from "@/app/launchController";

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default function Index() {
    const [name, setName] = useState<string>("")
    const router = useRouter();

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
    const pathname = usePathname();
    useEffect(() => {

        if (pathname === '/') {
            fetchProfilePicture();
        }
    }, [pathname]);


    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('#FFFFFF');
            NavigationBar.setButtonStyleAsync('light');
        }

    }, []);
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

    const [userPP, setUserPP] = useState<string>('');
    const [familyPath,setFamilyPath] =useState("/yourFamily")

    const fetchProfilePicture = async () => {
<<<<<<< HEAD
        
=======
        const familyPath = await isInAFamily() ? "/yourFamily" : "/family"
        setFamilyPath(familyPath)
>>>>>>> 9c17d60 (Last commit)
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (FIREBASE_AUTH.currentUser.uid) {
            const docRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const profilePictureBase64 = docSnap.data();
                setName(profilePictureBase64.name)
                if (profilePictureBase64) {
                    let pp = '';


                    for (let i = 1; i <= 6; i++) {
                        const part = profilePictureBase64[`ppPart${i}`];
                        if (part) {
                            pp += part;
                        } else {
                            console.log(`ppPart${i} is missing`);
                        }
                    }


                    if (pp) {

                        setUserPP(pp);
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


    return (
        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={{height: ScreenHeight * 0.36, marginTop: 25}}
        >
            <StatusBar style="dark" backgroundColor="#4FE2FF"/>
            <Image source={require('@/assets/images/Group20.png')} style={styles.imgTukki}/>

            <View style={styles.header}>
                <TouchableOpacity onPress={handleProfileClick} style={styles.profilePicture}>

                    <ProfilePicture image={userPP === ''
                        ? require('@/assets/images/emptyProfilePicture.png')
                        : {uri: userPP}}/>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.hello}>Bonjour, {name} !</Text>
                <TouchableOpacity onPress={() =>router.push("/yourFamily")} style={styles.familyContainer}>
                    <View style={styles.familyNameContainer}>
                        <Text style={styles.familyNameText}>Ma famille</Text>
                    </View>
                    <View style={styles.familyPictureContainer}>
                        <ProfilePicture image={require('@/assets/images/emptyProfilePicture.png')}/>
                    </View>
                    <View style={[styles.familyPictureContainer, {zIndex: -2}]}>
                        <ProfilePicture image={require('@/assets/images/emptyProfilePicture.png')}/>
                    </View>
                    <View style={[styles.familyPictureContainer, {zIndex: -3}]}>
                        <ProfilePicture image={require('@/assets/images/emptyProfilePicture.png')}/>
                    </View>
                </TouchableOpacity>

                <Text style={styles.servicesText}>Vos services </Text>
                <View style={styles.servicesIcons}>
                    <IconServices image={require('@/assets/images/Todo.png')} title="ToDo List"
                                  route="/ToDoList/ToDoListHome"/>
                    <IconServices image={require('@/assets/images/agenda.png')} title="Agenda" route="/agenda"/>

                </View>

                <View style={styles.servicesIcons}>
                    <IconServices image={require('@/assets/images/familyIcon.png')} title="Famille" route={familyPath}/>
                    <IconServices image={require('@/assets/images/shoppingCart.png')} title="Liste de Course"
                                  route={"/ShoppingList/shoppingListHome"}/>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({

    imgTukki: {
        position: 'absolute',
        top: ScreenHeight * 0.09,
        left: ScreenWidth * 0.06,
        width: 120,
        height: 100,
        zIndex: 2,
    },

    header: {

        width: '100%',
        flexDirection: "row",
        justifyContent: 'flex-end',

    },


    profilePicture: {
        height:'100%',

        marginRight: ScreenWidth * 0.04,
        marginTop: ScreenHeight * 0.023,
        marginBottom:40
    },
    content: {
        elevation: 100,
        backgroundColor: 'white',
        width: ScreenWidth,
        height: ScreenHeight,
        marginTop: 7,
        borderRadius: 35,
        padding: ScreenWidth * 0.1
    },
    hello: {
        marginTop: 6,
        fontSize: 30,
        fontFamily: "Poppins_SemiBold",
        color: '#484848'
    },


    familyContainer: {
        marginTop: ScreenHeight * 0.02,
        height: ScreenHeight * 0.1,
        borderRadius: 100,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        elevation: 5,
        flexDirection: 'row',
    },

    familyNameContainer: {
        backgroundColor: '#ECECEC',
        height: '100%',
        width: '60%',
        borderRadius: 100,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 5,

    },

    familyNameText: {
        fontSize: 20,
        fontFamily: 'Poppins_Bold',
        color: '#484848',
        alignSelf: 'center',
    },

    familyPictureContainer: {

        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '-10%',

    },
    servicesText: {
        marginTop: ScreenHeight * 0.02,
        fontSize: 24,
        fontFamily: 'Poppins_SemiBold',
        color: '#484848',
    },
    servicesIcons: {
        width:ScreenWidth*0.8,
        justifyContent:'space-between',
        alignSelf: 'center',
        flexDirection: 'row',

    },


});