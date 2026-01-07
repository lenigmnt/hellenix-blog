// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import AuthProvider from "./context/AuthProvider";

import "@picocss/pico/css/pico.min.css"; // ✅ Pico global
import "./styles/layout.css";
import "./styles/article-card.css";
//import "./index.css";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
