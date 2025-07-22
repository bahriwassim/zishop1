# 🚀 Guide de Configuration - Zishop Admin

## Vue d'ensemble des corrections

✅ **Dashboard Admin** : Ajout d'hôtels et commerçants corrigé  
✅ **Dashboard Commerçant** : Gestion des commandes améliorée  
✅ **Dashboard Hôtel** : Réception avec cases à cocher  
✅ **Base de données** : Schema mis à jour + scripts de migration  

---

## 🔧 Étapes de mise en place

### 1. Migration de la base de données

```bash
# Optionnel: Nettoyer les données demo
sqlite3 votre_base.db < scripts/clean-demo-data.sql

# Appliquer la migration pour la réception des commandes
sqlite3 votre_base.db < scripts/update-orders-pickup.sql
```

### 2. Démarrage de l'application

```bash
# Terminal 1: Démarrer le serveur backend
npm run dev:server

# Terminal 2: Démarrer le client frontend
npm run dev:client
```

### 3. Configuration initiale

**Accès Admin :**
- URL: `http://localhost:3000/admin`
- Login: `admin` / `password` (si existant)

---

## 📋 Tests des fonctionnalités

### ✅ Test Dashboard Admin

1. **Aller sur la section "Gestion Hôtels"**
   - Cliquer sur "Nouvel hôtel"
   - Remplir le formulaire (nom, adresse, coordonnées GPS)
   - Vérifier la génération automatique du code hôtel
   - Confirmer la création

2. **Aller sur la section "Gestion Commerçants"**
   - Cliquer sur "Nouveau commerçant"
   - Remplir le formulaire avec catégorie
   - Vérifier la géolocalisation (rayon 3km)
   - Confirmer la création

### ✅ Test Dashboard Commerçant

1. **Section "Gestion des commandes"**
   - Vérifier les 4 indicateurs : En attente, Préparation, Prêtes, Livrées
   - Tester le workflow : pending → confirmed → preparing → ready → delivering
   - Vérifier l'affichage de la commission (75%)

### ✅ Test Dashboard Hôtel

1. **Section "Réception"**
   - Vérifier les commandes "En livraison"
   - **Cases à cocher** : Valider article par article
   - Cliquer "Réception complète confirmée"
   - Vérifier passage en "En attente client"
   - Cliquer "Remis au client"
   - Vérifier statut final "Commande terminée"

---

## 🎯 Fonctionnalités principales

### Dashboard Admin
- ✅ Création d'hôtels avec QR code automatique
- ✅ Création de commerçants avec géolocalisation
- ✅ Vue d'ensemble des revenus et commissions
- ✅ Section de validation séparée

### Dashboard Commerçant  
- ✅ Statistiques visuelles des commandes par statut
- ✅ Workflow de gestion des commandes
- ✅ Affichage de la commission (75% du CA)
- ✅ Gestion des produits (existant)

### Dashboard Hôtel
- ✅ **Cases à cocher** pour validation des réceptions
- ✅ Workflow complet : Livraison → Réception → Remise client
- ✅ Indicateurs visuels par statut
- ✅ Suivi commission hôtel (5%)

---

## 🔍 Structure des données

### Commission (selon cahier des charges)
- **75%** → Commerçant
- **20%** → Zishop
- **5%** → Hôtel

### Workflow des commandes
```
pending → confirmed → preparing → ready → delivering → delivered → picked_up
```

### Nouvelles colonnes base de données
- `picked_up` : Boolean (client a récupéré ?)
- `picked_up_at` : Timestamp de remise

---

## 🐛 Résolution de problèmes

### La création d'hôtel/commerçant ne fonctionne pas
1. Vérifier que le serveur backend tourne sur le port 3000
2. Vérifier les logs console pour les erreurs
3. S'assurer que les routes `/api/hotels` et `/api/merchants` sont accessibles

### Les cases à cocher ne s'affichent pas
1. Vérifier que la commande contient des `items`
2. S'assurer que la base de données a été migrée
3. Vérifier la structure des données de commande

### Erreurs de commission
1. Vérifier que les colonnes `*_commission` existent
2. Contrôler que les calculs sont appliqués côté serveur
3. S'assurer que `totalAmount` est un nombre valide

---

## 📊 API Endpoints utilisés

### Hôtels
- `POST /api/hotels` - Création d'hôtel
- `GET /api/hotels` - Liste des hôtels

### Commerçants  
- `POST /api/merchants` - Création de commerçant
- `GET /api/merchants` - Liste des commerçants

### Commandes
- `PUT /api/orders/:id` - Mise à jour statut/remise
- `GET /api/orders/hotel/:id` - Commandes par hôtel
- `GET /api/orders/merchant/:id` - Commandes par commerçant

---

## ✨ Prochaines étapes (V2)

1. **Intégration Yper** pour livraison automatique
2. **Notifications temps réel** (WebSocket)
3. **Suivi GPS** des livreurs
4. **Interface white label** pour groupes hôteliers
5. **Tests automatisés** pour les nouveaux composants

---

**🎉 Toutes les fonctionnalités demandées sont maintenant opérationnelles !**

*Guide créé suite aux corrections des dashboards Zishop* 