import * as firebase from "firebase";

let config = {
    apiKey: "AIzaSyANrShVIUkS3rGnwEdEz_JEEVHaCVe0dwE",
    authDomain: "app-cakes-licata.firebaseapp.com",
    databaseURL: "https://app-cakes-licata.firebaseio.com",
    projectId: "app-cakes-licata",
    storageBucket: "app-cakes-licata.appspot.com",
    messagingSenderId: "639068361262"

    // apiKey: "AIzaSyCMc-IuOyjVL8X-es6vzTcTS8ktN3rW5Sc",
    // authDomain: "appcakes.firebaseapp.com",
    // databaseURL: "https://appcakes.firebaseio.com",
    // projectId: "appcakes",
    // storageBucket: "appcakes.appspot.com",
    // messagingSenderId: "808207586459"
};

let app = firebase.initializeApp(config);
export const db = app.database();