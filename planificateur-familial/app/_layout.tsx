import {SplashScreen, Stack} from "expo-router";
import { useFonts } from '@expo-google-fonts/poppins';
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_Regular: require('@expo-google-fonts/poppins/Poppins_400Regular.ttf'),
    Poppins_Medium: require('@expo-google-fonts/poppins/Poppins_500Medium.ttf'),
    Poppins_Bold: require('@expo-google-fonts/poppins/Poppins_700Bold.ttf'),
    Poppins_SemiBold: require('@expo-google-fonts/poppins/Poppins_600SemiBold.ttf'),
  });




  if (!fontsLoaded) {
    SplashScreen.preventAutoHideAsync();
    return null;
  }


  SplashScreen.hideAsync();
  return <Stack screenOptions={{headerShown: false}}/>;
}
