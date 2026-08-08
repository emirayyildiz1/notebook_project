import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyCJgPEoNWuHaSrqxZ0P-Jtr4YiwDIfVwmY",
  authDomain:        "notebook-diary-52247.firebaseapp.com",
  projectId:         "notebook-diary-52247",
  storageBucket:     "notebook-diary-52247.firebasestorage.app",
  messagingSenderId: "938985132727",
  appId:             "1:938985132727:web:7a5bbb99874d4d96beb332",
  measurementId:     "G-T2627FHEG6",
};

const app = initializeApp(firebaseConfig);

/** Firestore database instance — imported by diaryService.js */
export const db = getFirestore(app);
