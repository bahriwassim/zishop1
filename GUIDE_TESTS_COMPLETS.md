# Guide des Tests Complets ZiShop

## 🎯 Objectif

Ce guide vous permet d'exécuter tous les tests de l'application ZiShop selon les scénarios du cahier des charges, en utilisant la base de données Supabase.

## 🚀 Démarrage Rapide

### Option 1: Lancement Automatique (Windows)
```bash
./test-and-run-zishop.bat
```

### Option 2: Lancement Manuel
```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur
npm run dev

# 3. Dans un autre terminal, lancer les tests
node test-complete-zishop-scenarios.js
```

### Option 3: Tests Rapides (Validation de base)
```bash
# Pour une validation rapide des fonctionnalités principales
node run-tests-quick.js
```

## 📋 Scénarios de Tests Couverts

### 1. Tests de Gestion des Entités ✅

#### 1.1 Cycle de Vie Hôtel
- ✅ Création d'un nouvel hôtel
- ✅ Génération automatique du code hôtel (format ZI######)
- ✅ Génération automatique du QR code
- ✅ Test d'activation/désactivation
- ✅ Vérification de la géolocalisation

**Données de test utilisées:**
```json
{
  "name": "Hôtel Test ZiShop",
  "address": "123 Rue de Test, 75001 Paris",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "is_active": true
}
```

#### 1.2 Cycle de Vie Commerçant
- ✅ Création d'un nouveau commerçant
- ✅ Ajout de produits
- ✅ Validation des produits par l'admin
- ✅ Association à des hôtels
- ✅ Vérification des revenus

**Données de test utilisées:**
```json
{
  "name": "Boutique Test ZiShop",
  "address": "456 Avenue de Test, 75002 Paris",
  "category": "Souvenirs",
  "latitude": 48.8606,
  "longitude": 2.3376,
  "rating": "4.5"
}
```

#### 1.3 Association Hôtel-Commerçants
- ✅ Sélection et association hôtel ↔ commerçants
- ✅ Activation/désactivation des associations
- ✅ Vérification de la persistance des données

### 2. Tests du Workflow de Commande ✅

#### 2.1 Parcours Client End-to-End
- ✅ Enregistrement et connexion client
- ✅ Scan QR code hôtel (simulation)
- ✅ Parcours des commerçants disponibles
- ✅ Sélection et ajout de produits au panier
- ✅ Processus de commande complet
- ✅ Suivi du statut de livraison

#### 2.2 Gestion du Panier
- ✅ Ajout de plusieurs produits
- ✅ Modification des quantités
- ✅ Suppression de produits
- ✅ Calcul automatique du total
- ✅ Validation du panier

#### 2.3 Workflow de Statuts
- ✅ Transitions de statut validées:
  - `pending` → `confirmed` → `preparing` → `ready` → `delivering` → `delivered`
- ✅ Calcul automatique des commissions (75%/20%/5%)
- ✅ Notifications à chaque changement de statut

### 3. Tests de Livraison et Suivi ✅

#### 3.1 Workflow de Livraison V1 (Manuel)
- ✅ Notification commerçant nouvelle commande
- ✅ Changement statut "En préparation"
- ✅ Changement statut "En livraison"
- ✅ Livraison à la réception hôtel
- ✅ Confirmation réception client

### 4. Tests des Dashboards ✅

#### 4.1 Dashboard Commerçant
- ✅ Liste des commandes avec filtres
- ✅ Gestion des statuts de livraison
- ✅ Consultation des revenus (75%)
- ✅ Gestion des produits
- ✅ Statistiques détaillées

#### 4.2 Dashboard Hôtel
- ✅ Commandes en cours
- ✅ Suivi des livraisons
- ✅ Revenus hôtel (5%)
- ✅ Validation des réceptions
- ✅ Statistiques activité

#### 4.3 Dashboard Admin
- ✅ Vue globale des commandes
- ✅ Gestion des utilisateurs
- ✅ Supervision des paiements
- ✅ Gestion des commissions (20%)
- ✅ Génération des QR codes

### 5. Tests de Géolocalisation ✅

#### 5.1 Recherche de Commerçants
- ✅ Filtre par rayon (1km, 3km, 5km, 10km)
- ✅ Calcul des distances
- ✅ Tri par distance
- ✅ Affichage des commerçants dans le rayon

### 6. Tests Avancés ✅

#### 6.1 Gestion des Utilisateurs
- ✅ Création utilisateurs (admin, hôtel, commerçant)
- ✅ Authentification par rôle
- ✅ Association utilisateur ↔ entité
- ✅ Gestion des permissions

#### 6.2 Notifications Système
- ✅ Notifications nouvelles commandes
- ✅ Notifications changements de statut
- ✅ Notifications temps réel

#### 6.3 Validation et Sécurité
- ✅ Validation des données entrantes
- ✅ Gestion du stock produits
- ✅ Vérification stock lors des commandes
- ✅ Prévention commandes avec stock insuffisant

## 📊 Structure des Commissions Testée

Le système respecte la répartition suivante:
- **Commerçant**: 75% du montant total
- **ZiShop**: 20% du montant total  
- **Hôtel**: 5% du montant total

**Validation**: ✅ Total = 100%

## 🔍 Points de Validation Critiques

### ✅ Fonctionnalités Validées
1. **Génération automatique des codes hôtel** (format ZI + 6 chiffres)
2. **Génération automatique des QR codes** (URL avec code hôtel)
3. **Calcul automatique des commissions** selon la répartition 75/20/5
4. **Workflow de statuts** avec validations des transitions
5. **Géolocalisation** avec calcul de distance et tri
6. **Gestion du stock** avec vérification avant commande
7. **Notifications** en temps réel pour tous les acteurs
8. **Authentification** et gestion des rôles

### ✅ Intégrité des Données
1. **Contraintes de base de données** respectées
2. **Relations entre entités** maintenues
3. **Validation côté serveur** active
4. **Gestion des erreurs** robuste

## 🐛 Résolution de Problèmes

### Problème: Serveur ne démarre pas
```bash
# Vérifier Node.js
node --version

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Problème: Tests échouent
```bash
# Vérifier que le serveur est démarré sur le port 5000
curl http://localhost:5000/api/hotels

# Vérifier les logs du serveur pour les erreurs
```

### Problème: Base de données
```bash
# Vérifier la configuration Supabase
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Relancer les scripts de setup
node scripts/setup-supabase.ts
```

## 📈 Métriques de Performance

Les tests mesurent:
- ⏱️ **Temps de réponse API** (< 1s par requête)
- 📊 **Throughput** (gestion simultanée de commandes)
- 🔄 **Intégrité transactionnelle** (rollback en cas d'erreur)
- 📱 **Responsive design** (adaptation mobile)

## 🎉 Succès des Tests

Si tous les tests passent, vous verrez:
```
🏆 TOUS LES TESTS ZISHOP SONT TERMINÉS !

📊 RÉSUMÉ DES DONNÉES CRÉÉES:
  Hôtels: X
  Commerçants: X  
  Produits: X
  Clients: X
  Commandes: X
  Utilisateurs: X

🎯 FONCTIONNALITÉS TESTÉES:
  ✅ Gestion des hôtels (création, QR codes, géolocalisation)
  ✅ Gestion des commerçants (création, produits, validation)
  ✅ Associations hôtel-commerçants
  ✅ Enregistrement et authentification clients
  ✅ Workflow complet de commande
  ✅ Gestion du panier
  ✅ Transitions de statut de commande
  ✅ Calcul des commissions (75%/20%/5%)
  ✅ Dashboards (admin, hôtel, commerçant)
  ✅ Géolocalisation et recherche par rayon
  ✅ Gestion des utilisateurs et rôles
  ✅ Système de notifications
  ✅ Validation des données et sécurité
  ✅ Gestion du stock des produits
```

## 📞 Support

Pour toute question ou problème lors des tests:
1. Vérifiez que le serveur est bien démarré
2. Vérifiez la configuration Supabase
3. Consultez les logs pour identifier les erreurs spécifiques
4. Relancez les tests avec `node run-tests-quick.js` pour une validation rapide

---

**Note**: Ces tests couvrent 100% des fonctionnalités spécifiées dans le cahier des charges ZiShop et valident l'intégration complète avec Supabase.