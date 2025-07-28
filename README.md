# ZiShop E-commerce Platform

Une plateforme e-commerce moderne pour hôtels permettant aux clients de commander des produits locaux et souvenirs.

## 🚀 Installation Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration de l'environnement
```bash
npm run setup-env
```

### 3. Configuration de la base de données

#### Base de données locale (SQLite) - Recommandé pour les tests
```bash
# La base de données SQLite est configurée automatiquement
# Aucune installation supplémentaire requise
```

### 4. Démarrage de l'application
```bash
npm run dev
```

L'application sera accessible sur http://localhost:5000

## 🔧 Configuration

### Variables d'environnement

Le fichier `.env` est créé automatiquement avec:

```env
# Base de données SQLite (pour tests)
DATABASE_URL="sqlite://./test.db"

# Session
SESSION_SECRET="test-secret-for-development"

# Environnement
NODE_ENV="development"
```

### Scripts disponibles

- `npm run dev` - Démarrer en mode développement
- `npm run build` - Construire pour la production
- `npm run start` - Démarrer en mode production
- `npm run db:push` - Appliquer le schéma à la base de données
- `npm run seed` - Ajouter des données de test

## 🔐 Authentification (Mode Test)

### ⚠️ **AUTHENTIFICATION BYPASSÉE POUR LES TESTS**

L'authentification a été entièrement bypassée pour faciliter les tests:

- **N'importe quel nom d'utilisateur** avec **n'importe quel mot de passe** fonctionnera
- Les middlewares d'authentification sont désactivés
- Tous les endpoints sont accessibles sans restrictions

### Comptes de Test Disponibles

| Type | Username/Email | Rôle |
|------|----------------|------|
| **Admin** | `admin` | Administrateur |
| **Hôtels** | `hotel1`, `hotel_test`, `hotel_demo` | Gestion hôtel |
| **Commerçants** | `merchant1`, `merchant_souvenirs`, `merchant_test` | Gestion boutique |
| **Clients** | `test@example.com`, `client@test.com`, `demo@example.com` | Client final |

## 📱 Fonctionnalités

### Pour les Administrateurs
- Gestion des hôtels et commerçants
- Validation des produits
- Statistiques et commissions
- Gestion des utilisateurs

### Pour les Hôtels
- Réception et gestion des commandes
- Statistiques de l'hôtel
- Gestion des associations avec commerçants
- **Notifications en temps réel** des commandes

### Pour les Commerçants
- Gestion du catalogue produits
- Suivi des commandes
- Statistiques de vente
- **Notifications en temps réel** des nouvelles commandes

### Pour les Clients
- Navigation par hôtel via QR Code
- Commande de produits locaux
- Suivi des commandes
- Profil et historique
- **Notifications en temps réel** du statut des commandes

## 🔔 Système de Notifications

### Notifications WebSocket en Temps Réel

L'application inclut un système complet de notifications:

- **WebSocket** pour les mises à jour en temps réel
- **Notifications push** dans l'interface
- **Filtrage par rôle** (admin, hôtel, commerçant, client)
- **Historique des notifications**

### Test des Notifications

Visitez `/test-notifications` pour:
- Tester les notifications en temps réel
- Simuler des commandes
- Tester les transitions de statut
- Vérifier le fonctionnement du système

## 🛍️ Flux des Commandes

### Workflow Complet
```
pending → confirmed → preparing → ready → delivering → delivered → picked_up
```

### Commissions (selon cahier des charges)
- **75%** → Commerçant
- **20%** → Zishop
- **5%** → Hôtel

### Nouvelles fonctionnalités
- **Cases à cocher** pour validation des réceptions
- **Workflow complet** : Livraison → Réception → Remise client
- **Notifications automatiques** à chaque étape
- **Calcul automatique des commissions**

## 🛠️ Développement

### Structure de la base de données

Les tables principales:
- `hotels` - Informations des hôtels
- `merchants` - Commerçants et leurs informations
- `products` - Catalogue produits (avec validation admin)
- `orders` - Commandes et leur workflow
- `clients` - Comptes clients
- `users` - Utilisateurs admin/hôtel/merchant

### API Endpoints

#### Authentification
- `POST /api/auth/login` - Connexion (bypass activé)
- `POST /api/auth/logout` - Déconnexion

#### Hôtels
- `GET /api/hotels` - Liste des hôtels
- `POST /api/hotels` - Créer un hôtel (admin)
- `GET /api/hotels/:id` - Détails d'un hôtel

#### Produits
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `POST /api/products/:id/validate` - Valider un produit (admin)

#### Commandes
- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id` - Mettre à jour une commande

#### Tests et Notifications
- `POST /api/test/notification` - Envoyer notification de test
- `POST /api/test/order` - Créer commande de test
- `PUT /api/test/order/:id/status` - Changer statut commande test

### Pages de Test

- `/test-api` - Tests API et authentification
- `/test-notifications` - Tests du système de notifications
- `/landing` - Page d'accueil générale
- `/landing1` - Page commerçant
- `/landing2` - Page client

## 🔧 Technologies Utilisées

### Backend
- **Express.js** - Serveur web
- **SQLite** - Base de données (pour tests)
- **Drizzle ORM** - ORM TypeScript
- **Socket.IO** - WebSocket pour notifications
- **bcrypt** - Hashage des mots de passe (bypass activé)
- **JWT** - Tokens d'authentification

### Frontend
- **React** - Interface utilisateur
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **Shadcn/ui** - Composants UI
- **React Query** - Gestion des données
- **Socket.IO Client** - Notifications temps réel
- **Wouter** - Routage

## 🧪 Tests

### Tests Manuels Disponibles

1. **Test d'authentification** (`/test-api`)
   - Connexion avec différents rôles
   - Vérification des tokens

2. **Test des notifications** (`/test-notifications`)
   - Notifications en temps réel
   - Simulation de commandes
   - Workflow complet

3. **Test des dashboards**
   - Interface admin : création hôtels/commerçants
   - Interface hôtel : réception commandes
   - Interface commerçant : gestion produits

## 🐛 Dépannage

### Problèmes courants

**L'application ne démarre pas:**
1. Vérifier que Node.js est installé (v18+)
2. Exécuter `npm install`
3. Vérifier le fichier `.env`

**Les notifications ne fonctionnent pas:**
1. Vérifier que le serveur WebSocket est démarré
2. Ouvrir la console développeur pour les erreurs
3. Tester avec `/test-notifications`

**Erreur de base de données:**
1. Supprimer `test.db` et redémarrer
2. Vérifier les permissions de fichiers
3. Exécuter `npm run db:push`

## ⚠️ Important - Sécurité

### Pour les Tests UNIQUEMENT

Cette configuration est **EXCLUSIVEMENT** pour les tests de développement:

- ❌ **Ne jamais déployer** en production avec l'auth bypassée
- ❌ **Ne jamais utiliser** SQLite en production  
- ❌ **Ne jamais exposer** les endpoints de test

### Avant la Production

1. **Réactiver l'authentification** dans `server/auth.ts`
2. **Configurer PostgreSQL** ou une vraie base de données
3. **Supprimer les endpoints de test**
4. **Configurer HTTPS** et certificats SSL
5. **Ajouter rate limiting** et sécurité

## 🎯 Fonctionnalités Principales

### Dashboard Admin
- ✅ Création d'hôtels avec QR code automatique
- ✅ Création de commerçants avec géolocalisation
- ✅ Vue d'ensemble des revenus et commissions
- ✅ Section de validation des produits séparée
- ✅ Notifications en temps réel

### Dashboard Commerçant  
- ✅ Statistiques visuelles des commandes par statut
- ✅ Workflow de gestion des commandes
- ✅ Affichage de la commission (75% du CA)
- ✅ Gestion des produits avec validation admin
- ✅ Notifications des nouvelles commandes

### Dashboard Hôtel
- ✅ **Cases à cocher** pour validation des réceptions
- ✅ Workflow complet : Livraison → Réception → Remise client
- ✅ Indicateurs visuels par statut
- ✅ Suivi commission hôtel (5%)
- ✅ Notifications des livraisons

### Interface Client Mobile
- ✅ Scan QR code hôtel
- ✅ Navigation produits par commerçant
- ✅ Panier et commandes
- ✅ Suivi temps réel des commandes
- ✅ Notifications de statut

## 🚀 Démo et Tests

Pour tester rapidement toutes les fonctionnalités:

1. **Démarrer l'app** : `npm run dev`
2. **Test notifications** : http://localhost:5000/test-notifications
3. **Login admin** : http://localhost:5000/admin/login (admin/n'importe-quoi)
4. **Login hôtel** : http://localhost:5000/hotel/login (hotel1/n'importe-quoi)
5. **Login commerçant** : http://localhost:5000/merchant/login (merchant1/n'importe-quoi)
6. **App mobile** : http://localhost:5000/ (interface client)

**🎉 Toutes les fonctionnalités sont maintenant opérationnelles !**

---

*Application développée avec ❤️ pour ZiShop.co - Plateforme de commandes hôtelières* 