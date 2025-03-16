import React from 'react'
import {StyleSheet, View, Text, Image} from "react-native";



type Props = {
    title: string;
    quantity: number;
    magasin: string;
    isChecked: boolean;
};

const Product = ({ title,quantity, magasin, isChecked}: Props) => {
    return (
        <View style = {styles.productContainer}>
            <View style = {styles.leftContainer}>

                <View style={styles.ProductDataContainer}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{title}</Text>
                    
                    <View style={styles.detailsContainer}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.details}>Qte: {quantity}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.details}>{magasin}</Text>
                    </View>
                </View>
                <View
                    style={styles.checkButton}>

                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

        leftContainer: {
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: 'center',
            width:'100%'
        },
        productContainer: {
            backgroundColor: '#3FC3DD',
            height: 70,
            width: '80%',
            flexDirection:"row",
            justifyContent: 'space-between',
            borderRadius: 20,
            elevation:5,
            alignSelf: 'center',

        },
        button: {

            height:20,
            width:20,
            borderRadius: 14,
            marginLeft:10,
            marginRight:10,
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
        },

        centerButton : {

            backgroundColor:'white',
            height:14,
            width:14,
            borderRadius: 7,
        },
        checkButton: {
            width:24,
            height:24,
            marginLeft:9,
            marginRight:20,
            borderRadius: 5,
            backgroundColor:"transparent",
            borderStyle:"solid",
            borderColor:"white",
            borderWidth:3,
            opacity:0.75,
        },
        title: {
            marginLeft:20,
            fontFamily:"Poppins_SemiBold",
            fontSize : 16,
            color:"white",
            textAlign:"left",
            maxWidth: '90%',
        },

        detailsContainer: {
            flexDirection: "row",
            marginLeft:20,
            marginTop:5,
        },

        details: {
            backgroundColor:"white",
            borderColor:"#4FE2FF",
            borderWidth: 1,
            borderRadius: 5,
            fontFamily:"Poppins_Regular",
            fontSize : 14,
            textAlign:"left",
            color:"#4FE2FF",
            marginRight:10,
            marginTop:-8,
        },
        ProductDataContainer: {
            alignItems:"flex-start",
        }


    }
)
export default Product;