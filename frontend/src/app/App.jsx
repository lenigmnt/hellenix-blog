// src/app/App.jsx
import { Outlet } from "react-router-dom";
import AuthProvider from "../context/AuthProvider";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </AuthProvider>
  );
}
