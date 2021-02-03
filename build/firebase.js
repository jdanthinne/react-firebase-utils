var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
var Firebase = (function () {
    function Firebase(config, options) {
        var _this = this;
        this.doSignInWithEmailAndPassword = function (email, password) {
            return _this.auth.signInWithEmailAndPassword(email, password);
        };
        this.doSignOut = function () { return _this.auth.signOut(); };
        this.doSendPasswordResetEmail = function (email) {
            return _this.auth.sendPasswordResetEmail(email);
        };
        this.doCreateUser = function (props) {
            return _this.functions.httpsCallable("createAuthUser")(props);
        };
        this.doUpdateUser = function (_a) {
            var uid = _a.uid, values = _a.values;
            return _this.functions.httpsCallable("updateAuthUser")(__assign({ uid: uid }, values));
        };
        this.doDeleteUser = function (uid) {
            return _this.functions.httpsCallable("deleteAuthUser")({ uid: uid });
        };
        this.doGetCounts = function () { return _this.functions.httpsCallable("getCounts")(); };
        app.initializeApp(config);
        this.auth = app.auth();
        this.auth.useDeviceLanguage();
        this.db = app.firestore();
        this.functions = app.functions();
        if ((options === null || options === void 0 ? void 0 : options.useEmulators) && window.location.hostname === "localhost") {
            this.auth.useEmulator("http://localhost:9099");
            this.db.settings({
                host: "localhost:8080",
                ssl: false,
            });
            this.functions.useEmulator("localhost", 5001);
        }
    }
    return Firebase;
}());
export default Firebase;
//# sourceMappingURL=firebase.js.map