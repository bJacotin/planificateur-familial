import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {useRouter} from "expo-router";

type Props = {
    text : string
}

const Header = ({text} :Props ) => {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.header} onPress={() =>router.push('/')} > // refer to index /
            <LinearGradient
                colors={['#4FE2FF', '#4FE2FF']}
                style={styles.buttonWrap}
                start={{ x: 1, y: -0.2 }}
                end={{ x: 0, y: 1 }}
            >
                <Image style={styles.arrow} source={require("@/assets/images/arrowLeft.png")}></Image>
            </LinearGradient>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>

    );
};

const styles = StyleSheet.create({
    header: {
        marginTop:0,
        width:'100%',
        height:70,
        display:"flex",
        flexDirection: "row",
        alignItems:"center"
    },
    buttonWrap: {
        height:60,
        width: 80,
        borderTopRightRadius:20,
        borderBottomRightRadius:20,
        elevation:4,
    },
    arrow: {
        alignSelf:'flex-end'
    },
    text: {
        fontSize:32,
        fontFamily:'Poppins-SemiBold',
        marginLeft:10,
    }

});

export default Header;