const testCompleteApplication = async () => {
  console.log('🏨 Test Complet de l\'Application ZiShop');
  console.log('=====================================\n');

  const baseUrl = 'http://localhost:3000/api';
  const results = {};

  // Test 1: Vérifier que le serveur est accessible
  try {
    console.log('1️⃣ Test de connexion au serveur...');
    const response = await fetch(`${baseUrl}/hotels`);
    if (!response.ok) {
      throw new Error(`Serveur non accessible: ${response.status}`);
    }
    console.log('✅ Serveur accessible\n');
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    return;
  }

  // Test 2: Créer des hôtels
  try {
    console.log('2️⃣ Test de création d\'hôtels...');
    const hotels = [
      {
        name: "Hôtel Ritz Paris",
        address: "15 Place Vendôme, 75001 Paris",
        latitude: 48.8676,
        longitude: 2.3294,
        qr_code: "https://zishop.co/hotel/ZIRITZ001",
        is_active: true
      },
      {
        name: "Le Bristol Paris",
        address: "112 Rue du Faubourg Saint-Honoré, 75008 Paris",
        latitude: 48.8719,
        longitude: 2.3186,
        qr_code: "https://zishop.co/hotel/ZIBRIS002",
        is_active: true
      }
    ];

    for (const hotel of hotels) {
      const response = await fetch(`${baseUrl}/hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotel)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Hôtel créé: ${hotel.name} (ID: ${result.id})`);
      } else {
        console.log(`⚠️ Hôtel déjà existant: ${hotel.name}`);
      }
    }
    console.log('');
  } catch (error) {
    console.error('❌ Erreur création hôtels:', error.message);
  }

  // Test 3: Créer des commerçants
  try {
    console.log('3️⃣ Test de création de commerçants...');
    const merchants = [
      {
        name: "Souvenirs de Paris",
        address: "45 Rue de Rivoli, 75001 Paris",
        category: "Souvenirs",
        latitude: 48.8584,
        longitude: 2.2945,
        rating: "4.8",
        reviewCount: 127,
        isOpen: true,
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0"
      },
      {
        name: "Art & Craft Paris",
        address: "78 Boulevard Saint-Germain, 75005 Paris",
        category: "Artisanat",
        latitude: 48.8530,
        longitude: 2.3499,
        rating: "4.2",
        reviewCount: 89,
        isOpen: true,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
      }
    ];

    for (const merchant of merchants) {
      const response = await fetch(`${baseUrl}/merchants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merchant)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Commerçant créé: ${merchant.name} (ID: ${result.id})`);
      } else {
        console.log(`⚠️ Commerçant déjà existant: ${merchant.name}`);
      }
    }
    console.log('');
  } catch (error) {
    console.error('❌ Erreur création commerçants:', error.message);
  }

  // Test 4: Créer des produits
  try {
    console.log('4️⃣ Test de création de produits...');
    const products = [
      {
        merchantId: 1,
        name: "Tour Eiffel Miniature",
        description: "Réplique authentique de la Tour Eiffel en métal",
        price: "12.50",
        category: "Monuments",
        imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
        isSouvenir: true,
        origin: "France",
        material: "Métal",
        stock: 10
      },
      {
        merchantId: 1,
        name: "Magnet Paris",
        description: "Magnet collector avec vues de Paris",
        price: "4.90",
        category: "Magnets",
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
        isSouvenir: true,
        origin: "France",
        material: "Céramique",
        stock: 5
      }
    ];

    for (const product of products) {
      const response = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Produit créé: ${product.name} (ID: ${result.id})`);
      } else {
        console.log(`⚠️ Produit déjà existant: ${product.name}`);
      }
    }
    console.log('');
  } catch (error) {
    console.error('❌ Erreur création produits:', error.message);
  }

  // Test 5: Créer des commandes
  try {
    console.log('5️⃣ Test de création de commandes...');
    const orders = [
      {
        hotelId: 1,
        merchantId: 1,
        clientId: 1,
        customerName: "Jean Dupont",
        customerRoom: "205",
        items: [
          { productId: 1, productName: "Tour Eiffel Miniature", quantity: 2, price: "12.50" },
          { productId: 2, productName: "Magnet Paris", quantity: 1, price: "4.90" }
        ],
        totalAmount: "29.90",
        status: "pending"
      },
      {
        hotelId: 2,
        merchantId: 2,
        clientId: 2,
        customerName: "Marie Martin",
        customerRoom: "312",
        items: [
          { productId: 3, productName: "Artisanat Local", quantity: 1, price: "24.90" }
        ],
        totalAmount: "24.90",
        status: "confirmed"
      }
    ];

    for (const order of orders) {
      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Commande créée: #${result.orderNumber} (ID: ${result.id})`);
      } else {
        console.log(`⚠️ Erreur création commande: ${order.customerName}`);
      }
    }
    console.log('');
  } catch (error) {
    console.error('❌ Erreur création commandes:', error.message);
  }

  // Test 6: Vérifier les données créées
  try {
    console.log('6️⃣ Vérification des données créées...');
    
    const [hotelsResponse, merchantsResponse, productsResponse, ordersResponse] = await Promise.all([
      fetch(`${baseUrl}/hotels`),
      fetch(`${baseUrl}/merchants`),
      fetch(`${baseUrl}/products`),
      fetch(`${baseUrl}/orders`)
    ]);

    const hotels = await hotelsResponse.json();
    const merchants = await merchantsResponse.json();
    const products = await productsResponse.json();
    const orders = await ordersResponse.json();

    console.log(`📊 Statistiques:`);
    console.log(`   - Hôtels: ${hotels.length}`);
    console.log(`   - Commerçants: ${merchants.length}`);
    console.log(`   - Produits: ${products.length}`);
    console.log(`   - Commandes: ${orders.length}`);
    console.log('');
  } catch (error) {
    console.error('❌ Erreur vérification données:', error.message);
  }

  // Test 7: Tester les notifications
  try {
    console.log('7️⃣ Test du système de notifications...');
    const response = await fetch(`${baseUrl}/notifications/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Test notification ZiShop' })
    });
    
    if (response.ok) {
      console.log('✅ Système de notifications fonctionnel');
    } else {
      console.log('⚠️ Système de notifications non disponible');
    }
    console.log('');
  } catch (error) {
    console.log('⚠️ Système de notifications non disponible');
  }

  // Résumé final
  console.log('🎉 Test complet terminé !');
  console.log('=====================================');
  console.log('📱 URLs d\'accès:');
  console.log('   - Frontend: http://localhost:5000');
  console.log('   - Admin Dashboard: http://localhost:5000/admin/login');
  console.log('   - Hôtel Dashboard: http://localhost:5000/hotel/login');
  console.log('   - Commerçant Dashboard: http://localhost:5000/merchant/login');
  console.log('');
  console.log('🔑 Comptes de test:');
  console.log('   - Admin: admin / nimportequoi');
  console.log('   - Hôtel: hotel1 / nimportequoi');
  console.log('   - Commerçant: merchant1 / nimportequoi');
  console.log('');
  console.log('✅ L\'application est prête pour les tests manuels !');
};

// Attendre 3 secondes pour laisser le serveur démarrer
setTimeout(testCompleteApplication, 3000); 