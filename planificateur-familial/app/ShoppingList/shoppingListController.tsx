import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, where} from "firebase/firestore";
import {useEffect, useState} from "react";
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "@firebase/firestore";

import {ShoppingList,ShoppingListItem} from "@/app/ShoppingList/ShoppingListTypes/shoppingListsTypes";


const createShoppingList = async (listName: string, members: string[], items: ShoppingListItem[] = []): Promise<string> => {
    const auth = FIREBASE_AUTH;

    if (!auth.currentUser) {
        throw new Error("L'utilisateur n'est pas connecté.");
    }

    try {
        const db = FIREBASE_FIRESTORE;
        const shoppingListRef = collection(db, "shoppingLists");

        const newList: ShoppingList = {
            name: listName,
            members: members,
            owner: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            items: items
        };

        const docRef = await addDoc(shoppingListRef, newList);
        console.log("Liste de course ajoutée avec l'ID :", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erreur lors de l'ajout de la liste de courses :", error);
        throw error;
    }
};




const getUserShoppingLists = async (): Promise<ShoppingList[]> => {
    const auth = FIREBASE_AUTH;

    if (!auth.currentUser) {
        throw new Error("L'utilisateur n'est pas connecté.");
    }

    try {
        const db = FIREBASE_FIRESTORE;
        const shoppingListRef = collection(db, "shoppingLists");

        const q = query(shoppingListRef, where("members", "array-contains", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        const shoppingLists: ShoppingList[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ShoppingList);

        return shoppingLists;
    } catch (error) {
        console.error("Erreur lors de la récupération des listes de courses :", error);
        throw error;
    }
};

const useShoppingLists = () => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const auth = FIREBASE_AUTH;
        if (!auth.currentUser) return;

        const db = FIREBASE_FIRESTORE;
        const shoppingListRef = collection(db, "shoppingLists");
        const q = query(shoppingListRef, where("members", "array-contains", auth.currentUser.uid));

        // Écoute en temps réel les mises à jour Firestore
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lists: ShoppingList[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }) as ShoppingList);

            setShoppingLists(lists);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { shoppingLists, loading };
};

const useShoppingListById = (listId: string) => {
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!listId) return;

        const listRef = doc(FIREBASE_FIRESTORE, "shoppingLists", listId);

        const unsubscribe = onSnapshot(listRef, (docSnap) => {
            if (docSnap.exists()) {
                setShoppingList({ id: docSnap.id, ...docSnap.data() } as ShoppingList);
            } else {
                console.log("Aucune liste trouvée avec cet ID");
                setShoppingList(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [listId]);

    return { shoppingList, loading };
};


const createShoppingListItem = async (listId: string, item: ShoppingListItem) => {
    try {
        const listRef = doc(FIREBASE_FIRESTORE, "shoppingLists", listId);

        const docSnap = await getDoc(listRef);
        if (!docSnap.exists()) {
            console.error("Liste non trouvée !");
            return false;
        }

        const listData = docSnap.data();

        const currentItems = Array.isArray(listData.items) ? listData.items : [];

        await updateDoc(listRef, {
            items: [...currentItems, {
                ...item
            }]
        });

        return true;
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'item :", error);
        return false;
    }
};


const toggleItemChecked = async (listId: string, itemId: string, checked: boolean): Promise<void> => {
    try {
        const listRef = doc(FIREBASE_FIRESTORE, "shoppingLists", listId);
        const docSnap = await getDoc(listRef);

        if (!docSnap.exists()) {
            console.error("Liste non trouvée !");
            return;
        }

        const listData = docSnap.data();
        const updatedItems = listData.items.map((item: ShoppingListItem) =>
            item.id === itemId ? { ...item, checked: !checked } : item
        );

        await updateDoc(listRef, { items: updatedItems });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'état checked :", error);
    }
};
const listenToItemChecked = (listId: string, itemId: string, callback: (checked: boolean) => void): (() => void) => {
    const listRef = doc(FIREBASE_FIRESTORE, "shoppingLists", listId);

    const unsubscribe = onSnapshot(listRef, (snapshot) => {
        if (snapshot.exists()) {
            const listData = snapshot.data();
            const item = listData.items.find((item: ShoppingListItem) => item.id === itemId);
            callback(item ? item.checked || false : false);
        }
    });

    return unsubscribe;
};

const deleteList = async (listId: string) => {
    try {
        if (!listId) {
            console.error("ID de la liste non valide.");
            return;
        }

        await deleteDoc(doc(FIREBASE_FIRESTORE, "shoppingLists", listId));
        console.log("Liste supprimée avec succès !");
    } catch (error) {
        console.error("Erreur lors de la suppression de la liste :", error);
    }
};
export { createShoppingList, getUserShoppingLists , useShoppingLists, useShoppingListById, createShoppingListItem, deleteList, toggleItemChecked,listenToItemChecked};
