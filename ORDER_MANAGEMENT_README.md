# 📋 Logique des Commandes ZiShop - Mise à jour selon le Cahier des Charges

## 🎯 Vue d'ensemble

Cette mise à jour implémente la logique complète des commandes selon le cahier des charges ZiShop, avec un workflow automatisé, une répartition de commission intelligente et une connexion en temps réel entre tous les dashboards.

## 🏗️ Architecture des Commandes

### Workflow des Statuts (Conformément au Cahier des Charges)

```
pending → confirmed → preparing → ready → delivering → delivered
   ↓         ↓          ↓         ↓          ↓
cancelled cancelled cancelled cancelled cancelled
```

**Statuts détaillés :**

1. **`pending`** : Commande créée, en attente de confirmation du commerçant
2. **`confirmed`** : Commande confirmée par le commerçant  
3. **`preparing`** : Commande en cours de préparation
4. **`ready`** : Commande prête pour livraison (avec estimation de livraison)
5. **`delivering`** : Commande en cours de livraison vers l'hôtel
6. **`delivered`** : Commande livrée à la réception de l'hôtel
7. **`cancelled`** : Commande annulée à tout moment

### Répartition de Commission (selon Cahier des Charges)

- **75%** → Commerçant
- **20%** → Zishop 
- **5%** → Hôtel

*Calcul automatique lors de la création de commande*

## 🛠️ Nouvelles Fonctionnalités Implémentées

### 1. Schema de Base de Données Enrichi

**Nouveaux champs dans la table `orders` :**

```sql
-- Commissions calculées automatiquement
merchantCommission: decimal(10,2) -- 75%
zishopCommission: decimal(10,2)   -- 20% 
hotelCommission: decimal(10,2)    -- 5%

-- Suivi temporel
confirmedAt: timestamp           -- Confirmation commerçant
deliveredAt: timestamp          -- Livraison réception
estimatedDelivery: timestamp    -- Estimation livraison

-- Notes livraison
deliveryNotes: text             -- Instructions spéciales
```

### 2. Composant de Gestion Avancée des Commandes

**Fichier:** `client/src/components/advanced-order-management.tsx`

**Fonctionnalités :**
- ✅ Visualisation workflow complet avec codes couleur
- ✅ Actions contextuelles selon le rôle utilisateur
- ✅ Calcul et affichage des commissions en temps réel
- ✅ Timeline des événements de commande
- ✅ Gestion des notes de livraison et estimations

**Actions par rôle :**

| Rôle | Actions Disponibles |
|------|-------------------|
| **Commerçant** | Confirmer, Refuser, Préparer, Marquer prêt, En livraison |
| **Hôtel** | Confirmer réception |
| **Admin** | Supervision complète, Vue détails |

### 3. API Enrichie avec Validation

**Nouveaux endpoints :**

```typescript
GET /api/orders/workflow              // Structure workflow
GET /api/orders/commissions/stats     // Stats commissions
POST /api/orders                      // Création avec commissions auto
PUT /api/orders/:id                   // Validation transitions
```

**Validation des transitions :**
- Contrôle automatique des transitions de statut valides
- Timestamps automatiques selon les changements d'état
- Calcul automatique des commissions à la création

### 4. Dashboards Connectés

#### Dashboard Marchand
- ✅ Vue commandes avec actions contextuelles
- ✅ Affichage commission 75% en temps réel
- ✅ Compteur commandes en attente
- ✅ Workflow visuel de préparation

#### Dashboard Hôtel  
- ✅ Suivi livraisons temps réel
- ✅ Confirmation réception en un clic
- ✅ Tableau répartition revenus (75% - 20% - 5%)
- ✅ Statistiques chambres actives

#### Dashboard Admin
- ✅ Supervision globale toutes commandes
- ✅ Détection commandes problématiques (>24h pending)
- ✅ Tableau financier complet avec tickets moyens
- ✅ Vue commission par période (jour/semaine/mois)

## 📊 Logique Métier Implémentée

### Création de Commande Automatisée

```typescript
// Calcul automatique des commissions
const totalAmount = parseFloat(orderData.totalAmount);
const merchantCommission = (totalAmount * 0.75).toFixed(2); // 75%
const zishopCommission = (totalAmount * 0.20).toFixed(2);   // 20% 
const hotelCommission = (totalAmount * 0.05).toFixed(2);    // 5%

// Génération numéro unique
const orderNumber = `ZS-${Date.now()}-${randomCode}`;
```

### Validation Workflow

```typescript
const validTransitions = {
  "pending": ["confirmed", "cancelled"],
  "confirmed": ["preparing", "cancelled"],
  "preparing": ["ready", "cancelled"],
  "ready": ["delivering", "cancelled"],
  "delivering": ["delivered", "cancelled"],
  "delivered": [], // État final
  "cancelled": [], // État final
};
```

### Statistiques Temps Réel

- **Commissions par période** (aujourd'hui, semaine, mois)
- **Détection anomalies** (commandes bloquées >24h)
- **Tickets moyens** par période
- **Répartition automatique** des revenus

## 🎨 Interface Utilisateur

### Codes Couleur Workflow

| Statut | Couleur | Usage |
|--------|---------|-------|
| `pending` | 🟡 Jaune | Attente action |
| `confirmed` | 🔵 Bleu | Confirmé |
| `preparing` | 🟠 Orange | En cours |
| `ready` | 🟣 Violet | Prêt |
| `delivering` | 🟦 Indigo | En route |
| `delivered` | 🟢 Vert | Terminé |
| `cancelled` | 🔴 Rouge | Annulé |

### Indicateurs Visuels

- **Bordures colorées** sur les cartes de commande
- **Badges de statut** avec couleurs appropriées
- **Icônes contextuelles** (horloge, paquet, camion, etc.)
- **Barres de progression** pour le workflow

## 🔗 Connexions entre Dashboards

### Communication Temps Réel

1. **Marchand confirme** → **Notification Hôtel** 
2. **Commande prête** → **Alerte Hôtel + estimation livraison**
3. **En livraison** → **Mise à jour dashboard Hôtel**
4. **Livré** → **Mise à jour stats commission tous dashboards**

### Synchronisation Données

- **Invalidation cache automatique** après chaque action
- **Rechargement statistiques** en temps réel
- **Mise à jour commissions** instantanée

## 🎯 Conformité Cahier des Charges

### ✅ Objectifs Atteints

- [x] **Logique commission 75/20/5** implémentée et automatisée
- [x] **Workflow complet** pending → delivered avec validation
- [x] **Dashboards connectés** avec actions contextuelles  
- [x] **Suivi livraison** avec confirmation réception
- [x] **Centralisation paiements** via Zishop avec redistribution
- [x] **Interface temps réel** pour chaque acteur
- [x] **Calcul automatique** commissions et timestamps

### 🚀 Fonctionnalités V1 (MVP)

- [x] Statuts manuels de livraison
- [x] Commission automatique calculée
- [x] Workflow de validation
- [x] Dashboards opérationnels
- [x] Suivi basique des commandes

### 🔄 Évolutions V2 (Prévues)

- [ ] Intégration API Yper pour livraison automatique
- [ ] Notifications push temps réel
- [ ] Signature de réception numérique
- [ ] Tracking GPS des livreurs
- [ ] Système de notation commandes

## 📈 Monitoring et Analytics

### Métriques Suivies

1. **Revenus par acteur** (commerçant/Zishop/hôtel)
2. **Temps de traitement** par étape du workflow
3. **Taux de conversion** commandes (pending → delivered)
4. **Commandes problématiques** détectées automatiquement
5. **Tickets moyens** par période et acteur

### Détection Anomalies

- **Commandes bloquées** en pending > 24h
- **Délais de préparation** anormalement longs
- **Échecs de livraison** répétés

## 🛡️ Sécurité et Validation

### Contrôles Implémentés

- **Validation TypeScript** stricte sur tous les types
- **Validation Zod** des données d'entrée
- **Contrôle des transitions** de statut autorisées
- **Calculs sécurisés** des commissions avec arrondi

### Gestion des Erreurs

- **Rollback automatique** en cas d'échec
- **Logs détaillés** pour debug
- **Messages d'erreur** contextuels pour l'utilisateur

## 🎉 Résultat Final

Une solution complète de gestion des commandes qui :

1. **Respecte exactement** le cahier des charges ZiShop
2. **Automatise** la répartition des commissions
3. **Connecte** tous les acteurs en temps réel  
4. **Valide** chaque étape du workflow
5. **Surveille** les performances et anomalies
6. **Prépare** l'intégration future avec Yper

Le système est maintenant prêt pour le déploiement MVP avec possibilité d'évolution naturelle vers la V2 ! 🚀 