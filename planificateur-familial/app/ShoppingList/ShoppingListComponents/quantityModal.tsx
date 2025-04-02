import React, {useRef} from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
const ScreenWidth = Dimensions.get('window').width;

interface QuantityModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    quantity: number;
    setQuantity: (quantity: number)=> void;
}
const QuantityModal: React.FC<QuantityModalProps> = ({ modalVisible, setModalVisible, quantity, setQuantity }) => {
    const lastQte = useRef(quantity)
    const handleQuantityChange = (text: string) => {
        const parsedQuantity = text.trim() === "" ? 0 : parseInt(text, 10);
        if (!isNaN(parsedQuantity)) {
            setQuantity(parsedQuantity);
        } else {
            setQuantity(0);
        }
    };
    const increaseQte = () => {
        setQuantity(quantity+1)
    }

    const decreaseQte = () => {
        if (quantity > 1 ){
            setQuantity(quantity-1)
        }
    }
    const handleCancelPress = () => {
        setQuantity(lastQte.current)
        setModalVisible(false)
    };
    const handleConfirmPress = () => {
        setModalVisible(false)
        lastQte.current = quantity;
    };
    return(
        <Modal
            statusBarTranslucent={true}
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <TouchableWithoutFeedback onPress={() => {}} style={styles.modalOverlay}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.text}>Quantité</Text>
                        <View style={styles.pickerContainer}>
                            <TouchableOpacity onPress={()=> decreaseQte()}><Image style={styles.img} source={require("@/assets/images/arrow.png")}/></TouchableOpacity>
                            <TextInput keyboardType="numeric"
                                       value={quantity.toString()}
                                       onChangeText={(text)=> handleQuantityChange(text)}

                            ></TextInput>
                            <TouchableOpacity onPress={() => increaseQte()}><Image style={[styles.img, {transform:[{ rotate: "180deg" }]}]} source={require("@/assets/images/arrow.png")}/></TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButtonWrapper} onPress={()=> handleCancelPress()}>
                                <Text style={styles.cancelText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButtonWrapper} onPress={() => handleConfirmPress()}>
                                <Text style={styles.deleteText}>Confirmer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}


const styles = StyleSheet.create({
    modalOverlay: {
        flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent:"center"

    },
    modalView: {
        justifyContent:"space-between",
        backgroundColor: 'white',
        padding:35,
        height:240,
        width:0.88*ScreenWidth,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        elevation: 5,
        marginHorizontal:"auto"
    },
    text: {
        fontSize:28,
        fontFamily:"Poppins_SemiBold",
        lineHeight:34,
        color:"#004B5A"
    },
    pickerContainer: {
        flexDirection:"row",
        backgroundColor:"white",
        elevation:5,
        borderRadius:35,
        width:160,
        justifyContent:"space-between"
    },
    img: {
        height:44,
        resizeMode:"contain"
    },
    buttonContainer: {
        flexDirection:"row",
        justifyContent:"space-between"
    },
    cancelButtonWrapper: {
        borderColor:'#004B5A',
        height:50,
        width:(ScreenWidth-(3*30))/2.35,
        justifyContent:"center",
        alignItems:'center',
        borderRadius:15,
        borderWidth:4,
        flexDirection:"row",
    },
    deleteButtonWrapper: {
        borderColor:'#004B5A',
        backgroundColor:'#004B5A',
        height:50,
        width:(ScreenWidth-(3*30))/2.35,
        justifyContent:"center",
        alignItems:'center',
        borderRadius:15,
        flexDirection:"row",
    },
    deleteText: {
        color:'#ffffff',
        fontFamily:"Poppins_Medium",
        marginLeft:10,
        marginRight:10,
        marginTop:4
    },
    cancelText: {
        color:'#004B5A',
        fontFamily:"Poppins_Medium",
        marginLeft:10,
        marginRight:10,
        marginTop:4
    }

});

export default QuantityModal;