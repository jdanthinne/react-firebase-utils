import firebase from "firebase";
import { IdentifiedFirestoreDocument } from "./types";
export interface CollectionGroupWhereProps {
    field: string | firebase.firestore.FieldPath;
    operator?: firebase.firestore.WhereFilterOp;
    value: any;
}
export interface CollectionGroupSortProps {
    field: string | firebase.firestore.FieldPath;
    direction: "asc" | "desc";
}
interface Props {
    name: string;
    where?: CollectionGroupWhereProps | CollectionGroupWhereProps[];
    sort?: CollectionGroupSortProps | CollectionGroupSortProps[];
    limit?: number;
    once?: boolean;
}
declare function useCollection<T extends IdentifiedFirestoreDocument>(props: Props): {
    loading: boolean;
    documents: T[];
    refresh: () => (() => void) | undefined;
};
export default useCollection;
