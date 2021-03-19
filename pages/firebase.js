import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

var firebaseConfig = {
    apiKey: "AIzaSyC4LvA7DuDjj-0GgOEDyg_FoxFm0uMdNGw",
    authDomain: "schoolmanagement-9da3a.firebaseapp.com",
    databaseURL: "https://schoolmanagement-9da3a.firebaseio.com",
    projectId: "schoolmanagement-9da3a",
    storageBucket: "schoolmanagement-9da3a.appspot.com",
    messagingSenderId: "153738100336",
    appId: "1:153738100336:web:9efe643e42eb0285bffeb5",
    measurementId: "G-R4B8W98YVC"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const database = firebase.database();
export const store = firebase.storage();
