import firebase from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDTbIMxlisnCnj0VNs0AYMmGeGDjJSd9FE",
  authDomain: "esos-2881a.firebaseapp.com",
  projectId: "esos-2881a",
  storageBucket: "esos-2881a.appspot.com",
  messagingSenderId: "992035740967",
  appId: "1:992035740967:android:f4b530f10b096dce7edd02",
  measurementId: "G-WY831SKB6F"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  export default firebase;