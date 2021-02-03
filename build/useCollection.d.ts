import firebase from "firebase";
import { IdentifiedFirestoreDocument } from "./types";
interface SortProps {
    field: string | firebase.firestore.FieldPath;
    direction: "asc" | "desc";
}
interface Props {
    name: string;
    where?: {
        field: string | firebase.firestore.FieldPath;
        operator?: firebase.firestore.WhereFilterOp;
        value: any;
    };
    sort?: SortProps | SortProps[];
    limit?: number;
    once?: boolean;
    excludeID?: string;
}
interface Data<T> {
    loading: boolean;
    documents: T[];
}
declare function useCollection<T extends IdentifiedFirestoreDocument>({ name, where, sort, limit, once, excludeID, }: Props): Data<T>;
export default useCollection;
