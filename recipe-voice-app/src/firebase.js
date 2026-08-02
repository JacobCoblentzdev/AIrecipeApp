import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBr3YxAJNXiFdKk4u5NmB-3KkU_4hQGZug",
  authDomain: "coblentzcooking.firebaseapp.com",
  projectId: "coblentzcooking",
  storageBucket: "coblentzcooking.firebasestorage.app",
  messagingSenderId: "963823283518",
  appId: "1:963823283518:web:8d671921fb1d8848bb906f",
  measurementId: "G-L3YHP00NSG"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);
const functions = getFunctions(app);

export { app, analytics, db, functions };