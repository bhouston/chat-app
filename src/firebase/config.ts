import { initializeApp } from 'firebase/app';
import auth from '@react-native-firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const initializeFirebase = () => {
  try {
    return initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
};

export { initializeFirebase };