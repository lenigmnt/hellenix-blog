# 🏛️ Hellenix — Blog MERN (thème universitaire)

**Hellenix** (du grec _hellene_ qui signifie "grec", en tant que peuple de la Grèce Antique) est un blog full-stack MERN destiné à l’usage d’étudiants en Humanités Numériques, domaine universitaire émergent depuis la moitié des années 2010s en France. Pour exemple, le programme du [Master Sciences des Données Histoire et Culture à Paris 1.](https://formations.pantheonsorbonne.fr/fr/catalogue-des-formations/master-M/master-histoire-de-l-art-KBUVEDV2/master-parcours-sciences-des-donnees-histoire-et-culture-fi-M5UAE5VQ.html)

Le projet permet de :

- publier des articles universitaires,
- de les organiser (catégories hiérarchiques et tags)
- et d’ajouter des commentaires (*reviews*).

Il s’inspire de :

- **Substack**, pour la forme : plateforme de publication de newsletter
- **Cairn**, pour le fond : site universitaire, pour la consultation de publications académiques (catégories, tags)
- Logique métier de sites communautaires de passionnés d’écriture et lecture

Petite précision : 

1. j’ai choisi délibérément `Review` à la place de `Comment`. Il s’agit d’un hommage à un type de sites communautaires de publications textuelles (qui existait à une époque antédiluvienne), où la section commentaires s’appelait “Review”. 
2. J’ai implémenté plus de choses côté back-end que côté front-end à ce stade (notamment les tags, gestion admin des users…)
3. J’ai ajouté l’état “brouillon” (`draft`), dans l’optique d’implémenter ultérieurement une sauvegarde automatique avant publication

---

## 🎯 Le projet

- Blog avec articles (`draft` / `published`)
- Catégories hiérarchiques et tags
- Reviews (commentaires) sur les articles publiés
- Authentification JWT
- Espace admin (statistiques et modération)
    - existe dans le back end (api) pas dans le front

---

## 🧱 Stack technique

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT (authentification)
- Middlewares de sécurité (CORS, rate-limit, sanitization, etc.)

### Frontend

- React
- React Router
- Context API
- Axios
- **Pico.css** (CSS léger, sans JavaScript)

---

## 📁 Organisation générale

Le projet est séparé en deux parties distinctes :

```
Blog-app/
├── backend/   # API REST (Node.js / Express / MongoDB)
└── frontend/  # Application React

```

- Le **backend** expose une API REST.
- Le **frontend** consomme cette API via Axios.

---

## ⚙️ Prérequis

- Node.js (v18 recommandée)
- npm
- MongoDB
    - installé localement
    - ou lancé via Docker
- Git

---

## 🚀 Lancement du backend

### 1️⃣ Accéder au dossier backend

```bash
cd backend

```

### 2️⃣ Installer les dépendances

```bash
npm install

```

### 3️⃣ Configurer les variables d’environnement

Créer un fichier `.env` à la racine de `backend/`.

Exemple minimal :

```
PORT=3001
MONGODB_URI=mongodb://localhost:27018/hellenix
JWT_SECRET=secret_jwt
JWT_EXPIRES_IN=90d

```

⚠️ Sans MongoDB actif, le serveur ne démarre pas.

---

### 4️⃣ Lancer MongoDB

**Option A — MongoDB local**

MongoDB doit être accessible sur `localhost:27018`.

**Option B — MongoDB via Docker**

```bash
docker run -d -p 27018:27017 --name mongo mongo:6

```

---

### 5️⃣ Démarrer le serveur backend

```bash
npm run dev

```

L’API est accessible sur :

```
http://localhost:3001/api

```

---

## 🔌 État actuel de l'API

### ✔️ Fonctionnalités opérationnelles

- Authentification (register / login)
- JWT fonctionnel
- Récupération et modification du profil
- Changement de mot de passe
- Accès public aux articles publiés
- Récupération d’un article publié par ID
- Lecture publique des catégories
- Création d’articles avec catégorie obligatoire
- Les tags ne sont pas requis pour créer un article

## 🎨 Lancement du frontend

### 6️⃣ Accéder au dossier frontend

```bash
cd ../frontend

```

### 7️⃣ Installer les dépendances

```bash
npm install

```

### 8️⃣ Configurer l’URL de l’API

Créer un fichier `.env` dans `frontend/` :

```
VITE_API_URL=http://localhost:3001/api

```

### 9️⃣ Démarrer le frontend

```bash
npm run dev

```

Application accessible sur :

```
http://localhost:5173

```

---

## 🔁 Fonctionnement global

- Le frontend appelle le backend via Axios (`src/services/`).
- Le backend renvoie des réponses JSON et des JWT lors de l’authentification.
- Le token JWT est stocké côté client et envoyé dans les headers :
    
    ```
    Authorization: Bearer <token>
    
    ```
    
- Les articles publiés sont accessibles sans authentification.
- Les actions de création, modification et administration nécessitent un compte.

---

## 🧩 Architecture frontend (React)

Organisation générale :

```
src/
├── app/               # Layout et router
├── pages/             # Pages (Home, ArticleDetail, Login, etc.)
├── components/        # Composants réutilisables
├── services/          # Appels API (Axios)
├── context/           # Auth globale (user / token)
├── hooks/             # Hooks personnalisés
├── utils/             # Helpers
└── styles/            # Styles CSS

```

### Dossier `src/styles/`

Les styles personnalisés viennent compléter Pico.css :

- `layout.css` → structure générale
- `article-card.css` → cartes articles
- `forms.css` → formulaires
- `buttons.css` → ajustements UI

Pico.css fournit une base sobre, et `src/styles/` permet d’affiner l’interface sans complexité.

---

## 🗂️ Architecture backend (API)

Le backend suit une organisation classique :

```
routes → controllers → services → models

```

L’API est exposée sous :

```
http://localhost:3001/api

```

---

## 🛠️ API — Routes principales

### Auth

```
POST   /auth/register
POST   /auth/login
GET    /auth/me
PATCH  /auth/update-me
PATCH  /auth/update-password

```

### Categories

```
GET    /categories
GET    /categories/:id
POST   /categories              (admin)
PATCH  /categories/:id          (admin)
DELETE /categories/:id          (admin)

```

### Tags

```
GET    /tags
GET    /tags/:id
POST   /tags                    (admin)
PATCH  /tags/:id                (admin)
DELETE /tags/:id                (admin)

```

### Articles

```
GET    /articles
GET    /articles/:id
GET    /articles/me
POST   /articles
PATCH  /articles/:id
PATCH  /articles/:id/publish
DELETE /articles/:id

```

Filtres :

```
/articles?category=<CATEGORY_ID>
/articles?tag=<TAG_ID>
/articles?search=<texte>

```

### Reviews

```
GET    /articles/:articleId/reviews
POST   /articles/:articleId/reviews
PATCH  /articles/:articleId/reviews/:id
DELETE /articles/:articleId/reviews/:id

```

### Admin

```
GET    /admin/stats
GET    /admin/users
PATCH  /admin/users/:id
DELETE /admin/users/:id

GET    /admin/articles
PATCH  /admin/articles/:id
DELETE /admin/articles/:id

GET    /admin/reviews
DELETE /admin/reviews/:id

```

---

## 🧪 Tests API

Une collection **Postman** est fournie pour tester :

- Auth
- Categories / Tags
- Articles
- Reviews (équivalent de “Commentaires”)
- Admin

Variables utilisées :

- `baseUrl`
- `token`

## **✅ Checklist de mon côté**

- [x]  Backend démarre sans erreur
- [x]  Frontend démarre sans erreur
- [x]  MongoDB se connecte correctement
- [x]  Inscription fonctionne
- [x]  Connexion fonctionne
- [x]  Création d'article fonctionne
- [x]  Modification d'article
- [x]  Suppression d'article
- [x]  Commentaires fonctionnent
    - voir les avis
        - count dans liste Article Card
        - poster un avis Article Detail
        - lire l’avis dans Article Detail
- [x]  Pagination fonctionne
    - Home et dans MyArticles ✅
- [x]  Recherche fonctionne
    - Home, ArticleCard ✅
- [x]  Routes protégées sans token → 401
    - middleware auth ✅
- [x]  Modification article autre user → 403
    - vérification author/admin ✅
- [x]  README complet avec instructions
- [x]  `.env.example` fourni
    - backend et frontend ✅
- [x]  Pas de `node_modules` dans Git
    - .gitignore en place ✅
- [x]  Pas de fichiers `.env` dans Git
    - .gitignore en place ✅


### ⚠️ Points en cours / à sécuriser

- Implémentation front du profil admin + gestion + stats 
- Implémentation Tags, likes, rating, 
- Compléter le profil, y ajouter des stats intéressantes pour le user
- Avancer avec le CSS
- Finalisation des vues frontend restantes

### 💡 Axes d'amélioration
- API de suggestion de lectures complémentaires en lien avec un article
- Intégration d'une fonctionnalité IA qui permet d'établir une bibliographie universitaire en lien avec un article ou un tag ou une catégorie
- Ultime : rendre le blog communautaire avec une messagerie intégrée, badges de productivité / notation / participation dans les commentaires...
---

## 🏁 Conclusion

Hellenix est un projet MERN complet mettant l’accent sur :

- une séparation claire frontend / backend
- une API sécurisée
- une interface sobre (Pico.css + styles organisés)
- une architecture maintenable et évolutive

Le projet peut être lancé et testé immédiatement après installation et configuration des variables d’environnement.

