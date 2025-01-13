import Header from '@/components/Header';

import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { RelativePathString, router } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Dimensions, SafeAreaView, StatusBar, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';





const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const Login = () => {

    React.useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('#FED77C'); // Barre de navigation transparente
            NavigationBar.setButtonStyleAsync('light'); // Icônes en blanc
        }
    }, []);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;

    const handleForgotPasswordClick = () => {
        router.push('/forgotPassword' as RelativePathString);
    };

    const handleSignupClick = () => {
        router.push('/signup' as RelativePathString);
    };

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    const signUp = async () => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);  // Envoi l'email de confirmation
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };





    return (

        <SafeAreaView style={styles.SafeArea}>
            <Image source={require('@/assets/images/edit-pen-icon.jpg')}  style={styles.imgEdit} />
            <Image source={require('@/assets/images/pp.jpg')}  style={[styles.pp]} />


            <View style={styles.mainContainer}>
                <LinearGradient
                    colors={['#4FE2FF', '#004B5A', '#002C35']}
                    locations={[0, 0.8, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ height: ScreenHeight *0.36, }}
                />
                <View style={styles.centerContainer}>
                    <View>
                        <Text style={styles.nameText}>Prénom</Text>
                        <Text style={styles.ageText}>Age</Text>

                    </View>
                </View>
            </View>
            <View style={styles.Container}>
                <Text style={styles.titleText}>Famille</Text>
                <Image source={require('@/assets/images/three-points.png')}  style={[styles.imgThreePoints,{top:ScreenHeight*0.028}]} />

                <TouchableOpacity style={styles.familyContainer}>
                    <Text style={styles.familyText}>Boubakar</Text>
                </TouchableOpacity>
                <Text style={[styles.titleText,{marginTop:ScreenHeight*0.035}]}>Badges   <Image source={require('@/assets/images/info.png')}  style={[styles.imgInfo]} />
                </Text>

            </View>

        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({

    Container: {
        marginTop: -ScreenHeight*0.1,
        marginLeft: ScreenWidth*0.1,
        alignContent: 'center',
        alignItems: 'center',
        flex: 1,

    },
    mainContainer: {
        flex: 1,
        alignContent: 'center',
    },
    centerContainer: {
        width: ScreenWidth*0.9,
        height: ScreenHeight*0.2,
        backgroundColor: '#E7E7E7',
        position: 'absolute',
        alignSelf: 'center',
        marginTop: ScreenWidth*0.52,
        borderRadius: 20,
        elevation: 10,
        shadowColor: 'black',
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 20,
        fontFamily: 'Poppins_Bold',
        color: 'black',
        marginTop: ScreenHeight*0.04,

        alignSelf: 'center',
    },
    titleText: {
        fontSize: 26,
        fontFamily: 'Poppins_Bold',
        color: 'black',
        marginTop: ScreenHeight*0.01,
        alignSelf: 'flex-start',

    },
    ageText: {
        fontSize: 20,
        fontFamily: 'Poppins_Regular',
        color: 'black',
        alignSelf: 'center',
        opacity: 0.5,
        marginTop: -ScreenHeight*0.005,
    },
    SafeArea: {
        flex: 1,
        backgroundColor: 'white',
    },

    imgThreePoints: {
        width: ScreenWidth*0.05,
        height: ScreenWidth*0.05,
        position: 'absolute',
        zIndex: 10,
        opacity: 0.5,
        right: ScreenWidth*0.09,
    },

    familyContainer: {
        width: ScreenWidth*0.8,
        height: ScreenHeight*0.08,
        backgroundColor: '#E7E7E7',
        borderRadius: 1000,
        elevation: 10,
        shadowColor: 'black',
        justifyContent: 'center',
        marginTop: ScreenHeight*0.01,
        alignSelf: 'flex-start',


    },
    pp: {
        width: ScreenWidth*0.3,
        height: ScreenWidth*0.3,
        borderRadius: 1000,
        position: 'absolute',
        zIndex: 10,
        top: ScreenHeight*0.18,
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
        paddingLeft: ScreenWidth*0.2,
        opacity: 0.5,
        paddingTop: ScreenHeight*0.008,
    },
    imgEdit: {
        width: ScreenWidth*0.05,
        height: ScreenWidth*0.05,
        marginTop: ScreenHeight*0.05,
        marginLeft: ScreenWidth*0.8,
        position: 'absolute',
        zIndex: 10,
        opacity: 0.5,
        top: ScreenHeight*0.22,
        right: ScreenWidth*0.09,
    },

    imgInfo: {
        width: ScreenWidth*0.05,
        height: ScreenWidth*0.05,
        position: 'absolute',
        zIndex: 10,
        opacity: 0.5,

    },

});
