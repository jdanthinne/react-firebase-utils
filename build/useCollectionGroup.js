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
function useCollection(props) {
    var firebaseContext = useContext(FirebaseContext);
    var _a = useState([]), documents = _a[0], setDocuments = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    useEffect(function () {
        var observer = refresh();
        return function () {
            observer === null || observer === void 0 ? void 0 : observer();
        };
    }, []);
    var refresh = function () {
        var _a;
        setLoading(true);
        setDocuments([]);
        var query = firebaseContext.db.collectionGroup(props.name);
        var finalQueryFiltered;
        if (props.where) {
            finalQueryFiltered = query.where(props.where.field, (_a = props.where.operator) !== null && _a !== void 0 ? _a : "==", props.where.value);
        }
        else {
            finalQueryFiltered = query;
        }
        if (props.once) {
            finalQueryFiltered.get().then(_handleSnapshots).catch(_handleError);
        }
        else {
            var observer_1 = finalQueryFiltered.onSnapshot(_handleSnapshots, _handleError);
            return function () {
                observer_1();
            };
        }
    };
    var _handleSnapshots = function (snapshot) {
        if (snapshot.size) {
            var documents_1 = [];
            snapshot.forEach(function (doc) {
                var _a;
                return documents_1.push(__assign(__assign({}, doc.data()), { uid: doc.id, parentID: (_a = doc.ref.parent.parent) === null || _a === void 0 ? void 0 : _a.id }));
            });
            setDocuments(documents_1);
        }
        else {
            setDocuments([]);
        }
        setLoading(false);
    };
    var _handleError = function (error) {
        console.log("Error getting collectionGroup", error);
        setDocuments([]);
        setLoading(false);
    };
    return { loading: loading, documents: documents, refresh: refresh };
}
export default useCollection;
//# sourceMappingURL=useCollectionGroup.js.map