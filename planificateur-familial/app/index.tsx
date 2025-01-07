<<<<<<< Updated upstream
import {Text, View} from "react-native";
import * as Font from 'expo-font';
import {useEffect,} from "react";
=======
import {Button, Text, View} from "react-native";
>>>>>>> Stashed changes
import IndexTabBar from '@/components/IndexTabBar';
import Header from '@/components/Header'
import { useRouter } from 'expo-router';
import {StatusBar} from "expo-status-bar";




export default function Index() {
    const router = useRouter();
    const handleToDoClick = () => {
        router.push('/todo');
    };


    const handleLoginClick = () => {
        router.push('/login');
    };

    return (
        <View style={{flex:1,backgroundColor:"white"}}>
            <StatusBar style="dark" backgroundColor="#FFFFFF" />
            <Text style={{marginTop:25}} onPress={handleToDoClick}>Todo</Text>
            <Button title="Go to Login" onPress={handleLoginClick} />
            <IndexTabBar/>
        </View>
    );
}