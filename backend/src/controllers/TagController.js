/**
 * ---------------------------------------------------------
 * CONTROLLER : TagController
 * ---------------------------------------------------------
 * - Reçoit req / res depuis les routes
 * - Délègue toute la logique métier à TagService
 * - Gère les erreurs via catchAsync
 * - Réponses JSON cohérentes pour toute l’API
 * ---------------------------------------------------------
 */

const TagService = require("../services/TagService");
const catchAsync = require("../utils/catchAsync");

/**
 * ---------------------------------------------------------
 * GET ALL TAGS (public)
 * ---------------------------------------------------------
 */
exports.getTags = catchAsync(async (req, res, next) => {
    const tags = await TagService.getTags();

    res.status(200).json({
        status: "success",
        results: tags.length,
        data: { tags }
    });
});

/**
 * ---------------------------------------------------------
 * GET ONE TAG (public)
 * ---------------------------------------------------------
 */
exports.getTag = catchAsync(async (req, res, next) => {
    const tag = await TagService.getTag(req.params.id);

    res.status(200).json({
        status: "success",
        data: { tag }
    });
});

/**
 * ---------------------------------------------------------
 * CREATE TAG (admin)
 * ---------------------------------------------------------
 */
exports.createTag = catchAsync(async (req, res, next) => {
    const tag = await TagService.createTag(req.body.name);

    res.status(201).json({
        status: "success",
        data: { tag }
    });
});

/**
 * ---------------------------------------------------------
 * UPDATE TAG (admin)
 * ---------------------------------------------------------
 */
exports.updateTag = catchAsync(async (req, res, next) => {
    const tag = await TagService.updateTag(req.params.id, req.body.name);

    res.status(200).json({
        status: "success",
        data: { tag }
    });
});

/**
 * ---------------------------------------------------------
 * DELETE TAG (admin)
 * ---------------------------------------------------------
 */
exports.deleteTag = catchAsync(async (req, res, next) => {
    await TagService.deleteTag(req.params.id);

    res.status(204).json({
        status: "success",
        data: null
    });
});
