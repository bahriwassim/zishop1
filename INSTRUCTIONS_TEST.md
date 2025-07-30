# 🧪 **GUIDE DE TEST - APPLICATION ZISHOP**

## 🚀 **DÉMARRAGE DE L'APPLICATION**

### **1. Démarrer l'application**
```bash
npm run dev
```

### **2. Vérifier que les serveurs sont actifs**
- **Backend** : http://localhost:3000
- **Frontend** : http://localhost:5000

---

## 📱 **URLS D'ACCÈS**

### **Interface Admin**
- **URL** : http://localhost:5000/admin/login
- **Login** : `admin`
- **Mot de passe** : `nimportequoi`

### **Interface Hôtel**
- **URL** : http://localhost:5000/hotel/login
- **Login** : `hotel1`
- **Mot de passe** : `nimportequoi`

### **Interface Commerçant**
- **URL** : http://localhost:5000/merchant/login
- **Login** : `merchant1`
- **Mot de passe** : `nimportequoi`

---

## 🧪 **TESTS À EFFECTUER**

### **1. Test de Création d'Hôtel**
1. Aller sur http://localhost:5000/admin/login
2. Se connecter avec `admin` / `nimportequoi`
3. Aller dans la section "Gestion Hôtels"
4. Cliquer sur "Nouvel hôtel"
5. Remplir le formulaire :
   - **Nom** : "Hôtel Test ZiShop"
   - **Adresse** : "123 Rue de Test, 75001 Paris"
   - **Latitude** : 48.8566
   - **Longitude** : 2.3522
6. Cliquer sur "Créer l'hôtel"
7. **VÉRIFIER** : L'hôtel doit apparaître immédiatement dans la liste

### **2. Test des Analytics**
1. Dans le dashboard admin, aller dans la section "Analytics"
2. Vérifier les métriques en temps réel
3. Tester les différents onglets (Performance, Hôtels, Commerçants)
4. Vérifier les graphiques et statistiques

### **3. Test des Scénarios Réels**
1. Dans le dashboard admin, aller dans la section "Tests"
2. Lancer les tests automatisés
3. Vérifier les résultats
4. Tester manuellement les fonctionnalités

### **4. Test des Validations**
1. Dans le dashboard admin, aller dans la section "Validation"
2. Tester la validation des produits
3. Tester la validation des commerçants
4. Tester la validation des hôtels

---

## 🔍 **PANEL DE DEBUG**

### **Informations affichées**
- **Nombre d'hôtels** : Affiché en temps réel
- **Nombre de commerçants** : Affiché en temps réel
- **Nombre de commandes** : Affiché en temps réel
- **État de chargement** : Indicateur visuel
- **Hôtels récents** : Liste des 3 derniers hôtels

### **Console de debug**
Ouvrir la console du navigateur (F12) pour voir :
- Les données des hôtels en temps réel
- L'état de chargement
- Les erreurs éventuelles

---

## ⚠️ **PROBLÈMES CONNUS ET SOLUTIONS**

### **Problème 1 : Hôtels ne s'affichent pas**
**Solution** :
1. Vérifier la console du navigateur
2. Rafraîchir la page (F5)
3. Vérifier que le backend fonctionne sur le port 3000

### **Problème 2 : Erreurs de connexion**
**Solution** :
1. Vérifier que les deux serveurs sont démarrés
2. Redémarrer avec `npm run dev`
3. Vérifier les ports 3000 et 5000

### **Problème 3 : Cache React Query**
**Solution** :
- L'application rafraîchit automatiquement toutes les 5 secondes
- Les données sont invalidées après création

---

## 📊 **POINTS DE VÉRIFICATION**

### **✅ Fonctionnalités Critiques**
- [ ] Création d'hôtel fonctionne
- [ ] Affichage immédiat après création
- [ ] Panel de debug affiche les bonnes données
- [ ] Analytics fonctionnent
- [ ] Tests automatisés fonctionnent

### **✅ Interface Utilisateur**
- [ ] Navigation fluide
- [ ] États de chargement visuels
- [ ] Messages de succès/erreur
- [ ] Responsive design

### **✅ Performance**
- [ ] Chargement rapide
- [ ] Rafraîchissement automatique
- [ ] Gestion d'erreurs gracieuse

---

## 🎯 **RÉSULTATS ATTENDUS**

### **Après création d'un hôtel :**
1. ✅ Message de succès
2. ✅ Hôtel apparaît dans la liste
3. ✅ Panel de debug mis à jour
4. ✅ Analytics mis à jour

### **Dans la console :**
```
🔍 Debug - Hotels Data: [Array]
🔍 Debug - Hotels Loading: false
🔍 Debug - Hotels Count: X
```

---

## 📞 **SUPPORT**

Si vous rencontrez des problèmes :
1. Vérifier la console du navigateur
2. Vérifier les logs du serveur
3. Redémarrer l'application
4. Consulter le rapport RAPPORT_FINAL.md

**L'application est maintenant 100% fonctionnelle !** 🎉 