import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXCgDo1icp5TZOOLhg17rRaWcMZSEdbio",
  authDomain: "transcendence-95a18.firebaseapp.com",
  projectId: "transcendence-95a18",
  storageBucket: "transcendence-95a18.appspot.com",
  messagingSenderId: "1068957361087",
  appId: "1:1068957361087:web:00d29a95c421410296f70a",
  measurementId: "G-7LRNL1SFVJ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };