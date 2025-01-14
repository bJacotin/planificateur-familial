import {
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

import { useRouter, RelativePathString} from 'expo-router';
import {StatusBar} from "expo-status-bar";
import React, {useEffect, useState} from "react";
import * as NavigationBar from "expo-navigation-bar";
import {onAuthStateChanged} from "firebase/auth";
import {FIREBASE_AUTH} from "@/FirebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { ProfilePicture } from '@/components/ProfilePicture';
import { IconServices } from "@/components/IconServices";




const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default function Index() {
    const [name,setName] = useState<string>("Jean-Michel")
    const router = useRouter();
    const handleToDoClick = () => {
        router.push('/todo');
    };
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

    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('#FFFFFF');
            NavigationBar.setButtonStyleAsync('light');
        }
    }, []);

    const profilePicture = require('@/assets/images/emptyProfilePicture.png');
    return (
        <LinearGradient
                            colors={['#4FE2FF', '#004B5A', '#002C35']}
                            locations={[0, 0.8, 1]}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={{ height: ScreenHeight *0.36 }}
                        >
            <StatusBar style="dark" backgroundColor="black"/>
            <Image source={require('@/assets/images/Group20.png')}  style={styles.imgTukki} />

            <View style={styles.header}>
                <Text style={styles.famzoneTitle}>FamZone</Text>

                <TouchableOpacity onPress={handleProfileClick} style={styles.profilePicture}>
                    <ProfilePicture image={require('@/assets/images/pp.jpg') }/>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.hello}>Bonjour, {name} !</Text>
                <View style={styles.familyContainer}>
                    <View style={styles.familyNameContainer}>
                        <Text style={styles.familyNameText}>Ma famille</Text>
                    </View>
                    <View style={styles.familyPictureContainer}>
                        <ProfilePicture image={require('@/assets/images/pp.jpg') }/>
                    </View>


                </View>
                <Text style={styles.servicesText}>Vos services </Text>
                <View style={styles.servicesIcons}>
                    <IconServices image={require('@/assets/images/Todo.png') } title="ToDo List"/>
                    <IconServices image={require('@/assets/images/agenda.png') } title="Agenda"/>
                    <IconServices image={require('@/assets/images/Todo.png') } title="ToDo"/>
                    <IconServices image={require('@/assets/images/Todo.png') } title="ToDo"/>
                </View>

                <View style={styles.servicesIcons}>
                    <IconServices image={require('@/assets/images/Todo.png') } title="ToDo"/>
                    <IconServices image={require('@/assets/images/Todo.png') } title="ToDo"/>
                    <IconServices image={require('@/assets/images/Todo.png') } title="ToDo"/>
                    <IconServices image={require('@/assets/images/Todo.png') } title="ToDo"/>


                </View>


            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({

    imgTukki: {
        position: 'absolute',
        top: ScreenHeight * 0.065,
        left: ScreenWidth * 0.03,
        width: 80,
        height: 65,
        zIndex: 2,
    },

    header: {
        marginTop: 50,
        width:'100%',
        flexDirection: "row",
        justifyContent: 'space-between',
        },

    famzoneTitle: {
        left: ScreenWidth * 0.27,
        alignSelf: 'center',
        fontSize: 40,
        fontFamily: 'Poppins_Bold',
        color: 'white',
        opacity: 0.8
    },
    profilePicture:{
        alignSelf:'flex-end',
        marginRight:ScreenWidth*0.03
    },
    content: {
        elevation:100,
        backgroundColor:'white',
        width:ScreenWidth,
        height:ScreenHeight,
        marginTop:7,
        borderRadius:35,
        padding:ScreenWidth*0.1
    },
    hello:{
        marginTop:6,
        fontSize:36,
        fontFamily: "Poppins_Bold",
        color:'# 484848'
    },


    familyContainer: {
        marginTop: ScreenHeight * 0.02,
        height: ScreenHeight * 0.1,
        borderRadius:100,
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
        alignSelf:'flex-start',
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
        marginLeft:'-10%',
        
    },
    servicesText: {
        marginTop: ScreenHeight * 0.02,
        fontSize: 26,
        fontFamily: 'Poppins_Bold',
        color: '#484848',
    },
    servicesIcons: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    

});