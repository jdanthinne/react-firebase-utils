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
function useCollection(_a) {
    var name = _a.name, where = _a.where, _b = _a.once, once = _b === void 0 ? false : _b;
    var firebaseContext = useContext(FirebaseContext);
    var _c = useState({
        loading: true,
        documents: [],
    }), documents = _c[0], setDocuments = _c[1];
    useEffect(function () {
        var _a;
        var query = firebaseContext.db.collectionGroup(name);
        var finalQueryFiltered;
        if (where) {
            finalQueryFiltered = query.where(where.field, (_a = where.operator) !== null && _a !== void 0 ? _a : "==", where.value);
        }
        else {
            finalQueryFiltered = query;
        }
        if (once) {
            finalQueryFiltered.get().then(_handleSnapshots).catch(_handleError);
        }
        else {
            var observer_1 = finalQueryFiltered.onSnapshot(_handleSnapshots, _handleError);
            return function () {
                observer_1();
            };
        }
    }, []);
    var _handleSnapshots = function (snapshot) {
        if (snapshot.size) {
            var documents_1 = [];
            snapshot.forEach(function (doc) {
                var _a;
                return documents_1.push(__assign(__assign({}, doc.data()), { uid: doc.id, parentID: (_a = doc.ref.parent.parent) === null || _a === void 0 ? void 0 : _a.id }));
            });
            setDocuments({ loading: false, documents: documents_1 });
        }
        else {
            setDocuments({ loading: false, documents: [] });
        }
    };
    var _handleError = function (error) {
        console.log("Error getting collectionGroup", error);
        setDocuments({ loading: false, documents: [] });
    };
    return documents;
}
export default useCollection;
//# sourceMappingURL=useCollectionGroup.js.map