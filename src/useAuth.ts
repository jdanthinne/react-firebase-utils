import { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Firebase from "firebase";

import FirebaseContext from "./context";
import { IdentifiedFirestoreDocument } from "./types";

interface LocationState {
  from?: { pathname: string };
}

interface Props<UserType extends IdentifiedFirestoreDocument> {
  landingPath: string;
  signinPath: string;
  installPath: string;
  usersCollectionName: string;
  currentUser: UserType | null;
  userIsValid: (user: UserType) => boolean;
  setUser: (user: UserType | null) => void;
  onError: (error: { textId: string; redirectPath?: string } | null) => void;
}

function useAuth<UserType extends IdentifiedFirestoreDocument>(
  props: Props<UserType>
) {
  const [authUser, setAuthUser] = useState<Firebase.User | null>(null);
  const [authStarted, setAuthStarted] = useState<boolean>(false);
  const [usersCount, setUsersCount] = useState<number | undefined>(undefined);

  const firebase = useContext(FirebaseContext);
  const history = useHistory<LocationState | undefined>();

  useEffect(() => {
    props.onError(null);
    const authObserver = firebase!.auth.onAuthStateChanged((authUser) => {
      setAuthUser(authUser);
      setAuthStarted(true);
    });

    const getCounts = async () => {
      const counts = await firebase!.doGetCounts();
      const countsData: { collection: string; count: number }[] = counts.data;
      setUsersCount(
        countsData.find(
          (count) => count.collection === props.usersCollectionName
        )?.count
      );
    };
    getCounts();

    return () => {
      authObserver();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _failWithMessageId = useCallback((messageId) => {
    firebase!.doSignOut();
    props.onError({ textId: messageId, redirectPath: props.signinPath });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (usersCount === 0) {
      history.push(props.installPath);
    } else if (usersCount !== undefined) {
      if (authStarted) {
        if (authUser != null) {
          const observer = firebase!.db
            .collection(props.usersCollectionName)
            .doc(authUser.uid)
            .onSnapshot(
              (docSnapshot) => {
                if (docSnapshot.exists) {
                  const foundUser = {
                    ...docSnapshot.data(),
                    uid: docSnapshot.id,
                  } as UserType;
                  if (props.userIsValid(foundUser)) {
                    const userHasChanged =
                      props.currentUser?.uid !== foundUser.uid;
                    props.setUser(foundUser);
                    if (userHasChanged) {
                      if (
                        history.location.state &&
                        history.location.state.from
                      ) {
                        history.push(history.location.state.from.pathname);
                      } else {
                        history.push(props.landingPath);
                      }
                    }
                  } else {
                    _failWithMessageId("signin.errors.noRole");
                  }
                } else {
                  _failWithMessageId("signin.errors.notFound");
                }
              },
              (error) => {
                console.log(error);
              }
            );

          return () => {
            observer();
          };
        } else {
          props.setUser(null);
          if (history.location.pathname !== props.signinPath) {
            history.push(props.signinPath);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, authStarted, usersCount]);

  return props.currentUser;
}

export default useAuth;
