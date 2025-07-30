# 🔧 Guide de Dépannage - Application Mobile

## Problème Identifié
L'erreur `"Unexpected token '<', "<!DOCTYPE"... is not valid JSON"` indique que l'application mobile reçoit du HTML au lieu de JSON.

## ✅ Solutions Appliquées

### 1. Configuration CORS
- ✅ Ajout de la configuration CORS sur le serveur
- ✅ Test de l'API depuis l'extérieur : **FONCTIONNE**
- ✅ Endpoint `/api/clients/register` accessible

## 🔍 Diagnostic

### Vérifications à Effectuer

#### 1. **Serveur en cours d'exécution**
```bash
npm run dev
```
- Vérifier que le serveur démarre sur le port 5000
- Vérifier les logs : `serving on port 5000`

#### 2. **Test de l'API**
```bash
node test-mobile-api.js
```
- Doit retourner : `Status: 201` et une réponse JSON

#### 3. **Configuration de l'application mobile**

**Vérifier l'URL de l'API :**
- Ouvrir `client/src/lib/api.ts`
- Vérifier que `API_URL = 'http://localhost:5000/api'`

**Vérifier la gestion d'erreur :**
- L'erreur HTML indique que l'application reçoit une page d'erreur
- Cela peut venir d'un proxy ou d'une redirection

## 🛠️ Solutions

### Solution 1 : Vérifier l'URL de l'API
Si l'application mobile tourne sur un port différent :

1. **Modifier l'URL de l'API :**
```javascript
// Dans client/src/lib/api.ts
const API_URL = 'http://localhost:5000/api';
```

2. **Ou utiliser l'IP locale :**
```javascript
const API_URL = 'http://127.0.0.1:5000/api';
```

### Solution 2 : Vérifier le réseau
1. **Tester la connectivité :**
```bash
ping localhost
```

2. **Vérifier le firewall :**
- Autoriser le port 5000 dans le firewall Windows

### Solution 3 : Redémarrer l'application
1. **Arrêter l'application mobile**
2. **Redémarrer le serveur :**
```bash
npm run dev
```
3. **Redémarrer l'application mobile**

### Solution 4 : Vérifier les logs
1. **Ouvrir la console du navigateur (F12)**
2. **Regarder les erreurs réseau**
3. **Vérifier les requêtes vers l'API**

## 🧪 Tests à Effectuer

### Test 1 : Création d'utilisateur
```javascript
// Dans la console du navigateur
fetch('http://localhost:5000/api/clients/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
    first_name: 'Test',
    last_name: 'User',
    phone: '06 12 34 56 78'
  })
}).then(r => r.json()).then(console.log)
```

### Test 2 : Vérifier l'accessibilité
```javascript
fetch('http://localhost:5000/api/hotels')
  .then(r => r.json())
  .then(console.log)
```

## 📱 Instructions pour l'Utilisateur

1. **Ouvrir l'application mobile**
2. **Ouvrir la console du navigateur (F12)**
3. **Tenter de créer un compte**
4. **Regarder les erreurs dans la console**
5. **Partager les erreurs pour diagnostic**

## 🔧 Configuration Alternative

Si le problème persiste, essayer :

1. **Changer l'URL de l'API :**
```javascript
const API_URL = 'http://127.0.0.1:5000/api';
```

2. **Ou utiliser l'IP de la machine :**
```javascript
const API_URL = 'http://192.168.1.XXX:5000/api';
```

## 📋 Checklist

- [ ] Serveur démarré sur le port 5000
- [ ] Test de l'API réussi
- [ ] Configuration CORS active
- [ ] URL de l'API correcte
- [ ] Pas de firewall bloquant
- [ ] Application mobile redémarrée

## Statut
🟡 **EN COURS** - L'API fonctionne, le problème vient de l'application mobile 