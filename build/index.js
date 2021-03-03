var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import FirebaseContext from "./context";
import Firebase from "./firebase";
import useAuth from "./useAuth";
import useCollection from "./useCollection";
import useCollectionGroup from "./useCollectionGroup";
import useDocument from "./useDocument";
import firebaseApp from "firebase/app";
export default Firebase;
export var FieldValue = firebaseApp.firestore.FieldValue;
export var FieldPath = firebaseApp.firestore.FieldPath;
var Timestamp = (function (_super) {
    __extends(Timestamp, _super);
    function Timestamp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Timestamp;
}(firebaseApp.firestore.Timestamp));
export { Timestamp };
var GeoPoint = (function (_super) {
    __extends(GeoPoint, _super);
    function GeoPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GeoPoint;
}(firebaseApp.firestore.GeoPoint));
export { GeoPoint };
export { FirebaseContext, useAuth, useCollection, useDocument, useCollectionGroup, };
//# sourceMappingURL=index.js.map