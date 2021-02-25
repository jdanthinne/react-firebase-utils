import { useContext, useEffect, useState } from "react";
import firebase from "firebase";

import FirebaseContext from "./context";
import { IdentifiedFirestoreDocument } from "./types";

interface Props {
  collectionName: string;
  uid: string;
  once?: boolean;
}

function useDocument<T extends IdentifiedFirestoreDocument>(props: Props) {
  const firebaseContext = useContext(FirebaseContext);
  const [document, setDocument] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const observer = refresh();

    return () => {
      observer?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => {
    setLoading(true);
    setDocument(null);

    const path = firebaseContext!.db.collection(props.collectionName).doc(props.uid);

    if (props.once) {
      path.get().then(_handleSnapshot).catch(_handleError);
    } else {
      const observer = path.onSnapshot(_handleSnapshot, _handleError);

      return () => {
        observer();
      };
    }
  };

  const _handleSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
    if (snapshot.exists) {
      setDocument({uid: snapshot.id, ...snapshot.data() } as T);
    } else {
      setDocument(null);
    }
    setLoading(false);
  };

  const _handleError = (error: Error) => {
    console.log("Error getting document", error);
    setDocument(null);
    setLoading(false);
  };

  return {loading, document, refresh};
}

export default useDocument;
