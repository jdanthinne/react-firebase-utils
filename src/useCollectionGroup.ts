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

interface Data<T> {
  loading: boolean;
  documents: T[];
}

function useCollection<T extends IdentifiedFirestoreDocument>({
  name,
  where,
  once = false,
}: Props) {
  const firebaseContext = useContext(FirebaseContext);
  const [documents, setDocuments] = useState<Data<T>>({
    loading: true,
    documents: [],
  });

  useEffect(() => {
    const query = firebaseContext!.db.collectionGroup(name);

    let finalQueryFiltered;
    if (where) {
      finalQueryFiltered = query.where(
        where.field,
        where.operator ?? "==",
        where.value
      );
    } else {
      finalQueryFiltered = query;
    }

    if (once) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      setDocuments({ loading: false, documents: documents });
    } else {
      setDocuments({ loading: false, documents: [] });
    }
  };

  const _handleError = (error: Error) => {
    console.log("Error getting collectionGroup", error);
    setDocuments({ loading: false, documents: [] });
  };

  return documents;
}

export default useCollection;
