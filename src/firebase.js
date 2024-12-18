import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7OEgAJBr_AaFYFotJJgRaPQ8mA3u3NUs",
  authDomain: "garmentconnect-13a7d.firebaseapp.com",
  projectId: "garmentconnect-13a7d",
  storageBucket: "garmentconnect-13a7d.firebasestorage.app",
  messagingSenderId: "407142951753",
  appId: "1:407142951753:web:68265dba5e4194e1db4898"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
