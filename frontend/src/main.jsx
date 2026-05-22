import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1a1209",
            color: "#f5f0e8",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            borderRadius: "10px",
            padding: "12px 16px",
          },
          success: { iconTheme: { primary: "#6a9461", secondary: "#f5f0e8" } },
          error: { iconTheme: { primary: "#d4614a", secondary: "#f5f0e8" } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
