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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import FirebaseContext from "./context";
function useAuth(props) {
    var _this = this;
    var _a = useState(null), authUser = _a[0], setAuthUser = _a[1];
    var _b = useState(false), authStarted = _b[0], setAuthStarted = _b[1];
    var _c = useState(undefined), usersCount = _c[0], setUsersCount = _c[1];
    var firebase = useContext(FirebaseContext);
    var history = useHistory();
    useEffect(function () {
        props.onError(null);
        var authObserver = firebase.auth.onAuthStateChanged(function (authUser) {
            setAuthUser(authUser);
            setAuthStarted(true);
        });
        var getCounts = function () { return __awaiter(_this, void 0, void 0, function () {
            var counts, countsData;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, firebase.doGetCounts()];
                    case 1:
                        counts = _c.sent();
                        countsData = counts.data;
                        setUsersCount((_b = (_a = countsData.find(function (count) { return count.collection === props.usersCollectionName; })) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0);
                        return [2];
                }
            });
        }); };
        getCounts();
        return function () {
            authObserver();
        };
    }, []);
    var _failWithMessageId = useCallback(function (messageId) {
        firebase.doSignOut();
        props.onError({ textId: messageId, redirectPath: props.signinPath });
    }, []);
    useEffect(function () {
        if (usersCount === 0) {
            history.push(props.installPath);
        }
        else if (usersCount !== undefined) {
            if (authStarted) {
                if (authUser != null) {
                    var observer_1 = firebase.db
                        .collection(props.usersCollectionName)
                        .doc(authUser.uid)
                        .onSnapshot(function (docSnapshot) {
                        var _a;
                        if (docSnapshot.exists) {
                            var foundUser = __assign(__assign({}, docSnapshot.data()), { uid: docSnapshot.id });
                            if (props.userIsValid(foundUser)) {
                                var userHasChanged = ((_a = props.currentUser) === null || _a === void 0 ? void 0 : _a.uid) !== foundUser.uid;
                                props.setUser(foundUser);
                                if (userHasChanged) {
                                    if (history.location.state &&
                                        history.location.state.from) {
                                        history.push(history.location.state.from.pathname);
                                    }
                                    else {
                                        history.push(props.landingPath);
                                    }
                                }
                            }
                            else {
                                _failWithMessageId("signin.errors.noRole");
                            }
                        }
                        else {
                            _failWithMessageId("signin.errors.notFound");
                        }
                    }, function (error) {
                        console.log(error);
                    });
                    return function () {
                        observer_1();
                    };
                }
                else {
                    props.setUser(null);
                    if (history.location.pathname !== props.signinPath) {
                        history.push(props.signinPath);
                    }
                }
            }
        }
    }, [authUser, authStarted, usersCount]);
    return props.currentUser;
}
export default useAuth;
//# sourceMappingURL=useAuth.js.map