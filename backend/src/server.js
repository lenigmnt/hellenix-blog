// ===============================
// 📌 1) Chargement des variables d'environnement
// ===============================
// Doit être exécuté AVANT tous les imports pour rendre process.env disponible.
require('dotenv').config();

// ===============================
// 📌 2) Import des dépendances principales
// ===============================
const express = require('express');
const { connectDB } = require('./config/database');

// ===============================
// 📌 3) Initialisation de l'application Express
// ===============================
const app = express();

// ===============================
// 📌 4) Middlewares globaux
// ===============================
app.use(express.json());

// ===============================
// 📌 5) Définition du port
// ===============================
const PORT = process.env.PORT || 3001;

// ===============================
// 📌 6) Route de test (GET /)
// ===============================
app.get('/', (req, res) => {
    res.json({
        message: "Bienvenue sur l'API Hellenix !",
        version: "1.0.0",
        status: "Server OK + MongoDB OK"
    });
});

// ===============================
// 📌 7) Fonction principale de démarrage
// ===============================
const startServer = async () => {
    try {
        // Connexion à MongoDB
        await connectDB();

        // Démarrage du serveur Express
        app.listen(PORT, () => {
            console.log(`🚀 Serveur Hellenix démarré sur le port ${PORT}`);
            console.log(`📍 URL : http://localhost:${PORT}`);
            console.log(`🌍 Environnement : ${process.env.NODE_ENV || "development"}`);
        });

    } catch (err) {
        console.error("❌ Erreur de démarrage du serveur :", err.message);
        process.exit(1);
    }
};

// ===============================
// 📌 8) Lancement de l'application
// ===============================
startServer();
