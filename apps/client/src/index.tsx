import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./app";

const a: number = "ASD";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
