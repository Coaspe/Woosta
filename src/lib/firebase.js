import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyA7zlzi43xzgXd62cdPRqjIOWn5lvPqtmQ",
  authDomain: "wooinsta-c27cd.firebaseapp.com",
  projectId: "wooinsta-c27cd",
  storageBucket: "wooinsta-c27cd.appspot.com",
  messagingSenderId: "386574578219",
  appId: "1:386574578219:web:0c03b0800137c8d8dbf06e",
  measurementId: "G-CYBFSQVRZ4",
};

const firebase = Firebase.initializeApp(config);
const storageRef = Firebase.storage().ref();
const { FieldValue } = Firebase.firestore;
console.log("FieldValue", FieldValue);

export { firebase, FieldValue, storageRef };
