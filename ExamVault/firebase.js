import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

/* CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyBR8eqtC1jdG-OnMB6CpvKbbBFhdpkyrf8",
  authDomain: "question-paper-portal-31d7d.firebaseapp.com",
  projectId: "question-paper-portal-31d7d",
  storageBucket: "question-paper-portal-31d7d.appspot.com",
  messagingSenderId: "796754776469",
  appId: "1:796754776469:web:c756d54b1db97d775c669c",
  databaseURL: "https://question-paper-portal-31d7d-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);

/* AUTH */
export function loginUser(email, password){
  return signInWithEmailAndPassword(auth, email, password);
}

export function signupUser(email, password){
  return createUserWithEmailAndPassword(auth, email, password);
}

/* TRACK LOGIN */
export function logLogin(email){
  push(ref(db, "logins"), {
    email,
    time: new Date().toLocaleString()
  });
}

/* TRACK PAPER VIEW */
export function logPaper(email, paper){
  push(ref(db, "papers"), {
    email,
    paper,
    time: new Date().toLocaleString()
  });
}

/* REALTIME LISTENERS */
export function listenLogins(callback){
  onValue(ref(db, "logins"), (snap)=>{
    callback(snap.val() || {});
  });
}

export function listenPapers(callback){
  onValue(ref(db, "papers"), (snap)=>{
    callback(snap.val() || {});
  });
}