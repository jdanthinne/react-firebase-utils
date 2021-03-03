import firebase from "firebase";
import { IdentifiedFirestoreDocument } from "./types";
export interface CollectionWhereProps {
    field: string | firebase.firestore.FieldPath;
    operator?: firebase.firestore.WhereFilterOp;
    value: any;
}
export interface CollectionSortProps {
    field: string | firebase.firestore.FieldPath;
    direction: "asc" | "desc";
}
interface Props {
    name: string;
    where?: CollectionWhereProps | CollectionWhereProps[];
    sort?: CollectionSortProps | CollectionSortProps[];
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
