// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "qr-app-abc57.firebaseapp.com",
  projectId: "qr-app-abc57",
  storageBucket: "qr-app-abc57.appspot.com",
  messagingSenderId: "1049796728116",
  appId: "1:1049796728116:web:1d12b90dff0a20b674c161"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.getToken().then((currentToken) => {
    if (currentToken) {
        console.log(currentToken)
    }   else {
        console.log('No registration token available. Request permission to generate one.');
    }
}).catch((err) => { 

    console.log('An error occurred while retrieving token. ', err);
}
);