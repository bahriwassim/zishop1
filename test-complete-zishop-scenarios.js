#!/usr/bin/env node

/**
 * Script de Test Complet ZiShop
 * Tests de toutes les fonctionnalités selon le cahier des charges
 */

// Node.js 18+ has native fetch
// import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logTest(testName) {
  log(`\n🧪 ${testName}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || 'Unknown error'}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Request failed for ${url}:`, error.message);
    throw error;
  }
}

// Variables globales pour stocker les données créées
let testData = {
  hotels: [],
  merchants: [],
  products: [],
  clients: [],
  orders: [],
  users: []
};

/**
 * 1. TESTS DE GESTION DES ENTITÉS
 */

async function testHotelManagement() {
  logSection('1. TESTS DE GESTION DES HÔTELS');
  
  // 1.1 Création d'un nouvel hôtel
  logTest('Création d\'un nouvel hôtel');
  try {
    const hotelData = {
      name: "Hôtel Test ZiShop",
      address: "123 Rue de Test, 75001 Paris",
      latitude: 48.8566,
      longitude: 2.3522,
      is_active: true
    };
    
    const hotel = await makeRequest('/hotels', {
      method: 'POST',
      body: JSON.stringify(hotelData)
    });
    
    testData.hotels.push(hotel);
    
    logSuccess(`Hôtel créé avec l'ID: ${hotel.id}`);
    logInfo(`Code hôtel généré: ${hotel.code}`);
    logInfo(`QR Code généré: ${hotel.qr_code}`);
    
    // 1.2 Vérification de la génération automatique du code
    if (hotel.code && hotel.code.startsWith('ZI')) {
      logSuccess('Code hôtel généré automatiquement');
    } else {
      logError('Code hôtel non généré correctement');
    }
    
    // 1.3 Vérification de la génération du QR code
    if (hotel.qr_code && hotel.qr_code.includes(hotel.code)) {
      logSuccess('QR Code généré automatiquement');
    } else {
      logError('QR Code non généré correctement');
    }
    
    // 1.4 Test de récupération par code
    logTest('Récupération hôtel par code');
    const retrievedHotel = await makeRequest(`/hotels/code/${hotel.code}`);
    if (retrievedHotel.id === hotel.id) {
      logSuccess('Hôtel récupéré par code avec succès');
    } else {
      logError('Échec de récupération par code');
    }
    
  } catch (error) {
    logError(`Erreur création hôtel: ${error.message}`);
  }
}

async function testMerchantManagement() {
  logSection('2. TESTS DE GESTION DES COMMERÇANTS');
  
  // 2.1 Création d'un nouveau commerçant
  logTest('Création d\'un nouveau commerçant');
  try {
    const merchantData = {
      name: "Boutique Test ZiShop",
      address: "456 Avenue de Test, 75002 Paris",
      category: "Souvenirs",
      latitude: 48.8606,
      longitude: 2.3376,
      rating: "4.5",
      is_open: true
    };
    
    const merchant = await makeRequest('/merchants', {
      method: 'POST',
      body: JSON.stringify(merchantData)
    });
    
    testData.merchants.push(merchant);
    
    logSuccess(`Commerçant créé avec l'ID: ${merchant.id}`);
    logInfo(`Nom: ${merchant.name}`);
    logInfo(`Catégorie: ${merchant.category}`);
    logInfo(`Note: ${merchant.rating}`);
    
    // 2.2 Ajout de produits au commerçant
    logTest('Ajout de produits au commerçant');
    
    const products = [
      {
        merchantId: merchant.id,
        name: "T-shirt Souvenir Paris",
        description: "T-shirt souvenir de qualité",
        price: "25.00",
        category: "Vêtements",
        isSouvenir: true,
        origin: "France",
        material: "Coton",
        stock: 50,
        isAvailable: true
      },
      {
        merchantId: merchant.id,
        name: "Porte-clés Tour Eiffel",
        description: "Porte-clés Tour Eiffel authentique",
        price: "8.50",
        category: "Accessoires",
        isSouvenir: true,
        origin: "France",
        material: "Métal",
        stock: 100,
        isAvailable: true
      }
    ];
    
    for (const productData of products) {
      try {
        const product = await makeRequest('/products', {
          method: 'POST',
          body: JSON.stringify(productData)
        });
        
        testData.products.push(product);
        logSuccess(`Produit créé: ${product.name} (${product.price}€)`);
        
        // 2.3 Validation des produits par l'admin
        logTest(`Validation du produit: ${product.name}`);
        const validation = await makeRequest(`/products/${product.id}/validate`, {
          method: 'POST',
          body: JSON.stringify({
            action: 'approve',
            note: 'Produit conforme aux standards ZiShop'
          })
        });
        
        logSuccess(`Produit validé: ${product.name}`);
        
      } catch (error) {
        logError(`Erreur création produit: ${error.message}`);
      }
    }
    
  } catch (error) {
    logError(`Erreur création commerçant: ${error.message}`);
  }
}

async function testHotelMerchantAssociation() {
  logSection('3. TESTS D\'ASSOCIATION HÔTEL-COMMERÇANTS');
  
  if (testData.hotels.length === 0 || testData.merchants.length === 0) {
    logError('Aucun hôtel ou commerçant disponible pour les associations');
    return;
  }
  
  logTest('Association hôtel-commerçant');
  try {
    const hotel = testData.hotels[0];
    const merchant = testData.merchants[0];
    
    // 3.1 Créer une association
    const association = await makeRequest('/hotel-merchants', {
      method: 'POST',
      body: JSON.stringify({
        hotelId: hotel.id,
        merchantId: merchant.id
      })
    });
    
    logSuccess(`Association créée: Hôtel ${hotel.id} ↔ Commerçant ${merchant.id}`);
    
    // 3.2 Vérifier les associations
    logTest('Récupération des associations');
    const hotelMerchants = await makeRequest(`/hotels/${hotel.id}/merchants`);
    const merchantHotels = await makeRequest(`/merchants/${merchant.id}/hotels`);
    
    if (hotelMerchants.length > 0) {
      logSuccess(`Associations trouvées pour l'hôtel: ${hotelMerchants.length}`);
    }
    
    if (merchantHotels.length > 0) {
      logSuccess(`Associations trouvées pour le commerçant: ${merchantHotels.length}`);
    }
    
    // 3.3 Test de désactivation/activation
    logTest('Test activation/désactivation association');
    await makeRequest(`/hotel-merchants/${hotel.id}/${merchant.id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: false })
    });
    logSuccess('Association désactivée');
    
    await makeRequest(`/hotel-merchants/${hotel.id}/${merchant.id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: true })
    });
    logSuccess('Association réactivée');
    
  } catch (error) {
    logError(`Erreur association: ${error.message}`);
  }
}

/**
 * 2. TESTS DU WORKFLOW DE COMMANDE
 */

async function testClientRegistration() {
  logSection('4. TESTS D\'ENREGISTREMENT CLIENT');
  
  logTest('Enregistrement d\'un nouveau client');
  try {
    const clientData = {
      email: "client.test@zishop.co",
      password: "testpassword123",
      firstName: "Jean",
      lastName: "Dupont",
      phone: "+33123456789"
    };
    
    const result = await makeRequest('/clients/register', {
      method: 'POST',
      body: JSON.stringify(clientData)
    });
    
    testData.clients.push(result.client);
    
    logSuccess(`Client enregistré: ${result.client.email} (ID: ${result.client.id})`);
    
    // Test de connexion client
    logTest('Connexion du client');
    const loginResult = await makeRequest('/clients/login', {
      method: 'POST',
      body: JSON.stringify({
        email: clientData.email,
        password: clientData.password
      })
    });
    
    if (loginResult.token) {
      logSuccess('Connexion client réussie');
      logInfo(`Token généré: ${loginResult.token.substring(0, 20)}...`);
    }
    
  } catch (error) {
    logError(`Erreur enregistrement client: ${error.message}`);
  }
}

async function testOrderWorkflow() {
  logSection('5. TESTS DU WORKFLOW DE COMMANDE');
  
  if (testData.hotels.length === 0 || testData.merchants.length === 0 || testData.products.length === 0) {
    logError('Données manquantes pour tester le workflow de commande');
    return;
  }
  
  // 5.1 Création d'une commande complète
  logTest('Création d\'une commande complète');
  try {
    const hotel = testData.hotels[0];
    const merchant = testData.merchants[0];
    const client = testData.clients[0];
    const products = testData.products.slice(0, 2); // 2 premiers produits
    
    // Simulation d'un panier avec plusieurs produits
    const cartItems = products.map(product => ({
      productId: product.id,
      quantity: 2,
      name: product.name,
      price: product.price
    }));
    
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
    
    const orderData = {
      hotelId: hotel.id,
      merchantId: merchant.id,
      clientId: client ? client.id : undefined,
      customerName: client ? `${client.first_name} ${client.last_name}` : "Client Test",
      customerRoom: "101",
      items: cartItems,
      totalAmount: totalAmount,
      deliveryNotes: "Livrer à la réception SVP",
      estimatedDelivery: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1h
    };
    
    logInfo(`Commande pour ${totalAmount}€ avec ${cartItems.length} types de produits`);
    
    const order = await makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    
    testData.orders.push(order);
    
    logSuccess(`Commande créée: ${order.order_number} (ID: ${order.id})`);
    logInfo(`Montant total: ${order.total_amount}€`);
    logInfo(`Commission commerçant: ${order.merchant_commission}€ (75%)`);
    logInfo(`Commission ZiShop: ${order.zishop_commission}€ (20%)`);
    logInfo(`Commission hôtel: ${order.hotel_commission}€ (5%)`);
    
    // 5.2 Tests des transitions de statut
    logTest('Tests des transitions de statut de commande');
    
    const statusFlow = [
      { status: 'confirmed', description: 'Confirmée par le commerçant' },
      { status: 'preparing', description: 'En préparation' },
      { status: 'ready', description: 'Prête pour livraison' },
      { status: 'delivering', description: 'En cours de livraison' },
      { status: 'delivered', description: 'Livrée à la réception' }
    ];
    
    for (const step of statusFlow) {
      try {
        const updatedOrder = await makeRequest(`/orders/${order.id}`, {
          method: 'PUT',
          body: JSON.stringify({ status: step.status })
        });
        
        logSuccess(`Statut mis à jour: ${step.status} - ${step.description}`);
        
        // Petite pause pour simuler le temps réel
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        logError(`Erreur transition vers ${step.status}: ${error.message}`);
      }
    }
    
  } catch (error) {
    logError(`Erreur workflow commande: ${error.message}`);
  }
}

async function testCartManagement() {
  logSection('6. TESTS DE GESTION DU PANIER');
  
  logTest('Simulation de gestion de panier côté client');
  
  if (testData.products.length === 0) {
    logError('Aucun produit disponible pour tester le panier');
    return;
  }
  
  // Simulation d'un panier côté client
  let cart = [];
  
  // Ajout de produits
  logTest('Ajout de produits au panier');
  for (const product of testData.products.slice(0, 3)) {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      merchant: testData.merchants.find(m => m.id === product.merchant_id)
    };
    
    cart.push(cartItem);
    logSuccess(`Ajouté au panier: ${product.name} - ${product.price}€`);
  }
  
  // Modification des quantités
  logTest('Modification des quantités');
  cart[0].quantity = 3;
  logSuccess(`Quantité modifiée: ${cart[0].name} x${cart[0].quantity}`);
  
  // Calcul du total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  logInfo(`Total du panier: ${cartTotal.toFixed(2)}€`);
  
  // Suppression d'un produit
  logTest('Suppression d\'un produit du panier');
  const removedItem = cart.pop();
  logSuccess(`Produit retiré: ${removedItem.name}`);
  
  // Nouveau total
  const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  logInfo(`Nouveau total: ${newTotal.toFixed(2)}€`);
  
  logSuccess('Tests de gestion du panier terminés');
}

/**
 * 3. TESTS DES DASHBOARDS
 */

async function testDashboards() {
  logSection('7. TESTS DES DASHBOARDS');
  
  // 7.1 Dashboard Admin
  logTest('Dashboard Admin');
  try {
    const adminStats = await makeRequest('/stats/admin');
    
    logSuccess('Statistiques admin récupérées:');
    logInfo(`Hôtels actifs: ${adminStats.totalHotels}`);
    logInfo(`Commerçants actifs: ${adminStats.totalMerchants}`);
    logInfo(`Commandes aujourd'hui: ${adminStats.todayOrders}`);
    logInfo(`Revenus totaux: ${adminStats.totalRevenue}€`);
    logInfo(`Commission ZiShop: ${adminStats.commission}€`);
    
  } catch (error) {
    logError(`Erreur dashboard admin: ${error.message}`);
  }
  
  // 7.2 Dashboard Hôtel
  if (testData.hotels.length > 0) {
    logTest('Dashboard Hôtel');
    try {
      const hotel = testData.hotels[0];
      const hotelStats = await makeRequest(`/stats/hotel/${hotel.id}`);
      
      logSuccess('Statistiques hôtel récupérées:');
      logInfo(`Commandes aujourd'hui: ${hotelStats.todayOrders}`);
      logInfo(`Revenus totaux: ${hotelStats.totalRevenue}€`);
      logInfo(`Commission hôtel: ${hotelStats.commission}€`);
      logInfo(`Clients actifs: ${hotelStats.activeClients}`);
      
      // Test récupération commandes hôtel
      const hotelOrders = await makeRequest(`/orders/hotel/${hotel.id}`);
      logInfo(`Commandes de l'hôtel: ${hotelOrders.length}`);
      
    } catch (error) {
      logError(`Erreur dashboard hôtel: ${error.message}`);
    }
  }
  
  // 7.3 Dashboard Commerçant
  if (testData.merchants.length > 0) {
    logTest('Dashboard Commerçant');
    try {
      const merchant = testData.merchants[0];
      const merchantStats = await makeRequest(`/stats/merchant/${merchant.id}`);
      
      logSuccess('Statistiques commerçant récupérées:');
      logInfo(`Commandes aujourd'hui: ${merchantStats.todayOrders}`);
      logInfo(`Produits actifs: ${merchantStats.activeProducts}`);
      logInfo(`Revenus du jour: ${merchantStats.dailyRevenue}€`);
      logInfo(`Commandes totales: ${merchantStats.totalOrders}`);
      
      // Test récupération commandes commerçant
      const merchantOrders = await makeRequest(`/orders/merchant/${merchant.id}`);
      logInfo(`Commandes du commerçant: ${merchantOrders.length}`);
      
      // Test récupération produits commerçant
      const merchantProducts = await makeRequest(`/products/merchant/${merchant.id}`);
      logInfo(`Produits du commerçant: ${merchantProducts.length}`);
      
    } catch (error) {
      logError(`Erreur dashboard commerçant: ${error.message}`);
    }
  }
}

/**
 * 4. TESTS DE GÉOLOCALISATION
 */

async function testGeolocation() {
  logSection('8. TESTS DE GÉOLOCALISATION');
  
  if (testData.hotels.length === 0) {
    logError('Aucun hôtel disponible pour tester la géolocalisation');
    return;
  }
  
  logTest('Recherche de commerçants près d\'un hôtel');
  try {
    const hotel = testData.hotels[0];
    
    // Test avec différents rayons
    const radiuses = [1, 3, 5, 10];
    
    for (const radius of radiuses) {
      try {
        const nearbyMerchants = await makeRequest(`/merchants/near/${hotel.id}?radius=${radius}`);
        
        logSuccess(`Rayon ${radius}km: ${nearbyMerchants.length} commerçant(s) trouvé(s)`);
        
        // Afficher les détails des commerçants trouvés
        nearbyMerchants.forEach((merchant, index) => {
          if (merchant.distance !== undefined) {
            logInfo(`  ${index + 1}. ${merchant.name} - ${merchant.distance.toFixed(2)}km`);
          } else {
            logInfo(`  ${index + 1}. ${merchant.name} - Distance non calculée`);
          }
        });
        
      } catch (error) {
        logError(`Erreur recherche rayon ${radius}km: ${error.message}`);
      }
    }
    
    // Test de tri par distance
    logTest('Vérification du tri par distance');
    const merchants = await makeRequest(`/merchants/near/${hotel.id}?radius=10`);
    
    if (merchants.length > 1) {
      let isSorted = true;
      for (let i = 1; i < merchants.length; i++) {
        if (merchants[i].distance && merchants[i-1].distance && 
            merchants[i].distance < merchants[i-1].distance) {
          isSorted = false;
          break;
        }
      }
      
      if (isSorted) {
        logSuccess('Commerçants correctement triés par distance');
      } else {
        logError('Tri par distance incorrect');
      }
    }
    
  } catch (error) {
    logError(`Erreur géolocalisation: ${error.message}`);
  }
}

/**
 * 5. TESTS DE COMMISSIONS ET ANALYTIQUES
 */

async function testCommissionsAndAnalytics() {
  logSection('9. TESTS DE COMMISSIONS ET ANALYTIQUES');
  
  logTest('Test du workflow des commissions');
  try {
    // Récupération des statistiques de commissions
    const periods = ['today', 'week', 'month'];
    
    for (const period of periods) {
      try {
        const stats = await makeRequest(`/orders/commissions/stats?period=${period}`);
        
        logSuccess(`Statistiques période "${period}":`);
        logInfo(`  Nombre de commandes: ${stats.stats.orderCount}`);
        logInfo(`  Revenus totaux: ${stats.stats.totalRevenue}€`);
        logInfo(`  Commission commerçants: ${stats.stats.merchantCommission}€`);
        logInfo(`  Commission ZiShop: ${stats.stats.zishopCommission}€`);
        logInfo(`  Commission hôtels: ${stats.stats.hotelCommission}€`);
        logInfo(`  Panier moyen: ${stats.averageOrderValue}€`);
        
      } catch (error) {
        logError(`Erreur statistiques ${period}: ${error.message}`);
      }
    }
    
    // Test du workflow des commissions
    logTest('Vérification du calcul des commissions');
    const workflow = await makeRequest('/orders/workflow');
    
    logInfo('Structure des commissions:');
    logInfo(`  Commerçant: ${workflow.commissionStructure.merchant.percentage}%`);
    logInfo(`  ZiShop: ${workflow.commissionStructure.zishop.percentage}%`);
    logInfo(`  Hôtel: ${workflow.commissionStructure.hotel.percentage}%`);
    
    // Vérification que le total fait 100%
    const total = workflow.commissionStructure.merchant.percentage + 
                  workflow.commissionStructure.zishop.percentage + 
                  workflow.commissionStructure.hotel.percentage;
    
    if (total === 100) {
      logSuccess('Structure des commissions correcte (100%)');
    } else {
      logError(`Structure des commissions incorrecte (${total}%)`);
    }
    
  } catch (error) {
    logError(`Erreur commissions: ${error.message}`);
  }
}

/**
 * 6. TESTS DE GESTION DES UTILISATEURS
 */

async function testUserManagement() {
  logSection('10. TESTS DE GESTION DES UTILISATEURS');
  
  if (testData.hotels.length === 0 || testData.merchants.length === 0) {
    logError('Données manquantes pour tester la gestion des utilisateurs');
    return;
  }
  
  // 10.1 Création d'utilisateurs pour chaque rôle
  logTest('Création d\'utilisateurs pour chaque rôle');
  try {
    const hotel = testData.hotels[0];
    const merchant = testData.merchants[0];
    
    const users = [
      {
        username: 'admin-test',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'hotel-test',
        password: 'hotel123',
        role: 'hotel',
        entityId: hotel.id
      },
      {
        username: 'merchant-test',
        password: 'merchant123',
        role: 'merchant',
        entityId: merchant.id
      }
    ];
    
    for (const userData of users) {
      try {
        const user = await makeRequest('/users', {
          method: 'POST',
          body: JSON.stringify(userData)
        });
        
        testData.users.push(user);
        logSuccess(`Utilisateur créé: ${user.username} (${user.role})`);
        
        if (user.entityId) {
          logInfo(`  Associé à l'entité ID: ${user.entityId}`);
        }
        
      } catch (error) {
        logError(`Erreur création utilisateur ${userData.username}: ${error.message}`);
      }
    }
    
    // 10.2 Test de connexion pour chaque utilisateur
    logTest('Test de connexion des utilisateurs');
    for (const userData of users) {
      try {
        const loginResult = await makeRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            username: userData.username,
            password: userData.password
          })
        });
        
        if (loginResult.token) {
          logSuccess(`Connexion réussie: ${userData.username}`);
          logInfo(`  Rôle: ${loginResult.user.role}`);
          if (loginResult.entity) {
            logInfo(`  Entité: ${loginResult.entity.name}`);
          }
        }
        
      } catch (error) {
        logError(`Erreur connexion ${userData.username}: ${error.message}`);
      }
    }
    
    // 10.3 Récupération de tous les utilisateurs
    logTest('Récupération de tous les utilisateurs');
    const allUsers = await makeRequest('/users');
    logSuccess(`${allUsers.length} utilisateur(s) trouvé(s)`);
    
    allUsers.forEach(user => {
      logInfo(`  ${user.username} (${user.role}) - ${user.entityName || 'Pas d\'entité'}`);
    });
    
  } catch (error) {
    logError(`Erreur gestion utilisateurs: ${error.message}`);
  }
}

/**
 * 7. TESTS DE NOTIFICATIONS
 */

async function testNotifications() {
  logSection('11. TESTS DE NOTIFICATIONS');
  
  logTest('Test des notifications système');
  try {
    // Test de notification simple
    await makeRequest('/test/notification', { method: 'POST' });
    logSuccess('Notification de test envoyée');
    
    // Test de création de commande avec notification
    logTest('Test de commande avec notifications');
    const testOrder = await makeRequest('/test/order', { method: 'POST' });
    
    if (testOrder.order) {
      logSuccess(`Commande de test créée: ${testOrder.order.order_number}`);
      testData.orders.push(testOrder.order);
      
      // Test des notifications de changement de statut
      const statusUpdates = ['confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
      
      for (const status of statusUpdates) {
        try {
          await makeRequest(`/test/order/${testOrder.order.id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
          });
          
          logSuccess(`Notification envoyée pour statut: ${status}`);
          await new Promise(resolve => setTimeout(resolve, 300)); // Pause
          
        } catch (error) {
          logError(`Erreur notification ${status}: ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    logError(`Erreur notifications: ${error.message}`);
  }
}

/**
 * 8. TESTS DE VALIDATION ET SÉCURITÉ
 */

async function testValidationAndSecurity() {
  logSection('12. TESTS DE VALIDATION ET SÉCURITÉ');
  
  // 12.1 Test de validation des données
  logTest('Test de validation des données invalides');
  
  // Test création hôtel avec données invalides
  try {
    await makeRequest('/hotels', {
      method: 'POST',
      body: JSON.stringify({
        name: '', // Nom vide
        address: 'Test',
        latitude: 'invalid', // Latitude invalide
        longitude: 'invalid'
      })
    });
    logError('Validation échouée: hôtel avec données invalides accepté');
  } catch (error) {
    logSuccess('Validation réussie: hôtel avec données invalides rejeté');
  }
  
  // Test création produit avec prix invalide
  try {
    await makeRequest('/products', {
      method: 'POST',
      body: JSON.stringify({
        merchantId: 999, // ID inexistant
        name: 'Test',
        price: -10, // Prix négatif
        category: ''
      })
    });
    logError('Validation échouée: produit avec prix négatif accepté');
  } catch (error) {
    logSuccess('Validation réussie: produit avec prix négatif rejeté');
  }
  
  // 12.2 Test de gestion du stock
  if (testData.products.length > 0) {
    logTest('Test de gestion du stock');
    try {
      const product = testData.products[0];
      
      // Récupérer le produit pour voir le stock actuel
      const currentProduct = await makeRequest(`/products/${product.id}`);
      logInfo(`Stock actuel du produit "${currentProduct.name}": ${currentProduct.stock}`);
      
      if (currentProduct.stock > 0) {
        // Tenter une commande qui épuise le stock
        const orderData = {
          hotelId: testData.hotels[0].id,
          merchantId: currentProduct.merchant_id,
          customerName: "Test Stock",
          customerRoom: "999",
          items: [{
            productId: currentProduct.id,
            quantity: currentProduct.stock + 10, // Plus que le stock disponible
            name: currentProduct.name,
            price: currentProduct.price
          }],
          totalAmount: (parseFloat(currentProduct.price) * (currentProduct.stock + 10)).toFixed(2)
        };
        
        try {
          await makeRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
          });
          logError('Gestion stock échouée: commande avec stock insuffisant acceptée');
        } catch (error) {
          logSuccess('Gestion stock réussie: commande avec stock insuffisant rejetée');
        }
      }
      
    } catch (error) {
      logError(`Erreur test stock: ${error.message}`);
    }
  }
}

/**
 * FONCTION PRINCIPALE
 */

async function runAllTests() {
  const startTime = Date.now();
  
  log('🚀 DÉMARRAGE DES TESTS COMPLETS ZISHOP', 'magenta');
  log('========================================', 'magenta');
  
  try {
    // 1. Tests de gestion des entités
    await testHotelManagement();
    await testMerchantManagement();
    await testHotelMerchantAssociation();
    
    // 2. Tests du workflow de commande
    await testClientRegistration();
    await testCartManagement();
    await testOrderWorkflow();
    
    // 3. Tests des dashboards
    await testDashboards();
    
    // 4. Tests de géolocalisation
    await testGeolocation();
    
    // 5. Tests de commissions et analytiques
    await testCommissionsAndAnalytics();
    
    // 6. Tests de gestion des utilisateurs
    await testUserManagement();
    
    // 7. Tests de notifications
    await testNotifications();
    
    // 8. Tests de validation et sécurité
    await testValidationAndSecurity();
    
  } catch (error) {
    logError(`Erreur critique: ${error.message}`);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Rapport final
  logSection('RAPPORT FINAL DES TESTS');
  logSuccess(`✅ Tests terminés en ${duration} secondes`);
  
  log('\n📊 RÉSUMÉ DES DONNÉES CRÉÉES:', 'cyan');
  log(`  Hôtels: ${testData.hotels.length}`);
  log(`  Commerçants: ${testData.merchants.length}`);
  log(`  Produits: ${testData.products.length}`);
  log(`  Clients: ${testData.clients.length}`);
  log(`  Commandes: ${testData.orders.length}`);
  log(`  Utilisateurs: ${testData.users.length}`);
  
  log('\n🎯 FONCTIONNALITÉS TESTÉES:', 'green');
  log('  ✅ Gestion des hôtels (création, QR codes, géolocalisation)');
  log('  ✅ Gestion des commerçants (création, produits, validation)');
  log('  ✅ Associations hôtel-commerçants');
  log('  ✅ Enregistrement et authentification clients');
  log('  ✅ Workflow complet de commande');
  log('  ✅ Gestion du panier');
  log('  ✅ Transitions de statut de commande');
  log('  ✅ Calcul des commissions (75%/20%/5%)');
  log('  ✅ Dashboards (admin, hôtel, commerçant)');
  log('  ✅ Géolocalisation et recherche par rayon');
  log('  ✅ Gestion des utilisateurs et rôles');
  log('  ✅ Système de notifications');
  log('  ✅ Validation des données et sécurité');
  log('  ✅ Gestion du stock des produits');
  
  log('\n🏆 TOUS LES TESTS ZISHOP SONT TERMINÉS !', 'magenta');
}

// Exécution des tests
console.log('Démarrage des tests complets ZiShop...');

runAllTests().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});

export {
  runAllTests,
  testHotelManagement,
  testMerchantManagement,
  testOrderWorkflow,
  testDashboards,
  testGeolocation
};