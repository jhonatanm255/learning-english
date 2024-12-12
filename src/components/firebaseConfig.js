
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, get, child } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA0ONOpM3fmJ7J56iTGR067x1SM4I0cXiA",
  authDomain: "learning-english-14cf5.firebaseapp.com",
  projectId: "learning-english-14cf5",
  storageBucket: "learning-english-14cf5.appspot.com",
  messagingSenderId: "145654456194",
  appId: "1:145654456194:web:d26186745f0cb3bf53f99b",
  measurementId: "G-79MQ3G48PX",
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const storage = getStorage(app); // Exportar el objeto storage
export const db = getFirestore(app);
const database = getDatabase(app);
export { database, ref, set, get, child };
