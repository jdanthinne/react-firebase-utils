import { IdentifiedFirestoreDocument } from "./types";
interface Props {
    collectionName: string;
    uid: string;
    once?: boolean;
}
interface Data<T> {
    loading: boolean;
    document: T | null;
}
declare function useDocument<T extends IdentifiedFirestoreDocument>({ collectionName, uid, once, }: Props): Data<T>;
export default useDocument;
