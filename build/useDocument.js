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
function useDocument(props) {
    var firebaseContext = useContext(FirebaseContext);
    var _a = useState(null), document = _a[0], setDocument = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    useEffect(function () {
        var observer = refresh();
        return function () {
            observer === null || observer === void 0 ? void 0 : observer();
        };
    }, []);
    var refresh = function () {
        setLoading(true);
        setDocument(null);
        var path = firebaseContext.db.collection(props.collectionName).doc(props.uid);
        if (props.once) {
            path.get().then(_handleSnapshot).catch(_handleError);
        }
        else {
            var observer_1 = path.onSnapshot(_handleSnapshot, _handleError);
            return function () {
                observer_1();
            };
        }
    };
    var _handleSnapshot = function (snapshot) {
        if (snapshot.exists) {
            setDocument(__assign({ uid: snapshot.id }, snapshot.data()));
        }
        else {
            setDocument(null);
        }
        setLoading(false);
    };
    var _handleError = function (error) {
        console.log("Error getting document", error);
        setDocument(null);
        setLoading(false);
    };
    return { loading: loading, document: document, refresh: refresh };
}
export default useDocument;
//# sourceMappingURL=useDocument.js.map