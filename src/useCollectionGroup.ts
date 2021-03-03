import { useContext, useEffect, useState } from "react";
import firebase from "firebase";

import FirebaseContext from "./context";
import { IdentifiedFirestoreDocument } from "./types";

interface WhereProps {
  field: string | firebase.firestore.FieldPath;
  operator?: firebase.firestore.WhereFilterOp;
  value: any;
}
interface SortProps {
  field: string | firebase.firestore.FieldPath;
  direction: "asc" | "desc";
}
interface Props {
  name: string;
  where?: WhereProps | WhereProps[];
  sort?: SortProps | SortProps[];
  limit?: number;
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

    let finalQuery;
    if (props.sort) {
      let sorts: SortProps[];
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

    let finalQueryFiltered;
    if (props.where) {
      let wheres: WhereProps[];
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
          finalQuery
      );
    } else {
      finalQueryFiltered = finalQuery;
    }

    let finalQueryLimited;
    if (props.limit) {
      finalQueryLimited = finalQueryFiltered.limit(props.limit);
    } else {
      finalQueryLimited = finalQueryFiltered;
    }

    if (props.once) {
      finalQueryLimited.get().then(_handleSnapshots).catch(_handleError);
    } else {
      const observer = finalQueryLimited.onSnapshot(
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
