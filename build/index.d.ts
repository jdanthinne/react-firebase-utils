import FirebaseContext from "./context";
import Firebase from "./firebase";
import useAuth from "./useAuth";
import useCollection from "./useCollection";
import useCollectionGroup from "./useCollectionGroup";
import useDocument from "./useDocument";
import { CreateUserProps, IdentifiedFirestoreDocument } from "./types";
import firebaseApp from "firebase/app";
export default Firebase;
export declare const FieldValue: typeof firebaseApp.firestore.FieldValue;
export declare const FieldPath: typeof firebaseApp.firestore.FieldPath;
export declare class Timestamp extends firebaseApp.firestore.Timestamp {
}
export declare class GeoPoint extends firebaseApp.firestore.GeoPoint {
}
export { FirebaseContext, useAuth, useCollection, useDocument, useCollectionGroup, };
export type { CreateUserProps, IdentifiedFirestoreDocument };
