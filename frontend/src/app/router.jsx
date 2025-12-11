// src/app/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

// IMPORTS DES PAGES (obligatoires)
import Home from "../pages/Home";
import ArticleDetail from "../pages/ArticleDetail";
import CreateArticle from "../pages/CreateArticle";
import EditArticle from "../pages/EditArticle";
import MyArticles from "../pages/MyArticles";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "articles/:id", element: <ArticleDetail /> },
      { path: "articles/new", element: <CreateArticle /> },
      { path: "articles/:id/edit", element: <EditArticle /> },
      { path: "my-articles", element: <MyArticles /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
