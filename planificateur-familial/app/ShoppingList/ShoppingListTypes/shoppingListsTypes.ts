export interface ShoppingListItem {
    id:string
    name: string;
    quantity: number;
    checked: boolean;
}

export interface ShoppingList {
    id?: string;
    name: string;
    members: string[];
    owner: string;
    createdAt: any;
    items: ShoppingListItem[];
}

