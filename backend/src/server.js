// Import du module Express
// Express est un framework web minimaliste pour Node.js
const express = require('express');

// Création de l'application Express
// Cette instance sera le coeur de notre serveur web
const app = express();

// Configuration du port
// On utilise la variable d'environnement PORT si elle existe,
// sinon on utilise le port 3000 par défaut
const PORT = process.env.PORT || 3001;

// Route de base pour tester le serveur
// GET / renvoie un message simple pour confirmer que le serveur fonctionne
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API du Blog MERN !',
        version: '1.0.0',
        status: 'Le serveur fonctionne correctement'
    });
});

// Démarrage du serveur
// Le serveur écoute sur le port spécifié et affiche un message de confirmation
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📍 URL : http://localhost:${PORT}`);
});