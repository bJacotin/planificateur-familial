export interface User {
    id :string;
    name :string;
    pp : string | null;
    family : string | null
}

export interface Family {
    id : string;
    owner : string;
    members : User[] | null;
    name :string;
    request :string | null;
}