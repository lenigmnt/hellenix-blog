const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est obligatoire"],
      trim: true,
      minlength: [3, "Minimum 3 caractères"],
      maxlength: [30, "Maximum 30 caractères"]
    },

    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email invalide"]
    },

    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: [6, "Minimum 6 caractères"],
      select: false
    },

    avatar: {
      type: String,
      default: null
    },

    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

/* =============================================
   PRE-SAVE : hash mot de passe
============================================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

/* =============================================
   Méthode instance : comparer les mots de passe
============================================= */
userSchema.methods.comparePassword = async function (
  providedPassword,
  hashedPassword
) {
  return await bcrypt.compare(providedPassword, hashedPassword);
};

module.exports = mongoose.model("User", userSchema);
