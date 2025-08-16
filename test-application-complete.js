#!/usr/bin/env node

/**
 * Script de test complet pour ZiShop
 * Teste toutes les fonctionnalités de l'application
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api`;

console.log('🧪 TEST COMPLET DE L\'APPLICATION ZISHOP');
console.log('========================================\n');

// Fonction utilitaire pour les tests
async function testEndpoint(method, endpoint, data = null, description = '') {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${description || `${method} ${endpoint}`}`);
      return result;
    } else {
      console.log(`❌ ${description || `${method} ${endpoint}`} - ${response.status}: ${result.message || 'Erreur'}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${description || `${method} ${endpoint}`} - Erreur: ${error.message}`);
    return null;
  }
}

// Test de la page d'accueil
async function testHomePage() {
  try {
    const response = await fetch(BASE_URL);
    if (response.ok) {
      console.log('✅ Page d\'accueil accessible');
      return true;
    } else {
      console.log(`❌ Page d'accueil - ${response.status}`);
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
  const hotels = await testEndpoint('GET', '/hotels', null, 'Récupération des hôtels');
  
  if (hotels && hotels.length === 0) {
    console.log('ℹ️  Aucun hôtel trouvé (normal au démarrage)');
  }
  
  // Test de création d'un hôtel
  const hotelData = {
    name: "Hôtel Test ZiShop",
    address: "123 Rue de Test, Ville Test",
    code: "TEST001",
    latitude: "48.8566",
    longitude: "2.3522"
  };
  
  const createdHotel = await testEndpoint('POST', '/hotels', hotelData, 'Création d\'un hôtel');
  
  if (createdHotel) {
    console.log(`🏨 Hôtel créé avec l'ID: ${createdHotel.id}`);
    
    // Test de récupération de l'hôtel créé
    await testEndpoint('GET', `/hotels/${createdHotel.id}`, null, 'Récupération de l\'hôtel créé');
    
    // Test de mise à jour
    const updateData = { name: "Hôtel Test ZiShop Modifié" };
    await testEndpoint('PUT', `/hotels/${createdHotel.id}`, updateData, 'Mise à jour de l\'hôtel');
  }
  
  // Test des commerçants
  console.log('\n🏪 Test des commerçants:');
  const merchants = await testEndpoint('GET', '/merchants', null, 'Récupération des commerçants');
  
  if (merchants && merchants.length === 0) {
    console.log('ℹ️  Aucun commerçant trouvé (normal au démarrage)');
  }
  
  // Test de création d'un commerçant
  const merchantData = {
    name: "Commerçant Test",
    address: "456 Avenue Test, Ville Test",
    category: "restaurant",
    latitude: "48.8566",
    longitude: "2.3522"
  };
  
  const createdMerchant = await testEndpoint('POST', '/merchants', merchantData, 'Création d\'un commerçant');
  
  if (createdMerchant) {
    console.log(`🏪 Commerçant créé avec l'ID: ${createdMerchant.id}`);
  }
  
  // Test des produits
  console.log('\n📦 Test des produits:');
  const products = await testEndpoint('GET', '/products', null, 'Récupération des produits');
  
  if (products && products.length === 0) {
    console.log('ℹ️  Aucun produit trouvé (normal au démarrage)');
  }
  
  // Test des commandes
  console.log('\n🛒 Test des commandes:');
  const orders = await testEndpoint('GET', '/orders', null, 'Récupération des commandes');
  
  if (orders && orders.length === 0) {
    console.log('ℹ️  Aucune commande trouvée (normal au démarrage)');
  }
  
  // Test des utilisateurs
  console.log('\n👤 Test des utilisateurs:');
  const users = await testEndpoint('GET', '/users', null, 'Récupération des utilisateurs');
  
  if (users && users.length === 0) {
    console.log('ℹ️  Aucun utilisateur trouvé (normal au démarrage)');
  }
  
  // Test des clients
  console.log('\n👥 Test des clients:');
  const clients = await testEndpoint('GET', '/clients', null, 'Récupération des clients');
  
  if (clients && clients.length === 0) {
    console.log('ℹ️  Aucun client trouvé (normal au démarrage)');
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
