import { useContext, useEffect, useState } from "react";
import firebase from "firebase";

import FirebaseContext from "./context";
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

function useDocument<T extends IdentifiedFirestoreDocument>({
  collectionName,
  uid,
  once = false,
}: Props) {
  const firebaseContext = useContext(FirebaseContext);
  const [document, setDocument] = useState<Data<T>>({
    loading: true,
    document: null,
  });

  useEffect(() => {
    const path = firebaseContext!.db.collection(collectionName).doc(uid);

    if (once) {
      path.get().then(_handleSnapshot).catch(_handleError);
    } else {
      const observer = path.onSnapshot(_handleSnapshot, _handleError);

      return () => {
        observer();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _handleSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
    if (snapshot.exists) {
      setDocument({
        loading: false,
        document: { uid: uid, ...snapshot.data() } as T,
      });
    } else {
      setDocument({ loading: false, document: null });
    }
  };

  const _handleError = (error: Error) => {
    console.log("Error getting document", error);
    setDocument({ loading: false, document: null });
  };

  return document;
}

export default useDocument;
