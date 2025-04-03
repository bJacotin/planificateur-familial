import {User} from "@/types/user";

export interface TodoListItem {
    id: string;
    name: string;
    dueDate?: Date; // Optional due date for the task
    checked: boolean;
    createdAt: any; // Timestamp for when the item was created
}

export interface TodoListDto {
    id?: string;
    name: string;
    members: string[]; // Array of member IDs
    owner: string; // Owner ID
    createdAt: any; // Timestamp for when the list was created
    items: TodoListItem[]; // Array of todo list items
}


export interface TodoList {
    id?: string;
    name: string;
    members: User[]; // Array of User objects
    owner: User; // User object for the owner
    createdAt: any; // Timestamp for when the list was created
    items: TodoListItem[]; // Array of todo list items
}


