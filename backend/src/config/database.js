// ===============================
// 📌 Import de Mongoose
// ===============================
// Mongoose sert d'ODM : il structure les données et facilite
// les interactions avec MongoDB.
const mongoose = require('mongoose');

// ===============================
// 📌 Fonction de connexion à MongoDB
// ===============================
// connectDB() est asynchrone car la connexion peut prendre du temps.
// On utilise process.env.MONGODB_URI pour récupérer l'URL définie dans .env.
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        // Affichage en console en cas de succès (comme dans la leçon)
        console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
        console.log(`📊 Base : ${conn.connection.name}`);

    } catch (error) {
        // Si la connexion échoue, on affiche l'erreur et on stoppe l'app
        console.error("❌ Erreur connexion MongoDB :", error.message);
        process.exit(1);
    }
};

// ===============================
// 📌 Fermeture propre de la connexion
// ===============================
// Appelée lorsque l'utilisateur fait Ctrl+C ou quand on veut arrêter proprement.
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log("🔌 Connexion MongoDB fermée");
    } catch (error) {
        console.error("Erreur lors de la fermeture :", error);
    }
};

// ===============================
// 📌 Écoute des événements Mongoose
// ===============================

// Erreur après la connexion initiale
mongoose.connection.on("error", err => {
    console.error("Erreur MongoDB :", err);
});

// MongoDB vient d'être déconnecté
mongoose.connection.on("disconnected", () => {
    console.log("⚠️  MongoDB déconnecté");
});

// ===============================
// 📌 Gestion du Ctrl+C (SIGINT)
// ===============================
// Permet d'éviter les "connexions fantômes" après un arrêt brutal.
process.on("SIGINT", async () => {
    await closeDB();
    process.exit(0);
});

// ===============================
// 📌 Export des fonctions
// ===============================
module.exports = { connectDB, closeDB };
