import Header from '@/components/Header';

import { FIREBASE_AUTH } from '@/FirebaseConfig';

import { LinearGradient } from 'expo-linear-gradient';
import {router, useRouter} from 'expo-router';
import React, {useEffect} from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Dimensions, SafeAreaView, StatusBar, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { sendPasswordResetEmail } from 'firebase/auth';





const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const ForgotPassword = () => {
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const handleResetPassword = async () => {
      try {
        await sendPasswordResetEmail(FIREBASE_AUTH, email);
        alert('Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.');
      } catch (error) {
        console.error(error);
        alert('Erreur lors de l\'envoi de l\'email : vérifiez l\'adresse saisie.');
      }
    };
  
    useEffect(() => {
      if (Platform.OS === 'android') {
        NavigationBar.setBackgroundColorAsync('#FED77C');
        NavigationBar.setButtonStyleAsync('light');
      }
    }, []);





  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image source={require('@/assets/images/soleil.png')}  style={styles.imgSun} />
      <Image source={require('@/assets/images/nuages1.png')}  style={styles.imgNuage1} />
      <Image source={require('@/assets/images/nuages2.png')}  style={styles.imgNuage2} />
      <Image source={require('@/assets/images/Group20.png')}  style={styles.imgTukki} />
      <Image source={require('@/assets/images/plage.png')}  style={styles.imgPlage} />

      <View style={styles.imgBulle}>
        <Image source={require('@/assets/images/Rectangle526.png')} style={{zIndex:5  }} />
        <Text style={[styles.textBulle, {zIndex:8 }]}>T'as oublié ton mot de passe ? Pas d'inquiétude</Text>
      </View>

      




      <StatusBar barStyle="dark-content" backgroundColor="rgba(255, 255, 255, 0)" />
      <LinearGradient
        colors={['#4FE2FF', '#004B5A', '#002C35']}
        locations={[0, 0.8, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.mainContainer}
      >
        <TouchableOpacity onPress={() => router.push('/')} style={[{zIndex: 4}, {position:'absolute'}]} > {/* refer to index / */}
          <LinearGradient 
            colors={['#4FE2FF', '#4FE2FF']} // Dégradé
            style={styles.buttonWrap}
            start={{ x: 1, y: -0.2 }}
            end={{ x: 0, y: 1 }
            }
            
          >
            <Image source={require("@/assets/images/arrowLeft.png")}  />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.container}>
          <View style={[styles.fieldWrapper, { marginTop: ScreenHeight*0.13}] }>
          <TextInput
            style={styles.fieldText}
            placeholder="Votre email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
        />
            
          </View>


          
          { loading ? <ActivityIndicator size="large" color="#0000ff" /> : <>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#36B1CA' }]} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>RÉINITIALISER LE MOT DE PASSE</Text>
            </TouchableOpacity>
          

          </> }
        </View>
      </LinearGradient>
      
    </SafeAreaView>
  );
};



export default ForgotPassword;

const styles = StyleSheet.create({
  fieldText : {
    marginTop: 5,
    color: "white",
    width: "100%",
    height: 60,
    fontSize: 20,
    fontFamily: "Poppins_Medium",
  },
  fieldWrapper: {
    alignSelf: "center",
    display: "flex",
    padding: ScreenWidth * 0.05,
    justifyContent: "center",
    width: ScreenWidth*0.75,
    height: 62,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
    backgroundColor: '#3FC3DD',
    margin: ScreenWidth * 0.025,
    elevation: 5,  // Ombre pour Android
    overflow: 'hidden',  // Force l'ombre à suivre le borderRadius
  },
  button: {
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: ScreenWidth * 0.75,
    marginTop: 14,
    marginBottom: 14,
    height: 46,
    borderRadius: 95,
    borderWidth: 2,
    borderColor: "white",
    zIndex: 10,

  },
  buttonText: {
    marginTop: 3,
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins_Bold",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "pink",
  },
  clickableLink: {
    color: "white",
    fontSize: 12,
    fontFamily: "Poppins_Regular",
    height: 14,
  },
  container: {
    display: "flex",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrap: {
    height: 60,
    width: 80,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    marginTop: ScreenHeight * 0.10,
    zIndex: 4, // Assurez-vous que la flèche est au-dessus de nuage1
  },
  underlineContainer: {
    alignSelf: 'flex-end',
    borderBottomWidth: 1,  // Crée un underline
    borderBottomColor: 'white',
    width: 'auto',  // La largeur s'adapte au texte
    paddingBottom: 1,  // Espace entre le texte et le underline
    marginRight: ScreenWidth * 0.14,  // Marge à droite
    marginBottom: 42,  // Marge en bas
    marginTop: 10,  // Marge en haut
  },



  imgSun: {
    position: 'absolute',
    top: ScreenHeight * 0.07,
    right: ScreenWidth * 0.05,
    width: ScreenWidth * 0.32,
    height: ScreenWidth * 0.32,
    zIndex: 3,

  },
  imgNuage1: {
    position: 'absolute',
    top: ScreenHeight * 0.14,
    left: ScreenWidth * 0.040,
    width: ScreenWidth * 0.4,
    height: ScreenWidth * 0.25,
    zIndex: 4,
  },
  imgNuage2: {
    position: 'absolute',
    top: ScreenHeight * 0.255,
    right: ScreenWidth * 0.15,
    width: ScreenWidth * 0.32,
    height: ScreenWidth * 0.2,
    zIndex: 6,
  },
  imgBulle: {
    position: 'absolute',
    top: ScreenHeight * 0.17,
    right: ScreenWidth * 0.1,
    width: ScreenWidth * 0.58,
    height: ScreenWidth * 0.23,
  },
  imgTukki: {
    position: 'absolute',
    top: ScreenHeight * 0.298,
    left: ScreenWidth * 0.17,
    width: ScreenWidth * 0.3,
    height: ScreenWidth * 0.25,
    zIndex: 2,
  },
  imgPlage: {
    position: 'absolute',
    bottom: 0,
    right: ScreenWidth * -0.15,
    width: ScreenWidth*1.4,
    height: ScreenWidth * 0.7,
    zIndex: 1,
  },
  textBulle: {
    position: 'absolute',
    top: ScreenWidth * 0.03,
    left: ScreenWidth * 0.06,
    color: '#42484F',
    fontFamily: 'Poppins_Bold',
    
    fontSize: 20,
    width: ScreenWidth * 0.6,
    height: ScreenWidth * 0.14,
  },
});