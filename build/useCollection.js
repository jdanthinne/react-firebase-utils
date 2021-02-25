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
        setLoading(true);
        setDocuments([]);
        var query = firebaseContext.db.collection(props.name);
        var finalQuery;
        if (props.sort) {
            var sorts = void 0;
            if (Array.isArray(props.sort)) {
                sorts = props.sort;
            }
            else {
                sorts = [props.sort];
            }
            finalQuery = sorts.reduce(function (query, sort) {
                return query.orderBy(sort.field, sort.direction);
            }, query);
        }
        else {
            finalQuery = query;
        }
        var finalQueryLimited;
        if (props.limit) {
            finalQueryLimited = finalQuery.limit(props.limit);
        }
        else {
            finalQueryLimited = finalQuery;
        }
        var finalQueryFiltered;
        if (props.where) {
            var wheres = void 0;
            if (Array.isArray(props.where)) {
                wheres = props.where;
            }
            else {
                wheres = [props.where];
            }
            finalQueryFiltered = wheres.reduce(function (query, where) {
                var _a;
                return query.where(where.field, (_a = where.operator) !== null && _a !== void 0 ? _a : "==", where.value);
            }, query);
        }
        else {
            finalQueryFiltered = finalQueryLimited;
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
            snapshot.docs
                .filter(function (doc) { return doc.id !== props.excludeID; })
                .forEach(function (doc) { return documents_1.push(__assign(__assign({}, doc.data()), { uid: doc.id })); });
            setDocuments(documents_1);
        }
        else {
            setDocuments([]);
        }
        setLoading(false);
    };
    var _handleError = function (error) {
        console.log("Error getting collection", error);
        setDocuments([]);
        setLoading(false);
    };
    return { loading: loading, documents: documents, refresh: refresh };
}
export default useCollection;
//# sourceMappingURL=useCollection.js.map