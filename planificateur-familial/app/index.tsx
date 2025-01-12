import {Button, Text, View} from "react-native";
import IndexTabBar from '@/components/IndexTabBar';
import { useRouter, RelativePathString, ExternalPathString } from 'expo-router';
import {StatusBar} from "expo-status-bar";




export default function Index() {
    const router = useRouter();
    const handleToDoClick = () => {
        router.push('/todo');
    };


    const handleLoginClick = () => {
        router.push('/login' as RelativePathString);
    };

    const handleProfileClick = () => {
        router.push('/profile' as RelativePathString);
    };

    return (
        <View style={{flex:1,backgroundColor:"white"}}>
            <StatusBar style="dark" backgroundColor="#FFFFFF" />
            <Text style={{marginTop:25}} onPress={handleToDoClick}>Todo</Text>
            <Button title="Go to Login" onPress={handleLoginClick} />
            <Button title="Go to Profile" onPress={handleProfileClick} />

            <IndexTabBar/>
        </View>
    );
}