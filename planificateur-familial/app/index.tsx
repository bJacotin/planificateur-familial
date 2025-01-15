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


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default function Index() {
    const [name, setName] = useState<string>("Jean-Michel")
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

        if (pathname=== '/') {
            fetchProfilePicture();
        }
    }, [pathname]);



    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('#FFFFFF');
            NavigationBar.setButtonStyleAsync('light');
        }

    }, []);


    const [userPP, setUserPP] = useState<string>('');
    const fetchProfilePicture = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('test')
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
                        console.log("Image récupérée : ", pp);
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
            style={{height: ScreenHeight * 0.36,marginTop:25}}
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
                <View style={styles.familyContainer}>
                    <View style={styles.familyNameContainer}>
                        <Text style={styles.familyNameText}>Ma famille</Text>
                    </View>
                    <View style={styles.familyPictureContainer}>
                        <ProfilePicture image={require('@/assets/images/pp.jpg')}/>
                    </View>


                </View>
                <Text style={styles.servicesText}>Vos services </Text>
                <View style={styles.servicesIcons}>
                    <IconServices image={require('@/assets/images/Todo.png')} title="ToDo List" route="/todo"/>
                    <IconServices image={require('@/assets/images/agenda.png')} title="Agenda" route="/agenda"/>
                    <IconServices image={require('@/assets/images/Todo.png')} title="ToDo" route={"/family"}/>
                    <IconServices image={require('@/assets/images/Todo.png')} title="ToDo" route={"/family"}/>
                </View>

                <View style={styles.servicesIcons}>
                    <IconServices image={require('@/assets/images/Todo.png')} title="ToDo" route={"/family"}/>
                    <IconServices image={require('@/assets/images/Todo.png')} title="ToDo" route={"/family"}/>
                    <IconServices image={require('@/assets/images/Todo.png')} title="ToDo" route={"/family"}/>
                    <IconServices image={require('@/assets/images/Todo.png')} title="ToDo" route={"/family"}/>


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
        color: '# 484848'
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
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },


});