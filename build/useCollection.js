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
    var name = _a.name, where = _a.where, sort = _a.sort, limit = _a.limit, _b = _a.once, once = _b === void 0 ? false : _b, excludeID = _a.excludeID;
    var firebaseContext = useContext(FirebaseContext);
    var _c = useState({
        loading: true,
        documents: [],
    }), documents = _c[0], setDocuments = _c[1];
    useEffect(function () {
        var _a;
        var query = firebaseContext.db.collection(name);
        var finalQuery;
        if (sort) {
            var sorts = void 0;
            if (Array.isArray(sort)) {
                sorts = sort;
            }
            else {
                sorts = [sort];
            }
            finalQuery = sorts.reduce(function (query, sort) {
                return query.orderBy(sort.field, sort.direction);
            }, query);
        }
        else {
            finalQuery = query;
        }
        var finalQueryLimited;
        if (limit) {
            finalQueryLimited = finalQuery.limit(limit);
        }
        else {
            finalQueryLimited = finalQuery;
        }
        var finalQueryFiltered;
        if (where) {
            finalQueryFiltered = finalQueryLimited.where(where.field, (_a = where.operator) !== null && _a !== void 0 ? _a : "==", where.value);
        }
        else {
            finalQueryFiltered = finalQueryLimited;
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
            snapshot.docs
                .filter(function (doc) { return doc.id !== excludeID; })
                .forEach(function (doc) { return documents_1.push(__assign(__assign({}, doc.data()), { uid: doc.id })); });
            setDocuments({ loading: false, documents: documents_1 });
        }
        else {
            setDocuments({ loading: false, documents: [] });
        }
    };
    var _handleError = function (error) {
        console.log("Error getting collection", error);
        setDocuments({ loading: false, documents: [] });
    };
    return documents;
}
export default useCollection;
//# sourceMappingURL=useCollection.js.map