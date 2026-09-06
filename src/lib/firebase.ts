import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1-T7T2SfUlALj4lQJWQ0KgyqFY_u-Qtc",
  authDomain: "sahyogk07.firebaseapp.com",
  projectId: "sahyogk07",
  storageBucket: "sahyogk07.firebasestorage.app",
  messagingSenderId: "616099843681",
  appId: "1:616099843681:web:1f9662e9cdd72bf982a420"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
