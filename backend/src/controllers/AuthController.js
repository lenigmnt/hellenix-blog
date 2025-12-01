const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const generateToken = require("../utils/generateToken");

/* ======================================================
   REGISTER
====================================================== */
exports.register = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(
            new AppError("Veuillez fournir username, email et password", 400)
        );
    }

    // Email déjà utilisé ?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError("Cet email est déjà utilisé", 400));
    }

    // User.js fait déjà le hash avec pre("save")
    const user = await User.create({
        username,
        email,
        password, // toujours en clair → hashé automatiquement
        role: "user"
    });

    const token = generateToken(user._id);

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        }
    });
});

/* ======================================================
   LOGIN
====================================================== */
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Veuillez fournir email et password", 400));
    }

    // Récupération user + password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new AppError("Identifiants invalides", 401));
    }

    // Vérification du mot de passe via bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return next(new AppError("Identifiants invalides", 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({
        status: "success",
        token,
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        }
    });
});

/* ======================================================
   ME — récupérer le profil user
====================================================== */
exports.me = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new AppError("Utilisateur introuvable", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        }
    });
});

/* ======================================================
   UPDATE PASSWORD
====================================================== */
exports.updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return next(
            new AppError("Veuillez fournir currentPassword et newPassword", 400)
        );
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return next(new AppError("Utilisateur introuvable", 404));

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return next(new AppError("Mot de passe actuel incorrect", 401));
    }

    // update → le pre("save") fera le hash automatiquement
    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
        status: "success",
        message: "Mot de passe mis à jour",
        token
    });
});

/* ======================================================
   UPDATE ME (username, avatar)
====================================================== */
exports.updateMe = catchAsync(async (req, res, next) => {
    const allowedFields = ["username", "avatar"];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
            updates[key] = req.body[key];
        }
    });

    if (Object.keys(updates).length === 0) {
        return next(new AppError("Aucun champ valide fourni", 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: "success",
        data: { user: updatedUser }
    });
});
