import {Text, View} from "react-native";
import * as Font from 'expo-font';
import {useEffect,} from "react";
import IndexTabBar from '@/components/IndexTabBar';
import Header from '@/components/Header'
import { useRouter } from 'expo-router';
import {StatusBar} from "expo-status-bar";




export default function Index() {
    const router = useRouter();
    const handleToDoClick = () => {
        router.push('/todo');
    };

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
            });

        };

        loadFonts()
    }, []);


    return (
        <View style={{flex:1,backgroundColor:"white"}}>
            <StatusBar style="dark" backgroundColor="#FFFFFF" />

            <Text style={{marginTop:25}} onPress={handleToDoClick}>Todo</Text>
            <IndexTabBar/>

        </View>

    );
}
