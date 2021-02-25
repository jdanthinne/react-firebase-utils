import { IdentifiedFirestoreDocument } from "./types";
interface Props {
    collectionName: string;
    uid: string;
    once?: boolean;
}
declare function useDocument<T extends IdentifiedFirestoreDocument>(props: Props): {
    loading: boolean;
    document: T | null;
    refresh: () => (() => void) | undefined;
};
export default useDocument;
