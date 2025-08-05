import axios from 'axios';

const API_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3001';

console.log('🔍 TEST COMPLET - INTERFACE ET API');
console.log('==================================');

async function testAPIEndpoints() {
  console.log('\n📋 1. Test des endpoints API');
  console.log('----------------------------');
  
  try {
    // Test GET /api/users
    console.log('🔍 Test GET /api/users...');
    const usersResponse = await axios.get(`${API_URL}/api/users`);
    console.log(`✅ ${usersResponse.data.length} utilisateurs récupérés`);
    
    // Test POST /api/users
    console.log('🔍 Test POST /api/users...');
    const newUserData = {
      username: "test-interface@example.com",
      password: "password123",
      role: "hotel",
      entityId: 28
    };
    
    const createResponse = await axios.post(`${API_URL}/api/users`, newUserData);
    console.log('✅ Utilisateur créé:', createResponse.data.username);
    
    // Test PUT /api/users
    console.log('🔍 Test PUT /api/users...');
    const updateData = {
      username: "test-interface@example.com",
      role: "hotel",
      entityId: 28
    };
    
    const updateResponse = await axios.put(`${API_URL}/api/users/${createResponse.data.id}`, updateData);
    console.log('✅ Utilisateur modifié');
    
    // Test DELETE /api/users
    console.log('🔍 Test DELETE /api/users...');
    await axios.delete(`${API_URL}/api/users/${createResponse.data.id}`);
    console.log('✅ Utilisateur supprimé');
    
    return true;
  } catch (error) {
    console.log('❌ Erreur API:', error.response?.data || error.message);
    return false;
  }
}

async function testFrontendAccess() {
  console.log('\n🌐 2. Test d\'accès au frontend');
  console.log('-------------------------------');
  
  try {
    // Test d'accès au frontend
    console.log('🔍 Test d\'accès au frontend...');
    const frontendResponse = await axios.get(`${FRONTEND_URL}`, { timeout: 5000 });
    console.log('✅ Frontend accessible');
    console.log('📋 Status:', frontendResponse.status);
    return true;
  } catch (error) {
    console.log('❌ Frontend non accessible:', error.message);
    console.log('💡 Le frontend doit être démarré sur le port 3001');
    return false;
  }
}

async function testUserInterface() {
  console.log('\n👤 3. Test de l\'interface utilisateur');
  console.log('--------------------------------------');
  
  try {
    // Simuler les actions de l'interface utilisateur
    console.log('🔍 Test de récupération des utilisateurs pour l\'interface...');
    const usersResponse = await axios.get(`${API_URL}/api/users`);
    
    console.log('📊 Données pour l\'interface:');
    usersResponse.data.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Entity Name: ${user.entityName || 'N/A'}`);
      console.log(`   Entity Description: ${user.entityDescription || 'N/A'}`);
      console.log(`   Created: ${user.created_at || 'N/A'}`);
      console.log(`   Updated: ${user.updated_at || 'N/A'}`);
    });
    
    // Vérifier les problèmes potentiels
    const problems = [];
    
    usersResponse.data.forEach(user => {
      if (!user.created_at || user.created_at === 'N/A') {
        problems.push(`- Utilisateur ${user.username}: Date de création manquante`);
      }
      if (!user.entityName || user.entityName === 'N/A') {
        problems.push(`- Utilisateur ${user.username}: Nom d'entité manquant`);
      }
      if (user.entityDescription === 'Non assigné') {
        problems.push(`- Utilisateur ${user.username}: Entité non assignée`);
      }
    });
    
    if (problems.length > 0) {
      console.log('\n⚠️ Problèmes détectés:');
      problems.forEach(problem => console.log(problem));
    } else {
      console.log('\n✅ Aucun problème détecté dans les données');
    }
    
    return problems.length === 0;
  } catch (error) {
    console.log('❌ Erreur interface:', error.response?.data || error.message);
    return false;
  }
}

async function diagnoseProblems() {
  console.log('\n🔧 4. Diagnostic des problèmes');
  console.log('-------------------------------');
  
  try {
    // Vérifier la configuration
    console.log('🔍 Vérification de la configuration...');
    
    // Test de l'API directement
    const apiTest = await axios.get(`${API_URL}/api/users`);
    console.log('✅ API fonctionnelle');
    
    // Vérifier les données
    const users = apiTest.data;
    console.log(`📊 ${users.length} utilisateurs dans la base`);
    
    // Analyser les problèmes
    let invalidDates = 0;
    let unassignedEntities = 0;
    let missingEntityNames = 0;
    
    users.forEach(user => {
      if (!user.created_at || user.created_at === 'N/A') invalidDates++;
      if (user.entityDescription === 'Non assigné') unassignedEntities++;
      if (!user.entityName || user.entityName === 'N/A') missingEntityNames++;
    });
    
    console.log('\n📈 Statistiques:');
    console.log(`   Dates invalides: ${invalidDates}/${users.length}`);
    console.log(`   Entités non assignées: ${unassignedEntities}/${users.length}`);
    console.log(`   Noms d'entité manquants: ${missingEntityNames}/${users.length}`);
    
    if (invalidDates > 0 || unassignedEntities > 0 || missingEntityNames > 0) {
      console.log('\n🔧 Solutions recommandées:');
      if (invalidDates > 0) {
        console.log('   - Exécuter le script de correction des dates');
      }
      if (unassignedEntities > 0) {
        console.log('   - Assigner des entités aux utilisateurs');
      }
      if (missingEntityNames > 0) {
        console.log('   - Vérifier la logique d\'enrichissement des entités');
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur diagnostic:', error.message);
    return false;
  }
}

async function runCompleteTests() {
  console.log('🚀 Lancement des tests complets...\n');
  
  const results = {
    api: await testAPIEndpoints(),
    frontend: await testFrontendAccess(),
    interface: await testUserInterface(),
    diagnosis: await diagnoseProblems()
  };
  
  console.log('\n📊 RÉSULTATS FINAUX');
  console.log('==================');
  console.log(`✅ API: ${results.api ? 'FONCTIONNELLE' : 'PROBLÈME'}`);
  console.log(`✅ Frontend: ${results.frontend ? 'ACCESSIBLE' : 'NON ACCESSIBLE'}`);
  console.log(`✅ Interface: ${results.interface ? 'OK' : 'PROBLÈME'}`);
  console.log(`✅ Diagnostic: ${results.diagnosis ? 'TERMINÉ' : 'ÉCHEC'}`);
  
  if (!results.frontend) {
    console.log('\n💡 SOLUTION: Démarrer le frontend avec:');
    console.log('   npm run dev');
  }
  
  if (!results.api) {
    console.log('\n💡 SOLUTION: Vérifier que le serveur backend fonctionne sur le port 5000');
  }
  
  console.log('\n🎯 ÉTAT GLOBAL:', 
    results.api && results.interface ? '✅ FONCTIONNEL' : '❌ PROBLÈME DÉTECTÉ'
  );
}

runCompleteTests().catch(console.error); 