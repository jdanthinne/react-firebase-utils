import { IdentifiedFirestoreDocument } from "./types";
interface Props<UserType extends IdentifiedFirestoreDocument> {
    landingPath: string;
    signinPath: string;
    installPath: string;
    usersCollectionName: string;
    currentUser: UserType | null;
    userIsValid: (user: UserType) => boolean;
    setUser: (user: UserType | null) => void;
    onError: (error: {
        textId: string;
        redirectPath?: string;
    } | null) => void;
}
declare function useAuth<UserType extends IdentifiedFirestoreDocument>(props: Props<UserType>): UserType | null;
export default useAuth;
