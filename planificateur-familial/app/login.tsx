import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from '@firebase/auth';
import React from 'react';
import { View, Text, TextInput, ActivityIndicator, Button } from 'react-native';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const auth = FIREBASE_AUTH;

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
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink'}}>
      <Text>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        autoCapitalize='none'
        onChangeText={(text) => setEmail(text)}
        >
        </TextInput>
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        >
        </TextInput>
      { loading ? <ActivityIndicator size="large" color="#0000ff" /> : <>
        <Button title="Login" onPress={signIn}/>
        <Button title="Create account" onPress={signUp} />
      </> }
    </View>
  );
};


export default Login;
