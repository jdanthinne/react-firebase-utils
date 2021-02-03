import { useContext, useEffect, useState } from "react";
import firebase from "firebase";

import FirebaseContext from "./context";
import { IdentifiedFirestoreDocument } from "./types";

interface SortProps {
  field: string | firebase.firestore.FieldPath;
  direction: "asc" | "desc";
}

interface Props {
  name: string;
  where?: {
    field: string | firebase.firestore.FieldPath;
    operator?: firebase.firestore.WhereFilterOp;
    value: any;
  };
  sort?: SortProps | SortProps[];
  limit?: number;
  once?: boolean;
  excludeID?: string;
}

interface Data<T> {
  loading: boolean;
  documents: T[];
}

function useCollection<T extends IdentifiedFirestoreDocument>({
  name,
  where,
  sort,
  limit,
  once = false,
  excludeID,
}: Props) {
  const firebaseContext = useContext(FirebaseContext);
  const [documents, setDocuments] = useState<Data<T>>({
    loading: true,
    documents: [],
  });

  useEffect(() => {
    const query = firebaseContext!.db.collection(name);

    let finalQuery;
    if (sort) {
      let sorts: SortProps[];
      if (Array.isArray(sort)) {
        sorts = sort;
      } else {
        sorts = [sort];
      }
      finalQuery = sorts.reduce(
        (query: firebase.firestore.Query, sort) =>
          query.orderBy(sort.field, sort.direction),
        query
      );
    } else {
      finalQuery = query;
    }

    let finalQueryLimited;
    if (limit) {
      finalQueryLimited = finalQuery.limit(limit);
    } else {
      finalQueryLimited = finalQuery;
    }

    let finalQueryFiltered;
    if (where) {
      finalQueryFiltered = finalQueryLimited.where(
        where.field,
        where.operator ?? "==",
        where.value
      );
    } else {
      finalQueryFiltered = finalQueryLimited;
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
      snapshot.docs
        .filter((doc) => doc.id !== excludeID)
        .forEach((doc) => documents.push({ ...doc.data(), uid: doc.id } as T));

      setDocuments({ loading: false, documents: documents });
    } else {
      setDocuments({ loading: false, documents: [] });
    }
  };

  const _handleError = (error: Error) => {
    console.log("Error getting collection", error);
    setDocuments({ loading: false, documents: [] });
  };

  return documents;
}

export default useCollection;
