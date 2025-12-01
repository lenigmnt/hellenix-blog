const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");

// ===============================
// PROTECT — Token obligatoire
// ===============================
const protect = catchAsync(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("Vous devez être connecté", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError("Utilisateur non trouvé", 401));
    }

    req.user = user;
    next();
});

// ===============================
// restrictTo("admin", "moderator")
// ===============================
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("Accès interdit", 403));
        }
        next();
    };
};

module.exports = { protect, restrictTo };
