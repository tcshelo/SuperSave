// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDnHZMazZracZK80YJ1o_OyddLx3vckDco",
    authDomain: "supersave-d0506.firebaseapp.com",
    databaseURL: "https://supersave-d0506-default-rtdb.firebaseio.com",
    projectId: "supersave-d0506",
    storageBucket: "supersave-d0506.appspot.com",
    messagingSenderId: "744975287879",
    appId: "1:744975287879:web:6ed99c1e7169cceca89362",
    measurementId: "G-5Y1ZKXZLVR"
  }
};

// Initialize Firebase
const firebaseApp = initializeApp(environment.firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { environment, db, auth };
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
