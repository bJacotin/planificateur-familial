import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {addDoc, collection, getDocs, query, serverTimestamp, where} from "firebase/firestore";
import {useEffect, useState} from "react";
import {onSnapshot} from "@firebase/firestore";

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
export { createShoppingList, getUserShoppingLists , useShoppingLists};
