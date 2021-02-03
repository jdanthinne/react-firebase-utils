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
interface Data<T> {
    loading: boolean;
    documents: T[];
}
declare function useCollection<T extends IdentifiedFirestoreDocument>({ name, where, once, }: Props): Data<T>;
export default useCollection;
