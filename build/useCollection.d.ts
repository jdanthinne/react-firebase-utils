import firebase from "firebase";
import { IdentifiedFirestoreDocument } from "./types";
interface WhereProps {
    field: string | firebase.firestore.FieldPath;
    operator?: firebase.firestore.WhereFilterOp;
    value: any;
}
interface SortProps {
    field: string | firebase.firestore.FieldPath;
    direction: "asc" | "desc";
}
interface Props {
    name: string;
    where?: WhereProps | WhereProps[];
    sort?: SortProps | SortProps[];
    limit?: number;
    once?: boolean;
    excludeID?: string;
}
declare function useCollection<T extends IdentifiedFirestoreDocument>(props: Props): {
    loading: boolean;
    documents: T[];
    refresh: () => (() => void) | undefined;
};
export default useCollection;
