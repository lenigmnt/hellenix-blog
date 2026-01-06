/**
 * =========================================================
 *  MODEL : Article
 * =========================================================
 */

console.log(">>> Article model loaded");

const mongoose = require("mongoose");
const slugify = require("slugify");
const Review = require("../models/Review"); 

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
      minlength: [3, "Minimum 3 caractères"],
      maxlength: [150, "Maximum 150 caractères"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: [true, "Le contenu est obligatoire"],
      minlength: [20, "Minimum 20 caractères"],
    },

    coverImage: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La catégorie est obligatoire"],
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      }
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/* ---------------------------------------------------------
   SLUG : pre-save + pre-findOneAndUpdate FIX COMPLET
--------------------------------------------------------- */
articleSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

// Important : slug on update + sécuriser update()
articleSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (update.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
    this.setUpdate(update);
  }
});

/* ---------------------------------------------------------
   INSTANCE METHODS
--------------------------------------------------------- */
articleSchema.methods.publish = function () {
  this.status = "published";
  return this.save();
};

articleSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

/* ---------------------------------------------------------
   STATIC METHODS
--------------------------------------------------------- */
articleSchema.statics.findPublished = function () {
  return this.find({ status: "published" }).sort({ createdAt: -1 });
};

/* ---------------------------------------------------------
   DELETE CASCADE REVIEWS
--------------------------------------------------------- */
articleSchema.pre("deleteOne", { document: true }, async function () {
  await Review.deleteMany({ article: this._id });
});

articleSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) await Review.deleteMany({ article: doc._id });
  next();
});

/* ---------------------------------------------------------
   VIRTUAL : readingTime
--------------------------------------------------------- */
articleSchema.virtual("readingTime").get(function () {
  if (!this.content) return 1;
  const words = this.content.split(" ").length;
  return Math.ceil(words / 200);
});

/* ---------------------------------------------------------
   VIRTUAL : count les reviews (commentaires)
--------------------------------------------------------- */
articleSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "article",
});

articleSchema.virtual("reviewCount").get(function () {
  return this.reviews ? this.reviews.length : 0;
});


module.exports = mongoose.model("Article", articleSchema);
