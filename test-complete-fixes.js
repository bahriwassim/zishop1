import axios from 'axios';

// Configuration
const BASE_URL = 'http://localhost:5000';
const TEST_TIMEOUT = 10000;

console.log('🧪 TESTS COMPLETS ZISHOP - CORRECTION DES PROBLÈMES');
console.log('==================================================');

// Utilitaires de test
const testUtils = {
  async makeRequest(method, endpoint, data = null, headers = {}) {
    try {
      const config = {
        method,
        url: `${BASE_URL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        timeout: TEST_TIMEOUT
      };
      
      if (data) {
        config.data = data;
      }
      
      const response = await axios(config);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  },
  
  logTest(name, result) {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${name}`);
    if (!result.success) {
      console.log(`   Erreur: ${JSON.stringify(result.error, null, 2)}`);
      console.log(`   Status: ${result.status}`);
    }
    return result.success;
  },
  
  generateTestData() {
    return {
      hotel: {
        name: "Hôtel Test ZiShop",
        address: "123 Rue de Test, 75001 Paris",
        latitude: "48.8566",
        longitude: "2.3522",
        is_active: true
      },
      merchant: {
        name: "Boutique Test ZiShop",
        address: "456 Avenue de Test, 75002 Paris",
        category: "Souvenirs",
        latitude: "48.8606",
        longitude: "2.3376",
        rating: "4.5"
      },
      product: {
        merchantId: 1,
        name: "Souvenir Test",
        description: "Produit de test pour validation",
        price: "15.50",
        category: "Souvenirs",
        isSouvenir: true,
        origin: "France",
        material: "Métal",
        stock: 10
      },
      order: {
        hotelId: 1,
        merchantId: 1,
        clientId: 1,
        customerName: "Test Client",
        customerRoom: "101",
        items: [
          { productId: 1, quantity: 2, name: "Souvenir Test", price: "15.50" }
        ],
        totalAmount: "31.00"
      },
      client: {
        email: "test@zishop.com",
        password: "password123",
        firstName: "Test",
        lastName: "Client",
        phone: "+33 6 12 34 56 78"
      }
    };
  }
};

// Tests de gestion des entités
async function testEntityManagement() {
  console.log('\n🏨 TESTS DE GESTION DES ENTITÉS');
  console.log('===============================');
  
  const testData = testUtils.generateTestData();
  let results = { hotels: 0, merchants: 0, products: 0, orders: 0 };
  
  // Test 1.1: Création d'hôtel
  console.log('\n1.1 Création et Gestion des Hôtels');
  console.log('-----------------------------------');
  
  const hotelResult = await testUtils.makeRequest('POST', '/api/hotels', testData.hotel);
  if (testUtils.logTest('Création d\'hôtel', hotelResult)) {
    results.hotels++;
    
    // Vérifier la génération du code hôtel
    if (hotelResult.data.code && hotelResult.data.code.startsWith('ZI')) {
      console.log('✅ Code hôtel généré automatiquement:', hotelResult.data.code);
    } else {
      console.log('❌ Code hôtel manquant ou invalide');
    }
    
    // Vérifier la génération du QR code
    if (hotelResult.data.qr_code && hotelResult.data.qr_code.includes('zishop.co')) {
      console.log('✅ QR code généré automatiquement');
    } else {
      console.log('❌ QR code manquant ou invalide');
    }
  }
  
  // Test 1.2: Création de commerçant
  console.log('\n1.2 Création et Gestion des Commerçants');
  console.log('----------------------------------------');
  
  const merchantResult = await testUtils.makeRequest('POST', '/api/merchants', testData.merchant);
  if (testUtils.logTest('Création de commerçant', merchantResult)) {
    results.merchants++;
  }
  
  // Test 1.3: Création de produit
  console.log('\n1.3 Création de Produits');
  console.log('------------------------');
  
  const productResult = await testUtils.makeRequest('POST', '/api/products', testData.product);
  if (testUtils.logTest('Création de produit', productResult)) {
    results.products++;
  }
  
  // Test 1.4: Association Hôtel-Commerçants
  console.log('\n1.4 Association Hôtel-Commerçants');
  console.log('---------------------------------');
  
  const associationResult = await testUtils.makeRequest('POST', '/api/hotel-merchants', {
    hotelId: 1,
    merchantId: 1
  });
  testUtils.logTest('Association hôtel-commerçant', associationResult);
  
  return results;
}

// Tests du workflow de commande
async function testOrderWorkflow() {
  console.log('\n📦 TESTS DU WORKFLOW DE COMMANDE');
  console.log('================================');
  
  const testData = testUtils.generateTestData();
  let orderId = null;
  
  // Test 2.1: Création de commande
  console.log('\n2.1 Création de Commande');
  console.log('------------------------');
  
  const orderResult = await testUtils.makeRequest('POST', '/api/orders', testData.order);
  if (testUtils.logTest('Création de commande', orderResult)) {
    orderId = orderResult.data.id;
    
    // Vérifier le calcul des commissions
    const totalAmount = parseFloat(testData.order.totalAmount);
    const expectedMerchantCommission = (totalAmount * 0.75).toFixed(2);
    const expectedZishopCommission = (totalAmount * 0.20).toFixed(2);
    const expectedHotelCommission = (totalAmount * 0.05).toFixed(2);
    
    if (orderResult.data.merchantCommission === expectedMerchantCommission) {
      console.log('✅ Commission commerçant correcte (75%)');
    } else {
      console.log('❌ Commission commerçant incorrecte');
    }
    
    if (orderResult.data.zishopCommission === expectedZishopCommission) {
      console.log('✅ Commission Zishop correcte (20%)');
    } else {
      console.log('❌ Commission Zishop incorrecte');
    }
    
    if (orderResult.data.hotelCommission === expectedHotelCommission) {
      console.log('✅ Commission hôtel correcte (5%)');
    } else {
      console.log('❌ Commission hôtel incorrecte');
    }
  }
  
  // Test 2.2: Workflow de statuts
  if (orderId) {
    console.log('\n2.2 Workflow de Statuts');
    console.log('----------------------');
    
    const statusTransitions = [
      { from: 'pending', to: 'confirmed', valid: true },
      { from: 'confirmed', to: 'preparing', valid: true },
      { from: 'preparing', to: 'ready', valid: true },
      { from: 'ready', to: 'delivering', valid: true },
      { from: 'delivering', to: 'delivered', valid: true }
    ];
    
    for (const transition of statusTransitions) {
      const updateResult = await testUtils.makeRequest('PUT', `/api/orders/${orderId}`, {
        status: transition.to
      });
      
      const testName = `Transition ${transition.from} → ${transition.to}`;
      testUtils.logTest(testName, updateResult);
    }
  }
  
  return orderId;
}

// Tests de géolocalisation
async function testGeolocation() {
  console.log('\n🗺️ TESTS DE GÉOLOCALISATION');
  console.log('===========================');
  
  // Test 3.1: Recherche de commerçants à proximité
  console.log('\n3.1 Recherche de Commerçants à Proximité');
  console.log('----------------------------------------');
  
  const nearbyResult = await testUtils.makeRequest('GET', '/api/merchants/near/1?radius=3');
  if (testUtils.logTest('Recherche commerçants à proximité', nearbyResult)) {
    console.log(`✅ ${nearbyResult.data.length} commerçants trouvés dans un rayon de 3km`);
  }
  
  return nearbyResult.success;
}

// Tests des dashboards
async function testDashboards() {
  console.log('\n📊 TESTS DES DASHBOARDS');
  console.log('======================');
  
  // Test 4.1: Dashboard Admin
  console.log('\n4.1 Dashboard Admin');
  console.log('------------------');
  
  const adminStatsResult = await testUtils.makeRequest('GET', '/api/stats/admin');
  testUtils.logTest('Statistiques admin', adminStatsResult);
  
  // Test 4.2: Dashboard Hôtel
  console.log('\n4.2 Dashboard Hôtel');
  console.log('------------------');
  
  const hotelStatsResult = await testUtils.makeRequest('GET', '/api/stats/hotel/1');
  testUtils.logTest('Statistiques hôtel', hotelStatsResult);
  
  // Test 4.3: Dashboard Commerçant
  console.log('\n4.3 Dashboard Commerçant');
  console.log('------------------------');
  
  const merchantStatsResult = await testUtils.makeRequest('GET', '/api/stats/merchant/1');
  testUtils.logTest('Statistiques commerçant', merchantStatsResult);
  
  return {
    admin: adminStatsResult.success,
    hotel: hotelStatsResult.success,
    merchant: merchantStatsResult.success
  };
}

// Tests d'authentification
async function testAuthentication() {
  console.log('\n🔐 TESTS D\'AUTHENTIFICATION');
  console.log('==========================');
  
  // Test 5.1: Authentification Admin
  console.log('\n5.1 Authentification Admin');
  console.log('-------------------------');
  
  const adminAuthResult = await testUtils.makeRequest('POST', '/api/auth/login', {
    username: 'admin',
    password: 'admin123'
  });
  testUtils.logTest('Login admin', adminAuthResult);
  
  // Test 5.2: Authentification Hôtel
  console.log('\n5.2 Authentification Hôtel');
  console.log('--------------------------');
  
  const hotelAuthResult = await testUtils.makeRequest('POST', '/api/auth/login', {
    username: 'hotel1',
    password: 'hotel123'
  });
  testUtils.logTest('Login hôtel', hotelAuthResult);
  
  // Test 5.3: Authentification Commerçant
  console.log('\n5.3 Authentification Commerçant');
  console.log('-------------------------------');
  
  const merchantAuthResult = await testUtils.makeRequest('POST', '/api/auth/login', {
    username: 'merchant1',
    password: 'merchant123'
  });
  testUtils.logTest('Login commerçant', merchantAuthResult);
  
  return {
    admin: adminAuthResult.success,
    hotel: hotelAuthResult.success,
    merchant: merchantAuthResult.success
  };
}

// Tests de gestion des clients
async function testClientManagement() {
  console.log('\n👤 TESTS DE GESTION DES CLIENTS');
  console.log('==============================');
  
  const testData = testUtils.generateTestData();
  
  // Test 6.1: Inscription client
  console.log('\n6.1 Inscription Client');
  console.log('----------------------');
  
  const registerResult = await testUtils.makeRequest('POST', '/api/clients/register', testData.client);
  testUtils.logTest('Inscription client', registerResult);
  
  // Test 6.2: Connexion client
  console.log('\n6.2 Connexion Client');
  console.log('-------------------');
  
  const loginResult = await testUtils.makeRequest('POST', '/api/clients/login', {
    email: testData.client.email,
    password: testData.client.password
  });
  testUtils.logTest('Connexion client', loginResult);
  
  return {
    register: registerResult.success,
    login: loginResult.success
  };
}

// Tests de notifications
async function testNotifications() {
  console.log('\n🔔 TESTS DE NOTIFICATIONS');
  console.log('========================');
  
  // Test 7.1: Notification de test
  console.log('\n7.1 Notification de Test');
  console.log('------------------------');
  
  const notificationResult = await testUtils.makeRequest('POST', '/api/test/notification');
  testUtils.logTest('Envoi notification de test', notificationResult);
  
  // Test 7.2: Commande de test avec notification
  console.log('\n7.2 Commande de Test avec Notification');
  console.log('-------------------------------------');
  
  const testOrderResult = await testUtils.makeRequest('POST', '/api/test/order');
  testUtils.logTest('Création commande de test', testOrderResult);
  
  return {
    notification: notificationResult.success,
    testOrder: testOrderResult.success
  };
}

// Tests de validation des produits
async function testProductValidation() {
  console.log('\n✅ TESTS DE VALIDATION DES PRODUITS');
  console.log('==================================');
  
  // Test 8.1: Validation de produit par admin
  console.log('\n8.1 Validation de Produit par Admin');
  console.log('-----------------------------------');
  
  // D'abord créer un produit pour le valider
  const testData = testUtils.generateTestData();
  const productResult = await testUtils.makeRequest('POST', '/api/products', testData.product);
  
  if (productResult.success) {
    const productId = productResult.data.id;
    const validationResult = await testUtils.makeRequest('POST', `/api/products/${productId}/validate`, {
      action: 'approve',
      note: 'Produit approuvé pour les tests'
    });
    testUtils.logTest('Validation produit (approbation)', validationResult);
    return validationResult.success;
  } else {
    console.log('❌ Impossible de créer un produit pour la validation');
    return false;
  }
}

// Tests de workflow complet
async function testCompleteWorkflow() {
  console.log('\n🔄 TESTS DE WORKFLOW COMPLET');
  console.log('===========================');
  
  const testData = testUtils.generateTestData();
  let workflowResults = {};
  
  // Étape 1: Créer les entités
  console.log('\nÉtape 1: Création des entités');
  console.log('-----------------------------');
  
  const hotelResult = await testUtils.makeRequest('POST', '/api/hotels', testData.hotel);
  const merchantResult = await testUtils.makeRequest('POST', '/api/merchants', testData.merchant);
  const productResult = await testUtils.makeRequest('POST', '/api/products', testData.product);
  
  workflowResults.entities = {
    hotel: hotelResult.success,
    merchant: merchantResult.success,
    product: productResult.success
  };
  
  // Étape 2: Associer hôtel et commerçant
  console.log('\nÉtape 2: Association hôtel-commerçant');
  console.log('-------------------------------------');
  
  const associationResult = await testUtils.makeRequest('POST', '/api/hotel-merchants', {
    hotelId: 1,
    merchantId: 1
  });
  workflowResults.association = associationResult.success;
  
  // Étape 3: Créer une commande
  console.log('\nÉtape 3: Création de commande');
  console.log('----------------------------');
  
  const orderResult = await testUtils.makeRequest('POST', '/api/orders', testData.order);
  workflowResults.order = orderResult.success;
  
  // Étape 4: Suivre le workflow de livraison
  if (orderResult.success) {
    console.log('\nÉtape 4: Workflow de livraison');
    console.log('----------------------------');
    
    const orderId = orderResult.data.id;
    const statuses = ['confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
    
    for (const status of statuses) {
      const updateResult = await testUtils.makeRequest('PUT', `/api/orders/${orderId}`, {
        status: status
      });
      console.log(`  ${updateResult.success ? '✅' : '❌'} Statut ${status}`);
    }
  }
  
  return workflowResults;
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Démarrage des tests complets...\n');
  
  const results = {
    entities: {},
    orderWorkflow: false,
    geolocation: false,
    dashboards: {},
    authentication: {},
    clients: {},
    notifications: {},
    productValidation: false,
    completeWorkflow: {}
  };
  
  try {
    // Test 1: Gestion des entités
    results.entities = await testEntityManagement();
    
    // Test 2: Workflow de commande
    results.orderWorkflow = await testOrderWorkflow() !== null;
    
    // Test 3: Géolocalisation
    results.geolocation = await testGeolocation();
    
    // Test 4: Dashboards
    results.dashboards = await testDashboards();
    
    // Test 5: Authentification
    results.authentication = await testAuthentication();
    
    // Test 6: Gestion des clients
    results.clients = await testClientManagement();
    
    // Test 7: Notifications
    results.notifications = await testNotifications();
    
    // Test 8: Validation des produits
    results.productValidation = await testProductValidation();
    
    // Test 9: Workflow complet
    results.completeWorkflow = await testCompleteWorkflow();
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
  
  // Génération du rapport final
  generateFinalReport(results);
}

// Génération du rapport final
function generateFinalReport(results) {
  console.log('\n📊 RAPPORT FINAL DES TESTS');
  console.log('==========================');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  console.log('\n📋 Résultats par catégorie:');
  console.log('----------------------------');
  
  // Entités
  console.log('\n🏨 Gestion des Entités:');
  Object.entries(results.entities).forEach(([key, value]) => {
    console.log(`  ${key}: ${value > 0 ? '✅' : '❌'} (${value} créé(s))`);
  });
  
  // Workflow de commande
  console.log(`\n📦 Workflow de Commande: ${results.orderWorkflow ? '✅' : '❌'}`);
  
  // Géolocalisation
  console.log(`\n🗺️ Géolocalisation: ${results.geolocation ? '✅' : '❌'}`);
  
  // Dashboards
  console.log('\n📊 Dashboards:');
  Object.entries(results.dashboards).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✅' : '❌'}`);
  });
  
  // Authentification
  console.log('\n🔐 Authentification:');
  Object.entries(results.authentication).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✅' : '❌'}`);
  });
  
  // Clients
  console.log('\n👤 Gestion des Clients:');
  Object.entries(results.clients).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✅' : '❌'}`);
  });
  
  // Notifications
  console.log('\n🔔 Notifications:');
  Object.entries(results.notifications).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✅' : '❌'}`);
  });
  
  // Validation des produits
  console.log(`\n✅ Validation des Produits: ${results.productValidation ? '✅' : '❌'}`);
  
  // Workflow complet
  console.log('\n🔄 Workflow Complet:');
  Object.entries(results.completeWorkflow).forEach(([key, value]) => {
    if (typeof value === 'object') {
      console.log(`  ${key}:`);
      Object.entries(value).forEach(([subKey, subValue]) => {
        console.log(`    ${subKey}: ${subValue ? '✅' : '❌'}`);
      });
    } else {
      console.log(`  ${key}: ${value ? '✅' : '❌'}`);
    }
  });
  
  // Calcul du score global
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(v => {
    if (typeof v === 'object') {
      return Object.values(v).some(subV => subV === true || subV > 0);
    }
    return v === true || v > 0;
  }).length;
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log('\n🎯 SCORE GLOBAL:');
  console.log('===============');
  console.log(`Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`Taux de succès: ${successRate}%`);
  
  if (successRate >= 80) {
    console.log('\n🎉 EXCELLENT! L\'application est prête pour la production.');
  } else if (successRate >= 60) {
    console.log('\n✅ BON! Quelques améliorations nécessaires.');
  } else {
    console.log('\n⚠️ ATTENTION! Des corrections importantes sont nécessaires.');
  }
  
  console.log('\n📝 Recommandations:');
  console.log('==================');
  console.log('1. Vérifier que le serveur est démarré sur le port 5000');
  console.log('2. S\'assurer que toutes les dépendances sont installées');
  console.log('3. Vérifier la configuration de la base de données');
  console.log('4. Tester manuellement les fonctionnalités critiques');
  console.log('5. Valider les workflows métier avec les utilisateurs');
}

// Exécution des tests
runAllTests().catch(console.error);

export {
  testUtils,
  testEntityManagement,
  testOrderWorkflow,
  testGeolocation,
  testDashboards,
  testAuthentication,
  testClientManagement,
  testNotifications,
  testProductValidation,
  testCompleteWorkflow,
  runAllTests
}; 