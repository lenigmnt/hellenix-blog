// ================================================
// 1) Chargement des variables d'environnement
// ================================================
require("dotenv").config();

// ================================================
// 2) Import des dépendances principales
// ================================================
const express = require("express");
const cors = require("cors");

const securityMiddleware = require("./middleware/security");
const { connectDB } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// ================================================
// 3) Import des ROUTES
// ================================================
const AuthRoutes = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/UserRoutes");
const CategoryRoutes = require("./routes/CategoryRoutes");
const TagRoutes = require("./routes/TagRoutes");
const ArticleRoutes = require("./routes/ArticleRoutes");
const ReviewRoutes = require("./routes/ReviewRoutes");
const AdminRoutes = require("./routes/AdminRoutes");

// ================================================
// 4) Initialisation de l'application Express
// ================================================
const app = express();

// ================================================
// 5) CORS (AVANT TOUT LE RESTE)
// ================================================
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend Vite
    credentials: true,
  })
);

// ================================================
// 6) Middlewares globaux (sécurité + parsers)
// ================================================
securityMiddleware(app);

// ================================================
// 7) Définition du port
// ================================================
const PORT = process.env.PORT || 3001;

// ================================================
// 8) ROUTE ROOT (health check)
// ================================================
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API Hellenix !",
    version: "1.0.0",
    status: "Server OK + MongoDB OK",
  });
});

// ================================================
// 9) ROUTES DE L'API
// ================================================

// Auth
app.use("/api/auth", AuthRoutes);

// Users (profil, admin users)
app.use("/api/users", UserRoutes);

// Categories
app.use("/api/categories", CategoryRoutes);

// Tags
app.use("/api/tags", TagRoutes);

// ⚠️ Reviews NESTED (avant articles)
app.use("/api/articles/:articleId/reviews", ReviewRoutes);

// Articles
app.use("/api/articles", ArticleRoutes);

// Admin
app.use("/api/admin", AdminRoutes);

// ================================================
// 10) Middleware global de gestion des erreurs
// ================================================
app.use(errorHandler);

// ================================================
// 11) Démarrage serveur
// ================================================
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur Hellenix démarré sur le port ${PORT}`);
      console.log(`📍 URL : http://localhost:${PORT}`);
      console.log(`🌍 Environnement : ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("❌ Erreur lors du démarrage du serveur :", err.message);
    process.exit(1);
  }
};

// ================================================
// 12) Lancement de l'application
// ================================================
startServer();
