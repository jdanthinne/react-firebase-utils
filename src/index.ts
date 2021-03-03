import FirebaseContext from "./context";
import Firebase from "./firebase";
import useAuth from "./useAuth";
import useCollection, {CollectionSortProps, CollectionWhereProps} from "./useCollection";
import useCollectionGroup, {CollectionGroupSortProps, CollectionGroupWhereProps} from "./useCollectionGroup";
import useDocument from "./useDocument";
import { CreateUserProps, IdentifiedFirestoreDocument } from "./types";

import firebaseApp from "firebase/app";

export default Firebase;

export const FieldValue = firebaseApp.firestore.FieldValue;
export const FieldPath = firebaseApp.firestore.FieldPath;
export class Timestamp extends firebaseApp.firestore.Timestamp {}
export class GeoPoint extends firebaseApp.firestore.GeoPoint {}

export {
  FirebaseContext,
  useAuth,
  useCollection,
  useDocument,
  useCollectionGroup,
};
export type { CreateUserProps, IdentifiedFirestoreDocument, CollectionGroupSortProps, CollectionGroupWhereProps, CollectionSortProps, CollectionWhereProps };
