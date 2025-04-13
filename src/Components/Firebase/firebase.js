import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJG_TQgd2ABouBvhX59T69WqX20IW62Iw",
  authDomain: "attendance-887c7.firebaseapp.com",
  projectId: "attendance-887c7",
  storageBucket: "attendance-887c7.appspot.com",
  messagingSenderId: "550864643663",
  appId: "1:550864643663:web:40f69126d0777e513cac3a",
  measurementId: "G-22ZVMCXD73"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
