# Guide de Test - Corrections Zishop

## ✅ Problèmes Corrigés

### 1. **Création d'hôtels/commerçants**
- ❌ **Avant :** Boutons non fonctionnels, schéma de validation incorrect
- ✅ **Après :** Endpoints corrigés, logs détaillés, génération QR automatique

### 2. **Dashboard Admin - Gestion des accès**
- ❌ **Avant :** Pas de gestion des utilisateurs
- ✅ **Après :** Section "Gestion Accès" ajoutée, endpoints API créés

### 3. **Validation des produits**
- ❌ **Avant :** Validation basique
- ✅ **Après :** Critères selon cahier des charges, endpoint de validation

## 🧪 Tests à Effectuer

### Test 1 : Création Hôtel
```bash
# Démarrer le serveur
npm run dev:server

# Tester l'endpoint
curl -X POST http://localhost:3000/api/hotels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hôtel Test",
    "address": "123 Rue Test, Paris",
    "code": "ZI_TEST_001",
    "latitude": "48.8566",
    "longitude": "2.3522"
  }'
```

### Test 2 : Création Commerçant  
```bash
curl -X POST http://localhost:3000/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Boutique Test",
    "address": "456 Avenue Test, Paris", 
    "category": "souvenirs",
    "latitude": "48.8698",
    "longitude": "2.3076"
  }'
```

### Test 3 : Création Utilisateur
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_test",
    "password": "secure123",
    "role": "admin"
  }'
```

### Test 4 : Validation Produit
```bash
curl -X POST http://localhost:3000/api/products/1/validate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "note": "Produit conforme"
  }'
```

## 📊 Interface Utilisateur

### Dashboard Admin
1. Aller sur `/admin-dashboard`
2. Tester "Gestion Hôtels" → "Nouvel hôtel"
3. Tester "Gestion Commerçants" → "Nouveau commerçant"
4. Vérifier "Gestion Accès" (section informative)
5. Tester "Validation Entités"

### Dashboard Commerçant  
1. Aller sur `/merchant-dashboard`
2. Vérifier les 4 indicateurs colorés des commandes
3. Vérifier commission 75% affichée

### Dashboard Hôtel
1. Aller sur `/hotel-dashboard`  
2. Vérifier les cases à cocher pour réception
3. Vérifier commission 5% affichée

## 🔍 Logs à Vérifier

### Console Serveur
```
Received hotel data: { name: "...", ... }
Hotel data with QR: { ..., qrCode: "https://zishop.co/hotel/..." }
Hôtel créé avec succès
```

### Console Navigateur (DevTools)
```
Création d'hôtel: { name: "...", ... }
Réponse du serveur: { id: 1, name: "...", qrCode: "..." }
```

## ⚠️ Diagnostic Problèmes

Si ça ne fonctionne toujours pas :

1. **Vérifier que le serveur est démarré**
2. **Regarder les logs d'erreur détaillés** 
3. **Tester les endpoints directement avec curl**
4. **Vérifier la base de données**

## 📋 Conformité Cahier des Charges

- ✅ Commission 75% commerçant, 20% Zishop, 5% hôtel
- ✅ Géolocalisation 3km, validation GPS
- ✅ QR codes génération automatique  
- ✅ Workflow complet des commandes
- ✅ Validation produits selon standards
- ✅ Interface admin supervision globale 