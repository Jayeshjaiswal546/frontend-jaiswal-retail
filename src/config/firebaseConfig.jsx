// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhjd2aUe6XbfYSyAg8EYRLDht-AxT7eR8",
  authDomain: "jaiswal-retail.firebaseapp.com",
  projectId: "jaiswal-retail",
  storageBucket: "jaiswal-retail.firebasestorage.app",
  messagingSenderId: "494787791831",
  appId: "1:494787791831:web:94c90aa2619d15ed315992"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export {app};

