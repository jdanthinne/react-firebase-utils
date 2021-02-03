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
import { useContext, useEffect, useState } from "react";
import FirebaseContext from "./context";
function useDocument(_a) {
    var collectionName = _a.collectionName, uid = _a.uid, _b = _a.once, once = _b === void 0 ? false : _b;
    var firebaseContext = useContext(FirebaseContext);
    var _c = useState({
        loading: true,
        document: null,
    }), document = _c[0], setDocument = _c[1];
    useEffect(function () {
        var path = firebaseContext.db.collection(collectionName).doc(uid);
        if (once) {
            path.get().then(_handleSnapshot).catch(_handleError);
        }
        else {
            var observer_1 = path.onSnapshot(_handleSnapshot, _handleError);
            return function () {
                observer_1();
            };
        }
    }, []);
    var _handleSnapshot = function (snapshot) {
        if (snapshot.exists) {
            setDocument({
                loading: false,
                document: __assign({ uid: uid }, snapshot.data()),
            });
        }
        else {
            setDocument({ loading: false, document: null });
        }
    };
    var _handleError = function (error) {
        console.log("Error getting document", error);
        setDocument({ loading: false, document: null });
    };
    return document;
}
export default useDocument;
//# sourceMappingURL=useDocument.js.map