import { useContext, useEffect, useState } from "react";
import firebase from "firebase";

import FirebaseContext from "./context";
import { IdentifiedFirestoreDocument } from "./types";

export interface CollectionWhereProps {
  field: string | firebase.firestore.FieldPath;
  operator?: firebase.firestore.WhereFilterOp;
  value: any;
}
export interface CollectionSortProps {
  field: string | firebase.firestore.FieldPath;
  direction: "asc" | "desc";
}
interface Props {
  name: string;
  where?: CollectionWhereProps | CollectionWhereProps[];
  sort?: CollectionSortProps | CollectionSortProps[];
  limit?: number;
  once?: boolean;
  excludeID?: string;
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

    const query = firebaseContext!.db.collection(props.name);

    let finalQuery;
    if (props.sort) {
      let sorts: CollectionSortProps[];
      if (Array.isArray(props.sort)) {
        sorts = props.sort;
      } else {
        sorts = [props.sort];
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
    if (props.limit) {
      finalQueryLimited = finalQuery.limit(props.limit);
    } else {
      finalQueryLimited = finalQuery;
    }

    let finalQueryFiltered;
    if (props.where) {
      let wheres: CollectionWhereProps[];
      if (Array.isArray(props.where)) {
        wheres = props.where;
      } else {
        wheres = [props.where];
      }
      finalQueryFiltered = wheres.reduce(
        (query: firebase.firestore.Query, where) =>
          query.where(
            where.field,
            where.operator ?? "==",
            where.value
          ),
          finalQueryLimited
      );
    } else {
      finalQueryFiltered = finalQueryLimited;
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
      snapshot.docs
        .filter((doc) => doc.id !== props.excludeID)
        .forEach((doc) => documents.push({ ...doc.data(), uid: doc.id } as T));

      setDocuments(documents);
    } else {
      setDocuments([]);
    }
    setLoading(false);
  };

  const _handleError = (error: Error) => {
    console.log("Error getting collection", error);
    setDocuments([]);
    setLoading(false);
  };

  return {loading, documents, refresh};
}

export default useCollection;
