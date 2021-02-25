import { useContext, useEffect, useState } from "react";
import firebase from "firebase";

import FirebaseContext from "./context";
import { IdentifiedFirestoreDocument } from "./types";

interface Props {
  name: string;
  where?: {
    field: string | firebase.firestore.FieldPath;
    operator?: firebase.firestore.WhereFilterOp;
    value: any;
  };
  once?: boolean;
}

function useCollection<T extends IdentifiedFirestoreDocument>(props: Props) {
  const firebaseContext = useContext(FirebaseContext);
  const [documents, setDocuments] = useState<T[]>([]);
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
    setDocuments([]);

    const query = firebaseContext!.db.collectionGroup(props.name);

    let finalQueryFiltered;
    if (props.where) {
      finalQueryFiltered = query.where(
        props.where.field,
        props.where.operator ?? "==",
        props.where.value
      );
    } else {
      finalQueryFiltered = query;
    }

    if (props.once) {
      finalQueryFiltered.get().then(_handleSnapshots).catch(_handleError);
    } else {
      const observer = finalQueryFiltered.onSnapshot(
        _handleSnapshots,
        _handleError
      );

      return () => {
        observer();
      };
    }
  }

  const _handleSnapshots = (snapshot: firebase.firestore.QuerySnapshot) => {
    if (snapshot.size) {
      let documents: Array<T> = [];
      snapshot.forEach((doc) =>
        documents.push({
          ...doc.data(),
          uid: doc.id,
          parentID: doc.ref.parent.parent?.id,
        } as T)
      );

      setDocuments(documents);
    } else {
      setDocuments([]);
    }
    setLoading(false);
  };

  const _handleError = (error: Error) => {
    console.log("Error getting collectionGroup", error);
    setDocuments([]);
    setLoading(false);
  };

  return {loading, documents, refresh};
}

export default useCollection;
