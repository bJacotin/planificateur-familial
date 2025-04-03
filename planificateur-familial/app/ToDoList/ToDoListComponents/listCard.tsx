import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import { TodoList } from '../ToDoListTypes/ToDoListsTypes'; // Mettez à jour l'import
import { RelativePathString, useRouter } from "expo-router"; // Utilisez useRouter
import { deleteList } from "../ToDoListController"; // Mettez à jour l'import
import ConfirmDeleteModal from "@/components/modal/confirmDeleteModal";

const ListCard: React.FC<{ list: TodoList }> = ({ list }) => {
    const router = useRouter();
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

    const handlePress = () => {
        console.log(list.id);
        if (list.id) {
            router.push({ pathname: "/ToDoList/"+list.id as RelativePathString, params: { id: list.id } });
        } else {
            console.error("ID de la liste non défini.");
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} onLongPress={() => setDeleteModalVisible(true)}>
            <View>
                <Text style={styles.title}>{list.name}</Text>
                <View style={styles.sizeBg}>
                    <Text style={styles.size}>{list.items.length} tâches</Text>
                </View>
            </View>
            <Image style={styles.arrow} source={require("@/assets/images/arrowLeft.png")} />
            <ConfirmDeleteModal
                modalVisible={deleteModalVisible}
                setModalVisible={setDeleteModalVisible}
                handlePress={() => deleteList(list.id)}
                deletedObject={"la liste"}
            />
        </TouchableOpacity>
    );
};

export default ListCard;

const styles = StyleSheet.create({
    card: {
        alignSelf: "center",
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        backgroundColor: "#3FC3DD",
        width: 330,
        height: 62,
        marginTop: 25,
        paddingLeft: 36,
        elevation: 5,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    arrow: {
        transform: [{ rotate: '180deg' }],
        height: 44,
        width: 51,
        marginTop: 8
    },
    sizeBg: {
        backgroundColor: "#ffffff",
        marginBottom: 4,
        width: 100,
        height: 18,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "#ffffff",
        fontSize: 20,
        fontFamily: "Poppins_Medium",
    },
    size: {
        color: "#3FC3DD",
        fontSize: 14,
        fontFamily: "Poppins_Medium",
        bottom: 2
    }
});
