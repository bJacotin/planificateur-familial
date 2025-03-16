
import {
    BackHandler,
    Button,
    Dimensions, FlatList,
    Image, KeyboardAvoidingView, Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    Touchable,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from "react-native";

import {useRouter, RelativePathString, usePathname} from 'expo-router';
import {StatusBar} from "expo-status-bar";
import React, {useEffect, useState} from "react";
import * as NavigationBar from "expo-navigation-bar";
import {onAuthStateChanged} from "firebase/auth";
import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {LinearGradient} from "expo-linear-gradient";
import {ProfilePicture} from '@/components/ProfilePicture';
import {IconServices} from "@/components/IconServices";
import {addDoc, collection, doc, getDoc, getDocs, where,deleteDoc} from "@firebase/firestore";


import ShoppingListCard from '@/components/ShoppingCard'; 
import ListCourses from "@/components/ListCourses";
import DropDownPicker from 'react-native-dropdown-picker';
import {query} from "@firebase/database";


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const fetchUserFamilies = async () => {
    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
        console.error("Utilisateur non connecté !");
        return [];
    }

    try {
        const userDocRef = doc(FIREBASE_FIRESTORE, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.error("Document utilisateur non trouvé !");
            return [];
        }

        const userFamiliesIds = userDoc.data().families || [];
        if (!Array.isArray(userFamiliesIds) || userFamiliesIds.length === 0) {
            console.log("Aucune famille trouvée pour cet utilisateur.");
            return [];
        }

        const familiesCollection = collection(FIREBASE_FIRESTORE, "families");
        const familiesQuery = query(
            familiesCollection,
            where("__name__", "in", userFamiliesIds)
        );

        const familiesSnapshot = await getDocs(familiesQuery);

        const families = familiesSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || "Famille sans nom",
            ...doc.data(),
        }));

        return families;
    } catch (error) {
        console.error("Erreur lors de la récupération des familles :", error);
        return [];
    }
};

const fetchShoppingLists = async (selectedFamily) => {
    try {
        if (!selectedFamily) {
            console.log("Aucune famille sélectionnée.");
            return [];
        }

        const shoppingListsRef = collection(FIREBASE_FIRESTORE, "shoppingLists");
        const q = query(shoppingListsRef, where("familyId", "==", selectedFamily));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Erreur lors de la récupération des listes de courses :", error);
        return [];
    }
};

export default function homeShoppingList() {
    const [ListTitle, setListTitle] = useState("");
    const [shoppingLists, setShoppingLists] = useState<{ id: string, title: string, route:string}[]>([]);
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                console.log('Utilisateur connecté, reste sur Index');
            } else {
                console.log('Aucun utilisateur connecté');
                router.push('/login' as RelativePathString);
            }
        });
        return () => unsubscribe();

    }, [router]);


    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('#FFFFFF');
            NavigationBar.setButtonStyleAsync('light');
        }

    }, []);


    const [userPP, setUserPP] = useState<string>('');


    const [openFamily, setOpenFamily] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [allFamilies, setAllFamilies] = useState([]);

    // Dropdown pour les membres
    const [openMembers, setOpenMembers] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [membersInFamily, setMembersInFamily] = useState([]);

    useEffect(() => {
        const fetchFamilies = async () => {
            const userFamilies = await fetchUserFamilies();
            const formattedFamilies = userFamilies.map(family => ({
                label: family.name,
                value: family.id,
                members: family.members || [],
                owner: family.owner
            }));
            setAllFamilies(formattedFamilies);

            if (formattedFamilies.length > 0) {
                setSelectedFamily(formattedFamilies[0].value);
            }
        };

        fetchFamilies();
    }, []);

    useEffect(() => {
        const fetchLists = async () => {
            if (selectedFamily) {
                const lists = await fetchShoppingLists(selectedFamily);
                setShoppingLists(lists);
            }
        };
        fetchLists();
    }, [selectedFamily]);

    const createShoppingList = async (title, familyId) => {
        try {
            if (!title ) {
                console.error("Le titre est obligatoires.");
                return;
            }

            console.log("Création de la liste avec :", title, familyId);

            const toShoppingListRef = collection(FIREBASE_FIRESTORE, "shoppingLists");

            await addDoc(toShoppingListRef, {
                title,
                familyId,
                createdBy: FIREBASE_AUTH.currentUser.uid,
                createdAt: new Date(),
            });

            console.log("Shopping list créée avec succès !");
            const updatedLists = await fetchShoppingLists(familyId);
            setShoppingLists(updatedLists);
    

        } catch (error) {
            console.error("Erreur lors de la création de la Shopping list :", error);
        }
    };

    const deleteShoppingList = async (listId) => {
        try {
            if (!listId) {
                console.error("ID de la liste non valide.");
                return;
            }
    
            const listRef = doc(FIREBASE_FIRESTORE, "shoppingLists", listId);
            await deleteDoc(listRef);
    
            console.log("Liste supprimée avec succès !");
            
            setShoppingLists((prevLists) => prevLists.filter(list => list.id !== listId));
        } catch (error) {
            console.error("Erreur lors de la suppression de la liste :", error);
        }
    };

    const handleFamilyChange = async (value) => {
        setSelectedFamily(value);

        const selectedFamily = allFamilies.find((family) => family.value === value);
        console.log("Famille sélectionnée :", selectedFamily);

        if (selectedFamily && Array.isArray(selectedFamily.members)) {

            const membersFormatted = await Promise.all(
                selectedFamily.members.map(async (memberId) => {

                    const memberDocRef = doc(FIREBASE_FIRESTORE, 'users', memberId);
                    const memberDocSnap = await getDoc(memberDocRef);
                    const memberData = memberDocSnap.exists() ? memberDocSnap.data() : null;
                    if (memberId === FIREBASE_AUTH.currentUser.uid) {
                        return null;
                    }
                    return {
                        label: memberData.name ,
                        value: memberId
                    };
                })
            );  

            console.log("Membres formatés :", membersFormatted);
            setMembersInFamily(membersFormatted);
        } else {
            console.log("Pas de membres ou structure incorrecte dans cette famille.");
        }
    };
    const handleSubmit = async () => {
        await createShoppingList(ListTitle, selectedFamily);
        setListTitle("");
        setModalVisible(false);

        const updatedLists = await fetchShoppingLists(selectedFamily);
        setShoppingLists(updatedLists);
    };


    return (
        <LinearGradient
            colors={['#4FE2FF', '#004B5A', '#002C35']}
            locations={[0, 0.8, 1]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={{height: ScreenHeight * 0.36,marginTop:25}}
        >
            <StatusBar style="dark" backgroundColor="#4FE2FF"/>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/')} style={[{ zIndex: 4 }, { position: 'absolute' }]}>
                    <LinearGradient
                        colors={['#4FE2FF', '#4FE2FF']}
                        style={styles.buttonWrap}
                        start={{ x: 1, y: -0.2 }}
                        end={{ x: 0, y: 1 }}
                    >
                        <Image source={require("@/assets/images/arrowLeft.png")} />
                    </LinearGradient>
                </TouchableOpacity>

            </View>
            <Text style={styles.shoppingText}>Listes de</Text>
            <Text style={styles.shoppingText}>Courses</Text>

            <Image source={require('@/assets/images/Group20.png')} style={styles.imgTukki}/>

            <ScrollView style={styles.content}>

                {shoppingLists.map((list) => (
                    <TouchableOpacity key={list.id} onPress={() => router.push(`/ShoppingItem?id=${list.id}`)} onLongPress={() => deleteShoppingList(list.id)}>
                        <ListCourses title={list.title} route="/ShoppingItem" id={list.id} />
                    </TouchableOpacity>
                ))}

            </ScrollView>
            <TouchableOpacity style={styles.newListButton} onPress={(): void => setModalVisible(true)}>
                    <Text style={styles.buttonLabel}>+</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.modalView}
                        >
                            <TextInput value={ListTitle} placeholder="Titre Liste" style={styles.titleInput} onChangeText={setListTitle} />

                            <LinearGradient
                                colors={['#4FE2FF', '#004B5A', '#002C35']}
                                locations={[0, 0.8, 1]}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={{width: ScreenWidth, height:ScreenHeight*0.012}}></LinearGradient>
                            <DropDownPicker
                                open={openFamily}
                                value={selectedFamily}
                                items={allFamilies}
                                setOpen={setOpenFamily}
                                setValue={setSelectedFamily}
                                placeholder="Sélectionnez une famille"
                                onChangeValue={handleFamilyChange}
                                zIndex={0} // Important pour la gestion de la superposition
                                zIndexInverse={1000}
                                style={styles.dropdown}
                            />

                            <DropDownPicker

                                open={openMembers}
                                value={selectedMembers}
                                items={membersInFamily}
                                setOpen={setOpenMembers}
                                setValue={setSelectedMembers}
                                setItems={setMembersInFamily}
                                multiple={true} // Pour permettre la sélection multiple
                                mode="BADGE" // Affiche les valeurs sous forme de badges
                                placeholder="Sélectionnez des membres"
                                zIndex={2000}
                                zIndexInverse={2000}
                                style={styles.dropdown}

                            />
                            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                                <Image style={styles.submitImg} source={require("@/assets/images/arrowLeft.png")}></Image>
                            </TouchableOpacity>


                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    labelText: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    dropdown: {
        marginVertical: 10,
        marginHorizontal:30,
        width:ScreenWidth-60,

    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalView: {
        justifyContent:"space-around",
        backgroundColor: 'white',
        paddingTop:15,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        elevation: 5,
    },
    titleInput: {
        width: '100%',
        fontFamily:"Poppins_SemiBold",
        fontSize:28,
        paddingHorizontal:30,
    },
    descriptionInput: {
        paddingHorizontal:30,
        marginTop:-20,
        marginBottom: -10,
        width: '100%',
        fontFamily:"Poppins_SemiBold",
        fontSize:20,
        opacity:0.6
    },
    newListButton: {
        position: "absolute",
        top: ScreenHeight * 0.88,
        right: 10,
        backgroundColor: "#4FE2FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    buttonLabel: {

        color: 'white',
        fontFamily: "Poppins_Regular",
        marginTop: 8,
        marginLeft: 2,
        fontSize: 36,
        alignSelf: "center",
    },

    header: {
        height:100,
        justifyContent:'center'
    },
    buttonWrap: {
        height: 60,
        width: 80,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        zIndex: 4,
    },

    shoppingText: {
        fontSize: 25,
        fontFamily: 'Poppins_Bold',
        color:'white',
        left:30,
        zIndex:4,
        marginTop: -ScreenHeight * 0.02,
    },

    listText: {
        fontSize: 36,
        fontFamily: 'Poppins_Bold',
        color:'white',
        marginTop: ScreenHeight * 0.023,
        left:95,
        zIndex:4,
    },


    profilePicture: {
        height:'100%',

        marginRight: ScreenWidth * 0.04,
        marginTop: ScreenHeight * 0.023,
        marginBottom:40
    },
    content: {
        elevation: 100,
        backgroundColor: '#EBEBEB',
        width: ScreenWidth,
        minHeight: ScreenHeight*0.89,
        marginTop: 7,
        borderRadius: 35,
        padding: ScreenWidth * 0.1
    },
    hello: {
        marginTop: 6,
        fontSize: 30,
        fontFamily: "Poppins_SemiBold",
        color: '# 484848'
    },

    imgTukki: {
        position: 'absolute',
        top: ScreenHeight * 0.06,
        left: ScreenWidth * 0.6,
        width: 120,
        height: 100,
        zIndex: 2,
    },

    familyContainer: {
        marginTop: ScreenHeight * 0.02,
        height: ScreenHeight * 0.1,
        borderRadius: 100,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        elevation: 5,
        flexDirection: 'row',
    },

    familyNameContainer: {
        backgroundColor: '#ECECEC',
        height: '100%',
        width: '60%',
        borderRadius: 100,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 5,

    },

    familyNameText: {
        fontSize: 20,
        fontFamily: 'Poppins_Bold',
        color: '#484848',
        alignSelf: 'center',
    },

    familyPictureContainer: {

        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '-10%',

    },
    servicesText: {
        marginTop: ScreenHeight * 0.02,
        fontSize: 24,
        fontFamily: 'Poppins_SemiBold',
        color: '#484848',
    },
    servicesIcons: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        alignSelf:"flex-end",
        marginRight:30,
        marginVertical:10,
        width:40,
        height:40,
        backgroundColor:"#4FE2FF",
        borderRadius:12,
        justifyContent:"center",
        alignItems:"center"
    },
    submitImg: {
        transform: [{rotate: '180deg'}],
        marginLeft:4,
        height:40,
        width:40,
    }

});
