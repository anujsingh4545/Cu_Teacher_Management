import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-LKXkHaxxVnwuab653Jlpes1izMDaEsE",
  authDomain: "chandigarh-56c7e.firebaseapp.com",
  projectId: "chandigarh-56c7e",
  storageBucket: "chandigarh-56c7e.appspot.com",
  messagingSenderId: "48838098696",
  appId: "1:48838098696:web:8b7210113236dd6e8636bd",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
