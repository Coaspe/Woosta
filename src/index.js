import "./wdyr";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import FirebaseContext from "./context/firebase";
import { firebase, FieldValue, storageRef } from "./lib/firebase";
import "./styles/index.css";

ReactDOM.render(
  <FirebaseContext.Provider value={{ firebase, FieldValue, storageRef }}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// client side rendered app : react (cra)
// -> database which is Firebase
// -> react-loading-skeleton
// tailwind

// architecture
// -> components,
// -> constants,
// -> helpers,
// ->lib (firebase is going to live in here),
// -> services (firebase functions in here)
// -> styles (tailwind's folder (app/tailwind))
