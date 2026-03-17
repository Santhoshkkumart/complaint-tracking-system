import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { assertRequiredEnv, getRequiredEnvValue } from "./env";

assertRequiredEnv("firebase", [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
]);

const firebaseConfig = {
  apiKey: getRequiredEnvValue("VITE_FIREBASE_API_KEY"),
  authDomain: getRequiredEnvValue("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getRequiredEnvValue("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getRequiredEnvValue("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getRequiredEnvValue("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getRequiredEnvValue("VITE_FIREBASE_APP_ID"),
  measurementId: getRequiredEnvValue("VITE_FIREBASE_MEASUREMENT_ID"),
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
