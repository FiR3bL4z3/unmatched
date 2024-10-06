import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./app";

const rootElememt = document.getElementById("root");

if (!rootElememt) {
    throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElememt).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
