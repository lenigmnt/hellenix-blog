const ReviewService = require("../services/ReviewService");
const catchAsync = require("../utils/catchAsync");

/* =========================================================
   CREATE REVIEW
========================================================= */
exports.createReview = catchAsync(async (req, res, next) => {
  const review = await ReviewService.createReview({
    content: req.body.content,
    articleId: req.params.articleId,
    authorId: req.user._id
  });

  res.status(201).json({
    status: "success",
    data: { review }
  });
});

/* =========================================================
   GET REVIEWS BY ARTICLE
========================================================= */
exports.getReviewsByArticle = catchAsync(async (req, res, next) => {
  const reviews = await ReviewService.getReviewsByArticle(
    req.params.articleId,
    req.user || null // important pour drafts
  );

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews }
  });
});

/* =========================================================
   UPDATE REVIEW
========================================================= */
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await ReviewService.updateReview(
    req.params.id,
    req.user._id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: { review }
  });
});

/* =========================================================
   DELETE REVIEW
========================================================= */
exports.deleteReview = catchAsync(async (req, res, next) => {
  await ReviewService.deleteReview(req.params.id, req.user);

  res.status(204).json({
    status: "success",
    data: null
  });
});
