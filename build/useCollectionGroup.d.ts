import firebase from "firebase";
import { IdentifiedFirestoreDocument } from "./types";
interface Props {
    name: string;
    where?: {
        field: string | firebase.firestore.FieldPath;
        operator?: firebase.firestore.WhereFilterOp;
        value: any;
    };
    once?: boolean;
}
declare function useCollection<T extends IdentifiedFirestoreDocument>(props: Props): {
    loading: boolean;
    documents: T[];
    refresh: () => (() => void) | undefined;
};
export default useCollection;
