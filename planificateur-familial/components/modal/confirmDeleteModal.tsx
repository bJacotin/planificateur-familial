import React, {useState} from 'react';
import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {
    Modal,
    View,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    FlatList,
    TouchableOpacity,
    Image,
    Text,
    Platform, StyleSheet, Dimensions,
} from 'react-native';

const ScreenWidth = Dimensions.get('window').width;

interface confirmDeleteModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    handlePress: () => void;
    deletedObject: string,
}

const ConfirmDeleteModal: React.FC<confirmDeleteModalProps> = ({ modalVisible, setModalVisible,deletedObject,handlePress }) => {

    return (
        <Modal
            statusBarTranslucent={true}
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}

        >

                <View style={styles.modalOverlay}>
                        <View style={styles.mainContainer}>
                            <Text style={styles.mainText}>Supprimer {deletedObject}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.cancelButtonWrapper} onPress={()=> setModalVisible(false)}>
                                    <Text style={styles.cancelText}>Annuler</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButtonWrapper} onPress={() => handlePress()}>
                                    <Text style={styles.deleteText}>Supprimer</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                </View>

        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex:1,

        backgroundColor:"rgba(83,83,83,0.66)"
    },
    mainContainer: {
        position:"absolute",
        bottom:0,
        backgroundColor:'white',
        width : ScreenWidth*0.88,
        height: 160,
        borderTopRightRadius:35,
        borderTopLeftRadius:35,
        alignSelf:"center"
    },
    buttonContainer: {
        flexDirection:"row",
        justifyContent:"space-between",
        marginHorizontal:14,
    },
    cancelButtonWrapper: {
        borderColor:'#004B5A',
        height:50,
        width:(ScreenWidth-(3*30))/2,
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
        width:(ScreenWidth-(3*30))/2,
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
    },
    mainText: {
        marginTop:25,
        marginBottom:20,
        color:'#004B5A',
        fontFamily:"Poppins_Medium",
        marginLeft:10,
        marginRight:10,
        fontSize:20,
        textAlign:'center'
    }

});
export default ConfirmDeleteModal;