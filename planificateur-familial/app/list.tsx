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
import ListCategories from "@/components/ListCategories";


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

            <View style={styles.header}>
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
                <Text style={styles.listText}>Listes</Text>

            </View>
            <Text style={styles.categoriesText}>4 catégories</Text>


            <View style={styles.content}>
            <ListCategories title={"Aujourd'hui"} categoriesNumber={5} color={"red"} route={"/todo"}/>
            <ListCategories title={"Cette semaine"} categoriesNumber={7} color={"blue"} route={""}/>
            <ListCategories title={"Ce mois"} categoriesNumber={10} color={"green"} route={""}/>
            <ListCategories title={"Toutes mes tâches"} categoriesNumber={31} color={"orange"} route={""}/>


            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({



    header: {
        height:100,
        justifyContent:'center'
    },
    buttonWrap: {
        height: 60,
        width: 80,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        zIndex: 4, 
      },

    categoriesText: {
        fontSize: 14,
        fontFamily: 'Poppins_Regular',
        color:'white',
        left:95,
        zIndex:4,
        marginTop: -ScreenHeight * 0.03,


    },

    listText: {
        fontSize: 36,
        fontFamily: 'Poppins_Bold',
        color:'white',
        marginTop: ScreenHeight * 0.023,
        left:95,
        zIndex:4,
    },


    profilePicture: {
        height:'100%',

        marginRight: ScreenWidth * 0.04,
        marginTop: ScreenHeight * 0.023,
        marginBottom:40
    },
    content: {
        elevation: 100,
        backgroundColor: '#EBEBEB',
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