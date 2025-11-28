// ================================================
// 1) Chargement des variables d'environnement
// ================================================
// Doit être exécuté avant tout autre import afin que
// process.env soit disponible dans toute l’application.
require('dotenv').config();

// ================================================
// 2) Import des dépendances principales
// ================================================
const express = require('express');
const securityMiddleware = require('./middleware/security');
const { connectDB } = require('./config/database');

// ================================================
// 3) Initialisation de l'application Express
// ================================================
const app = express();

// ================================================
// 4) Middlewares globaux (sécurité + parsers)
// ================================================
// Centralisation des middlewares de sécurité (helmet, cors, rate-limit, etc.)
securityMiddleware(app);

// NOTE : express.json() est déjà appliqué dans security.js
// Aucun besoin de le remettre ici pour éviter les doublons.

// ================================================
// 5) Définition du port
// ================================================
const PORT = process.env.PORT || 3001;

// ================================================
// 6) Route de test (GET /)
// ================================================
// Permet de vérifier rapidement que l'API tourne et que MongoDB est connecté.
app.get('/', (req, res) => {
    res.json({
        message: "Bienvenue sur l'API Hellenix !",
        version: "1.0.0",
        status: "Server OK + MongoDB OK"
    });
});

// ================================================
// 7) Fonction principale de démarrage
// ================================================
// La connexion MongoDB est asynchrone : le serveur Express
// ne démarre que si la base répond correctement.
// Cela évite un serveur actif sans base fonctionnelle.
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
        console.error("❌ Erreur lors du démarrage du serveur :", err.message);
        process.exit(1); // Arrêt forcé si erreur critique
    }
};

// ================================================
// 8) Lancement de l'application
// ================================================
startServer();
