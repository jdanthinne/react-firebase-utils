import FirebaseContext from "./context";
import Firebase from "./firebase";
import useAuth from "./useAuth";
import useCollection from "./useCollection";
import useCollectionGroup from "./useCollectionGroup";
import useDocument from "./useDocument";
import { CreateUserProps, IdentifiedFirestoreDocument } from "./types";

import firebaseApp from "firebase/app";

export default Firebase;

export const FieldValue = firebaseApp.firestore.FieldValue;
export class Timestamp extends firebaseApp.firestore.Timestamp {}

export {
  FirebaseContext,
  useAuth,
  useCollection,
  useDocument,
  useCollectionGroup,
};
export type { CreateUserProps, IdentifiedFirestoreDocument };
