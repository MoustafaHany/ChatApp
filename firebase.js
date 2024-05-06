// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    // Your Firebase configuration
    apiKey: "AIzaSyDkpNIQ6dsXEQCE0nXy7YMmNLwlW8yV1Ag",
    authDomain: "application-93c6d.firebaseapp.com",
    projectId: "application-93c6d",
    storageBucket: "application-93c6d.appspot.com",
    messagingSenderId: "462022333514",
    appId: "1:462022333514:web:2276858517812a06ff82b3"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth,db }; // Export the 'auth' instance
