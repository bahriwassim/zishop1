# 🚀 Guide de démarrage rapide - ZiShop E-commerce

## ✅ Ce qui a été configuré

Votre projet ZiShop est maintenant équipé de :

- **✅ Configuration Supabase** complète avec client JavaScript
- **✅ Schéma de base de données** pour l'e-commerce hôtelier
- **✅ Système d'upload d'images** vers Supabase Storage
- **✅ Données de test** avec vos hôtels parisiens
- **✅ Composants React** pour l'upload d'images
- **✅ Scripts d'installation** automatisés

## 🏨 Hôtels configurés

1. **Novotel Paris Vaugirard Montparnasse** (Code: NPV001)
2. **Hôtel Mercure Paris Boulogne** (Code: MPB002)  
3. **ibis Paris La Défense Esplanade** (Code: IPD003)
4. **Novotel Paris la Défense Esplanade** (Code: NDE004)

## 📋 Étapes à suivre MAINTENANT

### 1. Configuration Supabase (5 min)

1. **Créer les tables :**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet
   - **SQL Editor** → Copiez et exécutez `scripts/create-tables.sql`

2. **Créer les buckets Storage :**
   - **Storage** → **New bucket**
   - Créez : `hotels`, `merchants`, `products`, `avatars` (tous publics)

3. **Insérer les données :**
   - **SQL Editor** → Copiez et exécutez `scripts/insert-test-data.sql`

### 2. Variables d'environnement

Créez `.env` :
```env
SUPABASE_URL=https://wmbwxdyifybrbrozlcef.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYnd4ZHlpZnlicmJyb3psY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzY1NjcsImV4cCI6MjA2NDkxMjU2N30.XdveZrItacB3XqKwHjBBKCO6KWU8qq5IXFcPZEFwKCk
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.wmbwxdyifybrbrozlcef.supabase.co:5432/postgres
```

### 3. Test de l'application

```bash
npm run dev
```

## 📱 Fonctionnalités disponibles

### 🔍 Lecture des données
```typescript
import { supabase } from './shared/supabase'

// Lire les hôtels
const { data: hotels } = await supabase
  .from('hotels')
  .select('*')
  .eq('is_active', true)

// Lire les produits avec marchands
const { data: products } = await supabase
  .from('products_with_merchant')
  .select('*')
  .eq('is_available', true)
```

### 📸 Upload d'images
```typescript
import { ImageUpload } from './client/src/components/ImageUpload'
import { STORAGE_BUCKETS } from './shared/supabase'

<ImageUpload
  bucket={STORAGE_BUCKETS.PRODUCTS}
  onImageUploaded={(url, path) => {
    console.log('Image uploadée:', url)
  }}
  placeholder="Uploader une photo du produit"
/>
```

### 🛒 Créer une commande
```typescript
const newOrder = {
  hotel_id: 1,
  merchant_id: 1,
  order_number: `ORD-${Date.now()}`,
  customer_name: 'Jean Dupont',
  customer_room: '205',
  items: [
    { product_id: 1, name: 'Croissant', price: 3.50, quantity: 2 }
  ],
  total_amount: 7.00,
  status: 'pending'
}

const { data, error } = await supabase
  .from('orders')
  .insert([newOrder])
```

## 🗂️ Structure des fichiers créés

```
📁 shared/
  ├── supabase.ts          # Configuration client Supabase
  └── storage-utils.ts     # Utilitaires upload images

📁 scripts/
  ├── create-tables.sql    # Script création des tables
  ├── insert-test-data.sql # Données de test à insérer
  ├── setup-supabase.ts    # Script automatique (optionnel)
  └── seed-data.ts         # Script automatique (optionnel)

📁 client/src/
  ├── components/
  │   └── ImageUpload.tsx  # Composant upload d'images
  └── pages/
      └── AdminProductForm.tsx # Formulaire produits avec images

📁 Documentation/
  ├── SUPABASE_SETUP.md    # Guide détaillé
  └── GETTING_STARTED.md   # Ce fichier
```

## 🎯 Prochaines étapes

### Immediate (aujourd'hui)
1. ✅ Exécuter les scripts SQL dans Supabase
2. ✅ Créer les buckets Storage
3. ✅ Tester la connexion avec `npm run dev`

### Court terme (cette semaine)
- **Authentification Supabase** pour les utilisateurs
- **Interface admin** pour gérer les produits
- **QR Codes** pour les hôtels
- **API routes** pour les commandes

### Moyen terme
- **Notifications temps réel** avec Supabase
- **Géolocalisation** des marchands
- **Système de paiement**
- **App mobile** React Native

## 🔧 Utilitaires inclus

### Validation d'images
```typescript
import { validateImageFile } from './shared/storage-utils'

const validation = validateImageFile(file)
if (!validation.valid) {
  console.error(validation.error)
}
```

### Redimensionnement automatique
```typescript
import { resizeImage } from './shared/storage-utils'

const resizedFile = await resizeImage(file, 800, 600, 0.8)
```

### Gestion des buckets
```typescript
import { createStorageBuckets } from './shared/storage-utils'

const results = await createStorageBuckets()
console.log('Buckets créés:', results)
```

## 📊 Données de test disponibles

Après avoir exécuté `scripts/insert-test-data.sql` :
- **4 hôtels parisiens** avec coordonnées GPS
- **6 marchands** autour des hôtels
- **12 produits** variés (croissants, souvenirs, etc.)
- **5 utilisateurs** de test (admin, hôteliers, marchands)
- **1 commande** exemple

## 🔐 Comptes de test

| Username | Password | Rôle | Accès |
|----------|----------|------|-------|
| `admin` | `admin123` | Admin | Tout |
| `hotel_novotel_vaugirard` | `hotel123` | Hotel | Novotel Vaugirard |
| `hotel_mercure_boulogne` | `hotel123` | Hotel | Mercure Boulogne |
| `merchant_boulangerie` | `merchant123` | Merchant | Boulangerie |
| `merchant_souvenirs` | `merchant123` | Merchant | Souvenirs |

## 🆘 Aide et support

### Vérifications en cas de problème

1. **Tables manquantes ?**
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   ```

2. **Buckets manquants ?**
   - Vérifiez dans Storage > Buckets
   - Créez manuellement si nécessaire

3. **Erreurs d'upload ?**
   - Vérifiez les politiques Storage
   - Taille max : 5MB
   - Types : JPEG, PNG, WebP, GIF

4. **Connexion échouée ?**
   - Vérifiez les variables d'environnement
   - URL et clé API correctes

### Resources utiles
- [Documentation Supabase](https://supabase.com/docs)
- [Guide Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

🎉 **Votre projet ZiShop est maintenant prêt avec Supabase !**

Commencez par exécuter les scripts SQL puis testez l'upload d'images avec le composant `ImageUpload`. 

Besoin d'aide ? Vérifiez les logs Supabase dans le dashboard pour diagnostiquer les problèmes. 