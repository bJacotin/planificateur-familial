import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, where} from "firebase/firestore";
import {useEffect, useState} from "react";
import {arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "@firebase/firestore";

import {ShoppingList, ShoppingListDto, ShoppingListItem} from "@/app/ShoppingList/ShoppingListTypes/shoppingListsTypes";
import {User} from "@/types/user";


const createShoppingList = async (listName: string, members: User[], owner:User): Promise<string> => {
    const auth = FIREBASE_AUTH;
    const items: ShoppingListItem[] = []
    if (!auth.currentUser) {
        throw new Error("L'utilisateur n'est pas connecté.");
    }

    try {
        const db = FIREBASE_FIRESTORE;
        const shoppingListRef = collection(db, "shoppingLists");
        const memberIds = members.map(member => member.id);
        const newList: ShoppingListDto = {
            name: listName,
            members: memberIds,
            owner: owner.id,
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


        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const listsQuery: ShoppingListDto[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }) as ShoppingListDto);

            const lists = dtoToShoppingLists(listsQuery)

            setShoppingLists(await lists);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { shoppingLists, loading };
};

const dtoToShoppingLists = async (dtoShoppingLists: ShoppingListDto[]): Promise<ShoppingList[]> => {
    try {
        const usersSnapshot = await getDocs(collection(FIREBASE_FIRESTORE, "users"));
        const users: User[] = usersSnapshot.docs.map(doc => doc.data() as User);


        return dtoShoppingLists.map(dto => {

            const members = dto.members.map(memberId => {
                return users.find(user => user.id === memberId);
            }) as User[];


            const owner = users.find(user => user.id === dto.owner);

            return {
                id: dto.id,
                name: dto.name,
                members: members,
                owner: owner,
                createdAt: dto.createdAt ,
                items: dto.items,
            };
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs ou de la conversion des listes de courses :", error);
        throw error;
    }
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
const deleteItem = async (item:ShoppingListItem, listId: string) => {
    try {
        if (!item || !listId) {
            console.error("ID de l'item ou de la liste non valide.");
            return;
        }

        const listRef = doc(FIREBASE_FIRESTORE, "shoppingLists", listId);


        await updateDoc(listRef, {
            items: arrayRemove({ id: item.id,
                name: item.name,
                quantity: item.quantity,
                checked: item.checked,})
        });

        console.log(`Item avec l'ID ${item.id} supprimé avec succès de la liste ${listId}`);
    } catch (error) {
        console.error("Erreur lors de la suppression de l'item :", error);
    }
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

export const listenToCategories = (listId: string, callback: (categories: any[]) => void) => {
    const listRef = doc(FIREBASE_FIRESTORE, "shoppingLists", listId);

    const unsubscribe = onSnapshot(listRef, (snapshot) => {
        if (snapshot.exists()) {
            const listData = snapshot.data();
            const categories = listData.categories || [];
            callback(categories);
        } else {
            console.log("Aucune liste trouvée avec cet ID");
            callback([]);
        }
    });

    return unsubscribe;
};

export const createCategory = async (name: string, listId: string) => {
    try {
        if (!name.trim()) {
            console.error("Le nom de la catégorie ne peut pas être vide.");
            return;
        }

        const listRef = doc(FIREBASE_FIRESTORE, "shoppingLists", listId);
        const docSnap = await getDoc(listRef);

        if (!docSnap.exists()) {
            console.error("Liste non trouvée !");
            return;
        }

        const listData = docSnap.data();
        const categories = listData.categories || [];

        const categoryExists = categories.some(
            (cat: { name: string }) => cat.name.toLowerCase() === name.toLowerCase()
        );

        if (categoryExists) {
            console.error("Une catégorie avec ce nom existe déjà !");
            return;
        }


        const newCategory = { id: Date.now().toString(), name };
        await updateDoc(listRef, {
            categories: arrayUnion(newCategory),
        });

        console.log(`Catégorie '${name}' ajoutée avec succès !`);
    } catch (error) {
        console.error("Erreur lors de la création de la catégorie :", error);
    }
};
export { createShoppingList, getUserShoppingLists , useShoppingLists, useShoppingListById, createShoppingListItem, deleteList,deleteItem, toggleItemChecked,listenToItemChecked};
