// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA0ONOpM3fmJ7J56iTGR067x1SM4I0cXiA",
  authDomain: "learning-english-14cf5.firebaseapp.com",
  projectId: "learning-english-14cf5",
  storageBucket: "learning-english-14cf5.appspot.com",
  messagingSenderId: "145654456194",
  appId: "1:145654456194:web:d26186745f0cb3bf53f99b",
  measurementId: "G-79MQ3G48PX",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa la autenticación
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };
