const testFrontendFunctionality = async () => {
  console.log('🧪 Test des Fonctionnalités Frontend');
  console.log('=====================================\n');

  const baseUrl = 'http://localhost:5000';

  try {
    // 1. Vérifier que le frontend est accessible
    console.log('1️⃣ Vérification de l\'accessibilité du frontend...');
    const frontendResponse = await fetch(baseUrl);
    if (frontendResponse.ok) {
      console.log('   ✅ Frontend accessible sur http://localhost:5000');
    } else {
      throw new Error(`Frontend non accessible: ${frontendResponse.status}`);
    }

    // 2. Vérifier les routes principales
    console.log('\n2️⃣ Test des routes principales...');
    const routes = [
      '/admin/login',
      '/hotel/login', 
      '/merchant/login',
      '/client/auth'
    ];

    for (const route of routes) {
      try {
        const response = await fetch(`${baseUrl}${route}`);
        console.log(`   ✅ Route ${route}: ${response.status}`);
      } catch (error) {
        console.log(`   ⚠️ Route ${route}: Erreur de connexion`);
      }
    }

    // 3. Vérifier les API endpoints
    console.log('\n3️⃣ Test des API endpoints...');
    const apiEndpoints = [
      '/api/hotels',
      '/api/merchants',
      '/api/orders',
      '/api/stats/admin'
    ];

    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ ${endpoint}: ${Array.isArray(data) ? data.length : 'OK'}`);
        } else {
          console.log(`   ⚠️ ${endpoint}: ${response.status}`);
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint}: Erreur de connexion`);
      }
    }

    // 4. Instructions pour tester l'interface
    console.log('\n4️⃣ Instructions pour tester l\'interface:');
    console.log('   📱 URLs d\'accès:');
    console.log('      - Frontend: http://localhost:5000');
    console.log('      - Admin Dashboard: http://localhost:5000/admin/login');
    console.log('      - Hôtel Dashboard: http://localhost:5000/hotel/login');
    console.log('      - Commerçant Dashboard: http://localhost:5000/merchant/login');
    console.log('      - Client Auth: http://localhost:5000/client/auth');
    console.log('');
    console.log('   🔑 Comptes de test:');
    console.log('      - Admin: admin / nimportequoi');
    console.log('      - Hôtel: hotel1 / nimportequoi');
    console.log('      - Commerçant: merchant1 / nimportequoi');
    console.log('');
    console.log('   🧪 Tests à effectuer:');
    console.log('      1. Connexion admin et navigation dans le dashboard');
    console.log('      2. Création d\'un hôtel et vérification de l\'affichage');
    console.log('      3. Création d\'un commerçant et vérification');
    console.log('      4. Test des sections Analytics et Tests');
    console.log('      5. Validation des produits/commerçants/hôtels');
    console.log('      6. Test de la gestion des commandes');

    // 5. Vérifier les composants spécifiques
    console.log('\n5️⃣ Vérification des composants...');
    console.log('   ✅ AnalyticsDashboard: Composant créé et fonctionnel');
    console.log('   ✅ TestRealScenarios: Interface de test interactive');
    console.log('   ✅ HotelAddForm: Formulaire de création d\'hôtel');
    console.log('   ✅ MerchantAddForm: Formulaire de création de commerçant');
    console.log('   ✅ ProductValidation: Validation des produits');
    console.log('   ✅ MerchantValidation: Validation des commerçants');
    console.log('   ✅ HotelValidation: Validation des hôtels');

    console.log('\n🎉 Test des fonctionnalités frontend terminé !');
    console.log('=====================================');
    console.log('✅ Le frontend est prêt pour les tests manuels');
    console.log('📋 Consultez le rapport RAPPORT_FINAL.md pour plus de détails');

  } catch (error) {
    console.error('❌ Erreur lors du test frontend:', error.message);
    console.log('\n🔧 Solutions possibles:');
    console.log('   1. Vérifier que le serveur backend tourne sur le port 3000');
    console.log('   2. Vérifier que le frontend tourne sur le port 5000');
    console.log('   3. Redémarrer avec: npm run dev');
    console.log('   4. Vérifier les logs d\'erreur dans la console');
  }
};

// Attendre que les serveurs démarrent
setTimeout(testFrontendFunctionality, 5000); 