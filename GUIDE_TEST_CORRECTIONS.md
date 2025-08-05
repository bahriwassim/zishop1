# Guide de Test des Corrections - ZiShop E-commerce

## 🚀 Démarrage Rapide

### 1. Redémarrage du Serveur
```bash
# Arrêtez le serveur actuel (Ctrl+C)
# Puis redémarrez
npm run dev
# ou
yarn dev
```

### 2. Ouverture de la Console du Navigateur
- Appuyez sur `F12` ou `Ctrl+Shift+I`
- Allez dans l'onglet "Console"
- Vous devriez voir les logs de configuration Supabase

## 🧪 Tests des Corrections

### Test 1 : Association Hôtel-Commerçants (Admin)

#### Étapes :
1. **Accédez à l'admin dashboard**
   - URL : `http://localhost:3000/admin`
   - Connectez-vous avec vos identifiants admin

2. **Sélectionnez "Association Hôtel-Commerçants"**
   - Dans le menu de gauche
   - Cliquez sur l'icône Globe

3. **Testez le toggle des commerçants**
   - Sélectionnez un hôtel dans la liste déroulante
   - Vous devriez voir la liste des commerçants
   - Cliquez sur les switches pour activer/désactiver
   - Vérifiez que les changements sont persistés

#### ✅ Résultat Attendu :
- Les switches changent d'état immédiatement
- Les notifications de succès s'affichent
- Les associations sont sauvegardées en base

### Test 2 : Upload d'Images

#### Étapes :
1. **Accédez à l'admin dashboard**
   - Allez dans "Gestion Commerçants" ou "Validation Entités"

2. **Ajoutez un nouveau produit**
   - Cliquez sur "Ajouter un produit"
   - Remplissez les informations de base

3. **Testez l'upload d'image**
   - Cliquez sur la zone d'upload
   - Sélectionnez une image (JPEG, PNG, WebP, GIF)
   - Observez les informations de debug qui s'affichent

4. **Vérifiez la console du navigateur**
   - Vous devriez voir des logs détaillés
   - Exemple : "Début upload:", "Upload réussi, données:", etc.

#### ✅ Résultat Attendu :
- L'image s'affiche en prévisualisation
- Les informations de debug apparaissent
- L'upload se termine avec succès
- L'URL de l'image est générée

### Test 3 : QR Scanner

#### Étapes :
1. **Accédez à l'application mobile**
   - URL : `http://localhost:3000/mobile`
   - Ou utilisez l'application mobile

2. **Testez le scan QR**
   - Cliquez sur "Scanner QR"
   - Cliquez sur "Simuler scan QR"
   - Observez l'animation de chargement

3. **Testez la saisie manuelle**
   - Cliquez sur "Saisir le code manuellement"
   - Entrez un code hôtel (ex: ZI75015)
   - Cliquez sur "Valider"

#### ✅ Résultat Attendu :
- Animation de chargement pendant le scan
- Boutons désactivés pendant le processus
- Transition fluide vers le dashboard après scan

## 🔍 Vérification des Logs

### Logs Supabase (Console du Navigateur)
```
Configuration Supabase: {url: "Définie", key: "Définie"}
```

### Logs d'Upload (Console du Navigateur)
```
Fichier sélectionné: image.jpg 1024000 image/jpeg
Début upload: {bucket: "products", fileName: "image.jpg", size: 1024000}
Upload réussi, données: {path: "products/1234567890-image.jpg"}
URL publique générée: https://...
```

### Logs d'Association (Console du Navigateur)
```
Erreur lors du toggle: [erreur détaillée si problème]
```

## ❌ Diagnostic des Problèmes

### Si l'upload ne fonctionne toujours pas :

1. **Vérifiez les variables d'environnement**
   ```bash
   # Dans la console du navigateur, vous devriez voir :
   Configuration Supabase: {url: "Définie", key: "Définie"}
   
   # Si vous voyez "Manquante", configurez vos variables :
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Vérifiez les buckets Supabase**
   - Connectez-vous à votre dashboard Supabase
   - Allez dans Storage
   - Vérifiez que les buckets existent : `hotels`, `merchants`, `products`, `avatars`

3. **Vérifiez les permissions**
   - Dans Supabase Storage, vérifiez que les buckets sont publics
   - Vérifiez les politiques RLS (Row Level Security)

### Si l'association hôtel-commerçants ne fonctionne pas :

1. **Vérifiez les routes API**
   - Ouvrez les outils de développement (F12)
   - Allez dans l'onglet "Network"
   - Vérifiez que les requêtes vers `/api/hotel-merchants` passent

2. **Vérifiez la base de données**
   - Vérifiez que la table `hotel_merchants` existe
   - Vérifiez qu'elle contient les colonnes : `hotelId`, `merchantId`, `isActive`

### Si le QR scanner ne fonctionne pas :

1. **Vérifiez la console pour les erreurs JavaScript**
2. **Vérifiez que le composant se charge correctement**
3. **Testez avec différents codes hôtel**

## 📞 Support

### Informations à fournir en cas de problème :
1. **Screenshot de la console du navigateur**
2. **Screenshot de l'erreur affichée**
3. **Logs d'erreur complets**
4. **Étapes exactes pour reproduire le problème**

### Commandes utiles pour le debug :
```bash
# Vérifier les corrections
node test-corrections-final.js

# Vérifier la configuration
npm run build

# Redémarrer proprement
npm run dev
```

---

**Version :** 2.0
**Date :** $(date)
**Statut :** Prêt pour les tests 