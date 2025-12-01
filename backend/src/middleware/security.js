// ===============================
// Middlewares de sécurité
// ===============================

const express = require("express"); 
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const cors = require("cors");
const morgan = require("morgan");

module.exports = function securityMiddleware(app) {

    // Sécurité des headers HTTP
    app.use(helmet());

    // CORS avec whitelist
    const whitelist = ["http://localhost:5173"];
    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || whitelist.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    };
    app.use(cors(corsOptions));

    // Limite de 100 requêtes / 15 min
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Trop de requêtes. Réessayez plus tard."
    }));

    // Protection injections MongoDB
    app.use(mongoSanitize());

    // Protection XSS
    app.use(xssClean());

    // Parser JSON global
    app.use(express.json({ limit: "10kb" }));

    // Logger (optionnel)
    if (process.env.NODE_ENV !== "production") {
        app.use(morgan("dev"));
    }
};
