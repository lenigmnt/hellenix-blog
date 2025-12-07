

# 1. Introduction

L’API Hellenix fournit un ensemble de services REST pour gérer des utilisateurs, des catégories hiérarchiques, des tags, des articles, ainsi que des commentaires.  
Elle est construite selon l’architecture MVC avec séparation stricte :

```
Routes → Controllers → Services → Models
```

Toutes les réponses suivent une structure uniforme :

```json
{
  "status": "success",
  "data": { ... }
}
```

En cas d’erreur :

```json
{
  "status": "error",
  "message": "Description de l’erreur"
}
```

---

# 2. Authentification

Les opérations d’authentification sont publiques.  
Toutes les autres routes protégées doivent inclure le header :

```
Authorization: Bearer <token>
```

## 2.1 Inscription

**POST /auth/register**

Crée un nouvel utilisateur.

### Body

```json
{
  "username": "Achille",
  "email": "achille@grece.com",
  "password": "123456"
}
```

### Réponse 201

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "…",
      "username": "Achille",
      "email": "achille@grece.com"
    },
    "token": "JWT_TOKEN"
  }
}
```

---

## 2.2 Connexion

**POST /auth/login**

### Body

```json
{
  "email": "achille@grece.com",
  "password": "123456"
}
```

### Réponse 200

```json
{
  "status": "success",
  "token": "JWT_TOKEN"
}
```

---

## 2.3 Changer son mot de passe

**PATCH /auth/update-password**

Requiert un utilisateur connecté.  
Les mots de passe sont hashés avant sauvegarde.

### Body

```json
{
  "currentPassword": "123456",
  "newPassword": "azerty123"
}
```

### Réponse 200

```json
{
  "status": "success",
  "message": "Mot de passe mis à jour"
}
```

---

# 3. Utilisateurs

Toutes ces routes nécessitent un JWT valide.  
Aucune route utilisateur ne doit être accessible sans authentification.

## 3.1 Profil personnel

**GET /users/me**

Retourne les informations du compte connecté.

---

## 3.2 Modifier son profil

**PATCH /users/update-me**

Champs modifiables : `username`, `email`.

### Exemple Body

```json
{
  "username": "NouvelNom",
  "email": "new@mail.com"
}
```

---

## 3.3 Mettre à jour son mot de passe

**PATCH /users/update-password**

Même structure que la route dans Auth, utilisée également ici.

---

# 4. Administration

Ces routes sont exclusivement accessibles aux comptes dont le rôle est `admin`.

## 4.1 Liste des utilisateurs

**GET /users**

## 4.2 Lire un utilisateur

**GET /users/:id**

## 4.3 Modifier un utilisateur

**PATCH /users/:id**

### Exemple Body

```json
{
  "username": "NouveauNom",
  "role": "moderator"
}
```

## 4.4 Supprimer un utilisateur

**DELETE /users/:id**

---

# 5. Catégories

Les catégories forment une hiérarchie illimitée grâce au champ `parent`.

## 5.1 Liste des catégories

**GET /categories**

Retourne toute la hiérarchie avec :

- `parent`
    
- `slug`
    
- `path` (chemin complet)
    
- `level` (profondeur)
    

---

## 5.2 Créer une catégorie

**POST /categories** (admin)

### Body

```json
{
  "name": "Histoire",
  "parent": "65e91..."
}
```

---

## 5.3 Modifier une catégorie

**PATCH /categories/:id**

Vérification anti-cycle incluse.

---

## 5.4 Supprimer une catégorie

**DELETE /categories/:id**

Impossible si :

- elle possède des enfants
    
- elle est utilisée par au moins un article
    

---

# 6. Tags

## 6.1 Liste des tags

**GET /tags**

## 6.2 Créer un tag

**POST /tags** (admin)

### Body

```json
{ "name": "philosophie" }
```

## 6.3 Modifier un tag

**PATCH /tags/:id**

## 6.4 Supprimer un tag

**DELETE /tags/:id**

---

# 7. Articles

## 7.1 Liste des articles publiés

**GET /articles**

Filtres disponibles :

```
?category=ID
?tag=ID
?search=mot
?page=1
?limit=10
```

---

## 7.2 Lire un article

**GET /articles/:id**

Retourne :

- auteur
    
- catégorie
    
- tags
    
- temps de lecture
    
- date de création
    

---

## 7.3 Articles de l’utilisateur connecté

**GET /articles/me**

Paramètres :

```
?status=all | draft | published
```

---

## 7.4 Créer un article

**POST /articles**

### Body

```json
{
  "title": "La Grèce antique",
  "content": "Long texte ici...",
  "category": "ID",
  "tags": ["ID1", "ID2"]
}
```

---

## 7.5 Modifier un article

**PATCH /articles/:id**

L’utilisateur doit être l’auteur.

---

## 7.6 Publier un article

**PATCH /articles/:id/publish**

---

## 7.7 Supprimer un article

**DELETE /articles/:id**

Suppression en cascade :

- les reviews associées sont supprimées automatiquement
    

---

# 8. Commentaires (Reviews)

## 8.1 Lister les commentaires d’un article

**GET /articles/:articleId/reviews**

Accessible au public.

---

## 8.2 Créer un commentaire

**POST /articles/:articleId/reviews**

Uniquement possible sur un article publié.

---

## 8.3 Modifier un commentaire

**PATCH /reviews/:id**

Seul l’auteur peut modifier.

---

## 8.4 Supprimer un commentaire

**DELETE /reviews/:id**

Autorisé pour :

- auteur
    
- admin
    

---

# 9. Statuts HTTP

|Code|Signification|
|---|---|
|200|OK|
|201|Créé|
|204|Supprimé|
|400|Requête invalide|
|401|Non authentifié|
|403|Interdit|
|404|Introuvable|
|500|Erreur serveur|

---

# 10. Modèles de données

## 10.1 User

```json
{
  "username": "string",
  "email": "string",
  "role": "user | moderator | admin",
  "avatar": "string | null"
}
```

## 10.2 Category

```json
{
  "name": "string",
  "slug": "string",
  "parent": "Category | null",
  "path": "string",
  "level": "number"
}
```

## 10.3 Tag

```json
{
  "name": "string",
  "slug": "string"
}
```

## 10.4 Article

```json
{
  "title": "string",
  "content": "string",
  "category": "Category",
  "tags": ["Tag"],
  "status": "draft | published",
  "views": 0,
  "readingTime": 3
}
```

## 10.5 Review

```json
{
  "content": "string",
  "author": "User",
  "article": "Article"
}
```
