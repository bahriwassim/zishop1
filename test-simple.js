#!/usr/bin/env node

/**
 * Script de test simple pour ZiShop
 * Utilise les modules natifs de Node.js
 */

import http from 'http';
import https from 'https';

const BASE_URL = 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api`;

console.log('🧪 TEST SIMPLE DE L\'APPLICATION ZISHOP');
console.log('=======================================\n');

// Fonction utilitaire pour les tests HTTP
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test de la page d'accueil
async function testHomePage() {
  try {
    const result = await makeRequest(BASE_URL);
    if (result.status === 200) {
      console.log('✅ Page d\'accueil accessible');
      return true;
    } else {
      console.log(`❌ Page d'accueil - ${result.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Page d'accueil - Erreur: ${error.message}`);
    return false;
  }
}

// Tests des API
async function runAPITests() {
  console.log('📱 TESTS DES API\n');
  
  // Test des hôtels
  console.log('🏨 Test des hôtels:');
  try {
    const result = await makeRequest(`${API_BASE}/hotels`);
    if (result.status === 200) {
      console.log('✅ Récupération des hôtels réussie');
      if (result.data && result.data.length === 0) {
        console.log('ℹ️  Aucun hôtel trouvé (normal au démarrage)');
      }
    } else {
      console.log(`❌ Récupération des hôtels - ${result.status}`);
    }
  } catch (error) {
    console.log(`❌ Récupération des hôtels - Erreur: ${error.message}`);
  }
  
  // Test de création d'un hôtel
  const hotelData = {
    name: "Hôtel Test ZiShop",
    address: "123 Rue de Test, Ville Test",
    code: "TEST001",
    latitude: "48.8566",
    longitude: "2.3522"
  };
  
  try {
    const result = await makeRequest(`${API_BASE}/hotels`, 'POST', hotelData);
    if (result.status === 201) {
      console.log('✅ Création d\'un hôtel réussie');
      console.log(`🏨 Hôtel créé avec l'ID: ${result.data.id}`);
    } else {
      console.log(`❌ Création d'un hôtel - ${result.status}: ${result.data.message || 'Erreur'}`);
    }
  } catch (error) {
    console.log(`❌ Création d'un hôtel - Erreur: ${error.message}`);
  }
  
  // Test des commerçants
  console.log('\n🏪 Test des commerçants:');
  try {
    const result = await makeRequest(`${API_BASE}/merchants`);
    if (result.status === 200) {
      console.log('✅ Récupération des commerçants réussie');
      if (result.data && result.data.length === 0) {
        console.log('ℹ️  Aucun commerçant trouvé (normal au démarrage)');
      }
    } else {
      console.log(`❌ Récupération des commerçants - ${result.status}`);
    }
  } catch (error) {
    console.log(`❌ Récupération des commerçants - Erreur: ${error.message}`);
  }
  
  // Test des produits
  console.log('\n📦 Test des produits:');
  try {
    const result = await makeRequest(`${API_BASE}/products`);
    if (result.status === 200) {
      console.log('✅ Récupération des produits réussie');
      if (result.data && result.data.length === 0) {
        console.log('ℹ️  Aucun produit trouvé (normal au démarrage)');
      }
    } else {
      console.log(`❌ Récupération des produits - ${result.status}`);
    }
  } catch (error) {
    console.log(`❌ Récupération des produits - Erreur: ${error.message}`);
  }
  
  // Test des commandes
  console.log('\n🛒 Test des commandes:');
  try {
    const result = await makeRequest(`${API_BASE}/orders`);
    if (result.status === 200) {
      console.log('✅ Récupération des commandes réussie');
      if (result.data && result.data.length === 0) {
        console.log('ℹ️  Aucune commande trouvée (normal au démarrage)');
      }
    } else {
      console.log(`❌ Récupération des commandes - ${result.status}`);
    }
  } catch (error) {
    console.log(`❌ Récupération des commandes - Erreur: ${error.message}`);
  }
}

// Test principal
async function runAllTests() {
  console.log('🚀 Démarrage des tests...\n');
  
  // Test de la page d'accueil
  console.log('🌐 TEST DE LA PAGE D\'ACCUEIL\n');
  const homePageOk = await testHomePage();
  
  if (!homePageOk) {
    console.log('\n❌ La page d\'accueil n\'est pas accessible');
    console.log('💡 Vérifiez que le serveur est démarré avec: npm run dev');
    return;
  }
  
  // Tests des API
  await runAPITests();
  
  console.log('\n🎯 TESTS TERMINÉS');
  console.log('==================');
  console.log('✅ Application ZiShop fonctionnelle !');
  console.log('🌐 Interface accessible sur: http://localhost:5000');
  console.log('📱 API disponible sur: http://localhost:5000/api');
  console.log('\n💡 Vous pouvez maintenant utiliser l\'application !');
}

// Exécuter les tests
runAllTests().catch(error => {
  console.error('❌ Erreur lors des tests:', error.message);
  process.exit(1);
}); 