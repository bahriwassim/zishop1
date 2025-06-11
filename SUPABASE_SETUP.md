# Configuration Supabase pour ZiShop E-commerce

Ce guide vous explique comment configurer Supabase pour votre projet ZiShop E-commerce.

## 🚀 Prérequis

- Compte Supabase créé
- Node.js et npm installés
- Accès à votre projet Supabase

## 📋 Informations du projet

**URL du projet :** `https://wmbwxdyifybrbrozlcef.supabase.co`
**Clé API (anon/public) :** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYnd4ZHlpZnlicmJyb3psY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzY1NjcsImV4cCI6MjA2NDkxMjU2N30.XdveZrItacB3XqKwHjBBKCO6KWU8qq5IXFcPZEFwKCk`

## 📦 Installation des dépendances

Les dépendances Supabase ont déjà été ajoutées au `package.json`. Installez-les avec :

```bash
npm install
```

## 🗄️ Configuration de la base de données

### Étape 1 : Créer les tables

1. Connectez-vous à votre [Dashboard Supabase](https://supabase.com/dashboard)
2. Allez dans **SQL Editor**
3. Copiez et exécutez le contenu du fichier `scripts/create-tables.sql`

Ce script crée :
- ✅ Tables : `hotels`, `merchants`, `products`, `orders`, `users`
- ✅ Index pour les performances
- ✅ Triggers pour `updated_at`
- ✅ Politiques RLS (Row Level Security)
- ✅ Vues utiles
- ✅ Fonctions helpers

### Étape 2 : Configuration du Storage

Allez dans **Storage** dans votre dashboard Supabase et créez les buckets suivants :

1. **hotels** - Images des hôtels
2. **merchants** - Images des marchands/commerces
3. **products** - Images des produits
4. **avatars** - Photos de profil des utilisateurs

**Configuration recommandée pour chaque bucket :**
- Public : ✅ Oui
- Types de fichiers autorisés : `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Taille maximum : 5MB

### Étape 3 : Configurer les politiques Storage

Dans **Storage > Policies**, créez ces politiques pour chaque bucket :

```sql
-- Politique de lecture publique
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);

-- Politique d'upload pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique de suppression pour propriétaires
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (auth.uid() = owner);
```

## 🌱 Insertion des données de test

### Option 1 : Via script automatique

```bash
npm run db:setup  # Configure les buckets et tables
npm run db:seed   # Insère les données de test
```

### Option 2 : Manuellement

1. Assurez-vous que les tables sont créées
2. Exécutez le script de données :

```bash
npm run db:seed
```

## 📊 Données de test incluses

### Hôtels (4)
1. **Novotel Paris Vaugirard Montparnasse** (Code: NPV001)
2. **Hôtel Mercure Paris Boulogne** (Code: MPB002)
3. **ibis Paris La Défense Esplanade** (Code: IPD003)
4. **Novotel Paris la Défense Esplanade** (Code: NDE004)

### Marchands (6)
1. Boulangerie Du Coin Montparnasse
2. Boutique Souvenirs Tour Eiffel
3. Café de la Défense
4. Maison des Macarons Boulogne
5. Pharmacie Grande Arche
6. Épicerie Fine Montparnasse

### Utilisateurs de test
| Username | Password | Rôle | Accès |
|----------|----------|------|-------|
| `admin` | `admin123` | Admin | Tout |
| `hotel_novotel_vaugirard` | `hotel123` | Hotel | Novotel Vaugirard |
| `hotel_mercure_boulogne` | `hotel123` | Hotel | Mercure Boulogne |
| `merchant_boulangerie` | `merchant123` | Merchant | Boulangerie |
| `merchant_souvenirs` | `merchant123` | Merchant | Souvenirs |

## 🔧 Configuration de l'application

### Variables d'environnement

Créez un fichier `.env` avec :

```env
# Supabase
SUPABASE_URL=https://wmbwxdyifybrbrozlcef.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYnd4ZHlpZnlicmJyb3psY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzY1NjcsImV4cCI6MjA2NDkxMjU2N30.XdveZrItacB3XqKwHjBBKCO6KWU8qq5IXFcPZEFwKCk

# Base de données (URL de connection directe PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.wmbwxdyifybrbrozlcef.supabase.co:5432/postgres
```

> ⚠️ Remplacez `[PASSWORD]` par votre mot de passe de base de données Supabase

## 🎯 Utilisation

### Client Supabase

```typescript
import { supabase } from './shared/supabase.js'

// Lire les hôtels
const { data: hotels } = await supabase
  .from('hotels')
  .select('*')
  .eq('is_active', true)

// Créer une commande
const { data: order } = await supabase
  .from('orders')
  .insert({
    hotel_id: 1,
    merchant_id: 1,
    order_number: 'ORD-2024-001',
    customer_name: 'Jean Dupont',
    customer_room: '205',
    items: [{ product_id: 1, quantity: 2, price: 3.50 }],
    total_amount: 7.00
  })
```

### Upload d'images

```typescript
import { uploadImage, STORAGE_BUCKETS } from './shared/storage-utils.js'

// Upload image produit
const result = await uploadImage({
  file: imageFile,
  bucket: STORAGE_BUCKETS.PRODUCTS,
  path: `product-${productId}/main.jpg`
})

if (result.success) {
  console.log('Image uploadée:', result.url)
}
```

## 🔐 Authentification (à venir)

La configuration d'authentification sera ajoutée ultérieurement. Pour le moment, utilisez les utilisateurs de test créés dans la base de données.

## 📱 Structure des tables

### Table `hotels`
- Stocke les informations des hôtels partenaires
- Chaque hôtel a un code QR unique pour les commandes

### Table `merchants`
- Commerces/restaurants disponibles
- Géolocalisation pour calcul des distances

### Table `products`
- Produits disponibles chez chaque marchand
- Support pour les souvenirs avec origine/matériau

### Table `orders`
- Commandes passées via l'application
- Statuts : pending, confirmed, preparing, ready, delivered, cancelled

### Table `users`
- Utilisateurs du système (admin, hôtel, marchand)
- Lié aux entités via `entity_id`

## 🚦 Statuts des commandes

1. **pending** - Commande créée, en attente de confirmation
2. **confirmed** - Commande confirmée par le marchand
3. **preparing** - Commande en préparation
4. **ready** - Commande prête à être récupérée
5. **delivered** - Commande livrée
6. **cancelled** - Commande annulée

## 🛠️ Commandes utiles

```bash
# Configurer Supabase
npm run db:setup

# Insérer données de test
npm run db:seed

# Push schema Drizzle (si besoin)
npm run db:push

# Démarrer l'application
npm run dev
```

## 📞 Support

En cas de problème :
1. Vérifiez que toutes les tables sont créées
2. Vérifiez les politiques RLS
3. Vérifiez que les buckets storage existent
4. Consultez les logs Supabase dans le dashboard

## ✅ Checklist de configuration

- [ ] Tables créées via `scripts/create-tables.sql`
- [ ] Buckets storage créés (hotels, merchants, products, avatars)
- [ ] Politiques storage configurées
- [ ] Variables d'environnement définies
- [ ] Données de test insérées
- [ ] Test de connexion réussi

Une fois tous ces éléments configurés, votre application ZiShop sera prête à utiliser Supabase ! 🎉 