export interface IdentifiedFirestoreDocument {
    uid: string;
    parentID?: string;
}
export interface CreateUserProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordVerify: string;
    role: string;
}
