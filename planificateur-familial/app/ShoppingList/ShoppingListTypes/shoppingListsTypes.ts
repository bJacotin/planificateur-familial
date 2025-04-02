import {User} from "@/types/user";

export interface ShoppingListItem {
    id:string
    name: string;
    quantity: number;
    checked: boolean;
    category:string | null;
}
export interface ShoppingListDto {
    id?: string;
    name: string;
    members: String[];
    owner: String;
    createdAt: any;
    items: ShoppingListItem[];
}

export interface ShoppingList {
    id?: string;
    name: string;
    members: User[];
    owner: User;
    createdAt: any;
    items: ShoppingListItem[];
}
export interface Category {
    id?: string;
    name: string;
}

