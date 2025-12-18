// src/app/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

// 🔐 Protection des routes
import RequireAuth from "../components/auth/RequireAuth";

// 📄 Pages publiques
import Home from "../pages/Home";
import ArticleDetail from "../pages/ArticleDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";

// 📄 Pages protégées (user connecté)
import CreateArticle from "../pages/CreateArticle";
import EditArticle from "../pages/EditArticle";
import MyArticles from "../pages/MyArticles";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Layout global (Header / Outlet / Footer)
    children: [
      // ===== ROUTES PUBLIQUES =====
      { index: true, element: <Home /> }, // /
      { path: "articles/:id", element: <ArticleDetail /> }, // lecture article
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // ===== ROUTES PROTÉGÉES (auth requise) =====
      {
        path: "articles/new",
        element: (
          <RequireAuth>
            <CreateArticle />
          </RequireAuth>
        ),
      },
      {
        path: "articles/:id/edit",
        element: (
          <RequireAuth>
            <EditArticle />
          </RequireAuth>
        ),
      },
      {
        path: "my-articles",
        element: (
          <RequireAuth>
            <MyArticles />
          </RequireAuth>
        ),
      },
      {
        path: "profile",
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
    ],
  },
]);
