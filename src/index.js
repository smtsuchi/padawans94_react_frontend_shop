import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAuE_z_wQlxyjCmAJO7eGcjqFxGwv3Kli4",
  authDomain: "padawans94.firebaseapp.com",
  projectId: "padawans94",
  storageBucket: "padawans94.appspot.com",
  messagingSenderId: "837382200753",
  appId: "1:837382200753:web:94d5930d7439caa451b190",
  measurementId: "G-Z65JGRJRD9",

  databaseURL: 'https://padawans94-default-rtdb.firebaseio.com'
};

initializeApp(firebaseConfig);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
