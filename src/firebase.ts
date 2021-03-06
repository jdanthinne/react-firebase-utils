import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import { CreateUserProps } from "./types";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}
interface FirebaseOptions {
  useEmulators: boolean;
}

class Firebase {
  auth: app.auth.Auth;
  db: app.firestore.Firestore;
  functions: app.functions.Functions;
  storage: app.storage.Storage;

  constructor(config: FirebaseConfig, options?: FirebaseOptions) {
    app.initializeApp(config);

    this.auth = app.auth();
    this.auth.useDeviceLanguage();
    this.db = app.firestore();
    this.functions = app.functions();
    this.storage = app.storage();

    if (options?.useEmulators && window.location.hostname === "localhost") {
      this.auth.useEmulator("http://localhost:9099");
      this.db.settings({
        host: "localhost:8080",
        ssl: false,
      });
      this.functions.useEmulator("localhost", 5001);
    }
  }

  // Auth
  doSignInWithEmailAndPassword = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doSendPasswordResetEmail = (email: string) =>
    this.auth.sendPasswordResetEmail(email);

  // Users
  doCreateUser = async (props: CreateUserProps) => {
    return new Promise<{uid: string}>(async (resolve) => {
      const result = await this.functions.httpsCallable("createAuthUser")(props);
      resolve({...result.data});
    })
    
  };
  doUpdateUser = ({ uid, values }: { uid: string; values: CreateUserProps }) =>
    this.functions.httpsCallable("updateAuthUser")({ uid: uid, ...values });
  doDeleteUser = (uid: string) =>
    this.functions.httpsCallable("deleteAuthUser")({ uid: uid });

  // Misc.
  doGetCounts = () => this.functions.httpsCallable("getCounts")();
}

export default Firebase;
