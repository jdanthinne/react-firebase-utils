import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
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
declare class Firebase {
    auth: app.auth.Auth;
    db: app.firestore.Firestore;
    functions: app.functions.Functions;
    constructor(config: FirebaseConfig, options?: FirebaseOptions);
    doSignInWithEmailAndPassword: (email: string, password: string) => Promise<app.auth.UserCredential>;
    doSignOut: () => Promise<void>;
    doSendPasswordResetEmail: (email: string) => Promise<void>;
    doCreateUser: (props: CreateUserProps) => Promise<app.functions.HttpsCallableResult>;
    doUpdateUser: ({ uid, values }: {
        uid: string;
        values: CreateUserProps;
    }) => Promise<app.functions.HttpsCallableResult>;
    doDeleteUser: (uid: string) => Promise<app.functions.HttpsCallableResult>;
    doGetCounts: () => Promise<app.functions.HttpsCallableResult>;
}
export default Firebase;
