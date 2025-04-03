import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, where} from "firebase/firestore";
import {useEffect, useState} from "react";
import {arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "@firebase/firestore";

import {TodoList, TodoListDto, TodoListItem} from "./ToDoListTypes/ToDoListsTypes";
import {User} from "@/types/user";

const createTodoList = async (listName: string, members: User[], owner: User): Promise<string> => {
    const auth = FIREBASE_AUTH;
    const items: TodoListItem[] = [];
    
    if (!auth.currentUser) {
        throw new Error("L'utilisateur n'est pas connecté.");
    }

    try {
        const db = FIREBASE_FIRESTORE;
        const todoListRef = collection(db, "todoLists");
        const memberIds = members.map(member => member.id);
        
        const newList: TodoListDto = {
            name: listName,
            members: memberIds,
            owner: owner.id,
            createdAt: serverTimestamp(),
            items: items
        };

        const docRef = await addDoc(todoListRef, newList);
        console.log("TodoList créée avec l'ID :", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erreur lors de la création de la TodoList :", error);
        throw error;
    }
};

const getUserTodoLists = async (): Promise<TodoList[]> => {
    const auth = FIREBASE_AUTH;

    if (!auth.currentUser) {
        throw new Error("L'utilisateur n'est pas connecté.");
    }

    try {
        const db = FIREBASE_FIRESTORE;
        const todoListRef = collection(db, "todoLists");
        const q = query(todoListRef, where("members", "array-contains", auth.currentUser.uid));
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as TodoList);
    } catch (error) {
        console.error("Erreur lors de la récupération des TodoLists :", error);
        throw error;
    }
};

const useTodoLists = () => {
    const [todoLists, setTodoLists] = useState<TodoList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const auth = FIREBASE_AUTH;
        if (!auth.currentUser) return;

        const db = FIREBASE_FIRESTORE;
        const todoListRef = collection(db, "todoLists");
        const q = query(todoListRef, where("members", "array-contains", auth.currentUser.uid));

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const listsQuery: TodoListDto[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }) as TodoListDto);

            const lists = await dtoToTodoLists(listsQuery);
            setTodoLists(lists);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { todoLists, loading };
};

const dtoToTodoLists = async (dtoTodoLists: TodoListDto[]): Promise<TodoList[]> => {
    try {
        const usersSnapshot = await getDocs(collection(FIREBASE_FIRESTORE, "users"));
        const users: User[] = usersSnapshot.docs.map(doc => doc.data() as User);

        return dtoTodoLists.map(dto => ({
            id: dto.id,
            name: dto.name,
            members: dto.members.map(memberId => users.find(user => user.id === memberId)) as User[],
            owner: users.find(user => user.id === dto.owner),
            createdAt: dto.createdAt,
            items: dto.items
        }));
    } catch (error) {
        console.error("Erreur lors de la conversion des TodoLists :", error);
        throw error;
    }
};

const useTodoListById = (listId: string) => {
    const [todoList, setTodoList] = useState<TodoList | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!listId) return;

        const listRef = doc(FIREBASE_FIRESTORE, "todoLists", listId);
        const unsubscribe = onSnapshot(listRef, (docSnap) => {
            if (docSnap.exists()) {
                setTodoList({ id: docSnap.id, ...docSnap.data() } as TodoList);
            } else {
                console.log("Aucune TodoList trouvée avec cet ID");
                setTodoList(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [listId]);

    return { todoList, loading };
};

const toggleTaskStatus = async (listId: string, taskId: string) => {
    try {
        const listRef = doc(FIREBASE_FIRESTORE, "todoLists", listId);
        const docSnap = await getDoc(listRef);

        if (docSnap.exists()) {
            const items = docSnap.data().items.map((item: TodoListItem) => 
                item.id === taskId ? { ...item, checked: !item.checked } : item
            );
            await updateDoc(listRef, { items });
        }
    } catch (error) {
        console.error("Erreur changement statut:", error);
        throw error;
    }
};

const deleteTask = async (listId: string, taskId: string) => {
    try {
        const listRef = doc(FIREBASE_FIRESTORE, "todoLists", listId);
        const docSnap = await getDoc(listRef);

        if (docSnap.exists()) {
            const items = docSnap.data().items.filter(
                (item: TodoListItem) => item.id !== taskId
            );
            await updateDoc(listRef, { items });
        }
    } catch (error) {
        console.error("Erreur suppression tâche:", error);
        throw error;
    }
};


const createTodoListItem = async (listId: string, taskData: { name: string; dueDate?: string; checked: boolean }) => {
    try {
        const listRef = doc(FIREBASE_FIRESTORE, "todoLists", listId);
        const docSnap = await getDoc(listRef);

        if (!docSnap.exists()) {
            throw new Error("Liste non trouvée");
        }

        const newItem = {
            id: Date.now().toString(),
            name: taskData.name,
            dueDate: taskData.dueDate || null,
            checked: taskData.checked,
            createdAt: new Date().toISOString() // Solution alternative à serverTimestamp()
        };

        await updateDoc(listRef, {
            items: arrayUnion(newItem)
        });

        return true;
    } catch (error) {
        console.error("Erreur création tâche:", error);
        throw error;
    }
};

const toggleItemChecked = async (listId: string, itemId: string, checked: boolean): Promise<void> => {
    try {
        const listRef = doc(FIREBASE_FIRESTORE, "todoLists", listId);
        const docSnap = await getDoc(listRef);

        if (!docSnap.exists()) {
            console.error("TodoList non trouvée !");
            return;
        }

        const listData = docSnap.data();
        const updatedItems = listData.items.map((item: TodoListItem) =>
            item.id === itemId ? { ...item, checked: !checked } : item
        );

        await updateDoc(listRef, { items: updatedItems });
    } catch (error) {
        console.error("Erreur lors du changement d'état de la tâche :", error);
    }
};

const listenToItemChecked = (listId: string, itemId: string, callback: (checked: boolean) => void): (() => void) => {
    const listRef = doc(FIREBASE_FIRESTORE, "todoLists", listId);

    const unsubscribe = onSnapshot(listRef, (snapshot) => {
        if (snapshot.exists()) {
            const listData = snapshot.data();
            const item = listData.items.find((item: TodoListItem) => item.id === itemId);
            callback(item ? item.checked || false : false);
        }
    });

    return unsubscribe;
};

const deleteItem = async (item: TodoListItem, listId: string) => {
    try {
        if (!item || !listId) {
            console.error("ID de la tâche ou de la liste non valide.");
            return;
        }

        const listRef = doc(FIREBASE_FIRESTORE, "todoLists", listId);
        await updateDoc(listRef, {
            items: arrayRemove({
                id: item.id,
                name: item.name,
                dueDate: item.dueDate,
                createdAt: item.createdAt,
                checked: item.checked
            })
        });

        console.log(`Tâche "${item.name}" supprimée avec succès`);
    } catch (error) {
        console.error("Erreur lors de la suppression de la tâche :", error);
    }
};

const deleteList = async (listId: string) => {
    try {
        if (!listId) {
            console.error("ID de la TodoList non valide.");
            return;
        }

        await deleteDoc(doc(FIREBASE_FIRESTORE, "todoLists", listId));
        console.log("TodoList supprimée avec succès !");
    } catch (error) {
        console.error("Erreur lors de la suppression de la TodoList :", error);
    }
};

export { 
    createTodoList, 
    getUserTodoLists, 
    useTodoLists, 
    useTodoListById, 
    createTodoListItem, 
    deleteList,
    deleteItem, 
    toggleItemChecked,
    listenToItemChecked,
    toggleTaskStatus,
    deleteTask,
};