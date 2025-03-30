import {User} from "@/types/user";

export interface ShoppingListItem {
    id:string
    name: string;
    quantity: number;
    checked: boolean;
}

export interface ShoppingList {
    id?: string;
    name: string;
    members: User[];
    owner: User;
    createdAt: any;
    items: ShoppingListItem[];
}

