/**
 * Retire toutes les clés non autorisées d’un objet
 * Pour éviter que le client modifie des champs sensibles
 */
module.exports = function sanitizeObject(obj, allowedFields = []) {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};
