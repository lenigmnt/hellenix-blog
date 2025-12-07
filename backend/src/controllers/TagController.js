/**
 * ---------------------------------------------------------
 * CONTROLLER : TagController
 * ---------------------------------------------------------
 * - Reçoit req / res depuis les routes Express
 * - Ne contient AUCUNE logique métier
 * - Appelle TagService qui gère :
 *      ✔ validations
 *      ✔ unicité
 *      ✔ mise à jour du slug
 *      ✔ interdiction suppression si utilisé
 * - Utilise catchAsync pour capturer les erreurs async
 * ---------------------------------------------------------
 */

const TagService = require("../services/TagService");
const catchAsync = require("../utils/catchAsync");

/* =========================================================
   GET ALL TAGS (PUBLIC)
   ---------------------------------------------------------
   Retourne la liste complète des tags du blog.
   Utilisé pour :
     - filtres côté frontend
     - construction d’UI type "tag cloud"
========================================================= */
exports.getTags = catchAsync(async (req, res, next) => {
  const tags = await TagService.getTags();

  res.status(200).json({
    status: "success",
    results: tags.length,
    data: { tags }
  });
});

/* =========================================================
   GET ONE TAG (PUBLIC)
   ---------------------------------------------------------
   Retourne un tag par son ID.
   Utilisé pour :
     - affichage d’un tag en admin
     - édition de tag côté back-office
========================================================= */
exports.getTag = catchAsync(async (req, res, next) => {
  const tag = await TagService.getTag(req.params.id);

  res.status(200).json({
    status: "success",
    data: { tag }
  });
});

/* =========================================================
   CREATE TAG (ADMIN)
   ---------------------------------------------------------
   - Le nom du tag est dans req.body.name
   - Toute validation (doublons, slug, etc.) est gérée
     dans TagService → le controller reste propre.
========================================================= */
exports.createTag = catchAsync(async (req, res, next) => {

  // (Optionnel mais propre) Vérifier name avant d'appeler le service
  if (!req.body.name) {
    return res.status(400).json({
      status: "fail",
      message: "Le nom du tag est obligatoire"
    });
  }

  const tag = await TagService.createTag(req.body.name);

  res.status(201).json({
    status: "success",
    data: { tag }
  });
});

/* =========================================================
   UPDATE TAG (ADMIN)
   ---------------------------------------------------------
   - Met à jour le nom (et donc le slug via hook)
   - Service gère :
        ✔ existence du tag
        ✔ doublons insensibles à la casse
========================================================= */
exports.updateTag = catchAsync(async (req, res, next) => {

  if (!req.body.name) {
    return res.status(400).json({
      status: "fail",
      message: "Le nom du tag est obligatoire"
    });
  }

  const tag = await TagService.updateTag(req.params.id, req.body.name);

  res.status(200).json({
    status: "success",
    data: { tag }
  });
});

/* =========================================================
   DELETE TAG (ADMIN)
   ---------------------------------------------------------
   - Supprime un tag *uniquement* s’il n’est pas utilisé
     par un article (vérifié dans le service)
   - Retourne 204 No Content (standard REST)
========================================================= */
exports.deleteTag = catchAsync(async (req, res, next) => {
  await TagService.deleteTag(req.params.id);

  res.status(204).json({
    status: "success",
    data: null
  });
});
