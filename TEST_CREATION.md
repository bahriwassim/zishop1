# 🧪 Guide de Test - Création Hôtels/Commerçants

## ✅ Problèmes résolus

1. **Schémas de validation** corrigés (latitude/longitude)
2. **Gestion d'erreurs** améliorée avec messages détaillés  
3. **Logs console** ajoutés pour diagnostic
4. **Cache React Query** invalidé au lieu de reload complet
5. **Types TypeScript** corrigés

---

## 🚀 Comment tester

### 1. Démarrer l'application

```bash
# Terminal 1: Backend  
npm run dev:server

# Terminal 2: Frontend
npm run dev:client
```

### 2. Accéder au dashboard admin

- URL: `http://localhost:3000/admin-dashboard`
- Ouvrir les **DevTools Console** (F12)

### 3. Tester la création d'hôtel

**Étapes :**
1. Cliquer sur "Gestion Hôtels" dans la sidebar
2. Cliquer sur "Nouvel hôtel"  
3. Remplir le formulaire :
   - **Nom** : `Hôtel Test Paris`
   - **Adresse** : `123 Avenue des Champs-Élysées, 75008 Paris`
   - **Latitude** : `48.8566` 
   - **Longitude** : `2.3522`
4. Cliquer "Créer l'hôtel"

**Vérifications :**
- ✅ Message de succès affiché
- ✅ Code hôtel généré (ex: `ZIHÔT12345`)
- ✅ Formulaire se ferme
- ✅ Liste mise à jour automatiquement
- ✅ Logs dans console : `Tentative de création d'hôtel` + `Réponse du serveur`

### 4. Tester la création de commerçant

**Étapes :**
1. Cliquer sur "Gestion Commerçants" dans la sidebar
2. Cliquer sur "Nouveau commerçant"
3. Remplir le formulaire :
   - **Nom** : `Souvenirs de Paris`
   - **Catégorie** : `Souvenirs et Cadeaux`
   - **Adresse** : `15 Rue de Rivoli, 75001 Paris`
   - **Latitude** : `48.8606`
   - **Longitude** : `2.3376`
   - **Description** : `Boutique de souvenirs authentiques`
   - **URL Image** : (optionnel)
4. Cliquer "Créer le commerçant"

**Vérifications :**
- ✅ Message de succès affiché
- ✅ Formulaire se ferme
- ✅ Liste mise à jour automatiquement
- ✅ Logs dans console : `Tentative de création de commerçant` + `Réponse du serveur`

---

## 🔍 Diagnostic des erreurs

### Si la création ne fonctionne toujours pas :

1. **Vérifier que le serveur backend tourne**
   ```bash
   curl http://localhost:3000/api/hotels
   ```

2. **Vérifier les logs console**
   - Ouvrir DevTools (F12) → Console
   - Chercher les messages : `Tentative de création` et `Réponse du serveur`
   - Noter les erreurs exactes

3. **Erreurs courantes et solutions :**

   **Erreur 404 - Route non trouvée**
   ```
   Solution: Vérifier que le serveur backend est démarré
   ```

   **Erreur 400 - Données invalides**
   ```
   Solution: Vérifier que tous les champs requis sont remplis
   Latitude/Longitude doivent être des nombres valides
   ```

   **Erreur 500 - Erreur serveur**
   ```
   Solution: Vérifier les logs du serveur backend
   Problème probable avec la base de données
   ```

4. **Tester les endpoints directement :**
   ```bash
   # Créer un hôtel via curl
   curl -X POST http://localhost:3000/api/hotels \
   -H "Content-Type: application/json" \
   -d '{
     "name": "Test Hotel",
     "address": "123 Test Street",
     "code": "ZITEST123", 
     "qrCode": "https://zishop.co/hotel/ZITEST123",
     "latitude": "48.8566",
     "longitude": "2.3522",
     "isActive": true
   }'
   ```

---

## 🎯 Validation que ça fonctionne

### ✅ Création d'hôtel réussie
- Message toast vert "Hôtel créé avec succès"
- Code hôtel affiché (ex: ZI + préfixe + nombre)
- Retour à la liste des hôtels
- Nouvel hôtel visible dans la liste

### ✅ Création de commerçant réussie  
- Message toast vert "Commerçant créé avec succès"
- Retour à la liste des commerçants
- Nouveau commerçant visible dans la liste avec badge "Ouvert"

### ✅ Cache mis à jour
- Pas de rechargement de page complet
- Message "Liste des [hôtels/commerçants] mise à jour"
- Données fraîches affichées immédiatement

---

## 🐛 Si ça ne marche toujours pas

**Contactez avec ces informations :**
1. Messages d'erreur exact de la console
2. Réponse du serveur (visible dans les logs)
3. Données envoyées (visible dans les logs)
4. Version de Node.js : `node --version`
5. Statut du serveur : `curl http://localhost:3000/api/hotels`

---

**📝 Notes importantes :**
- Les coordonnées GPS de Paris : 48.8566, 2.3522
- Les formulaires ont une validation stricte des coordonnées
- Les codes d'hôtel sont générés automatiquement
- La commission de 75% est configurée par défaut pour les commerçants 