import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

console.log('👤 TEST COMPLET DE GESTION DES UTILISATEURS');
console.log('===========================================');

async function testGetUsers() {
  console.log('\n📋 Test de récupération des utilisateurs');
  console.log('----------------------------------------');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/users`);
    console.log('✅ Utilisateurs récupérés avec succès!');
    console.log(`📊 Nombre d'utilisateurs: ${response.data.length}`);
    
    // Afficher les détails de chaque utilisateur
    response.data.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Entity ID: ${user.entity_id}`);
      console.log(`   Entity Name: ${user.entityName || 'N/A'}`);
      console.log(`   Entity Description: ${user.entityDescription || 'N/A'}`);
      console.log(`   Created: ${user.created_at}`);
      console.log(`   Updated: ${user.updated_at}`);
    });
    
    return response.data;
  } catch (error) {
    console.log('❌ Erreur lors de la récupération:');
    console.log('📋 Status:', error.response?.status);
    console.log('📋 Données:', JSON.stringify(error.response?.data, null, 2));
    return null;
  }
}

async function testUpdateUser(userId, updateData) {
  console.log(`\n✏️ Test de modification d'utilisateur ${userId}`);
  console.log('----------------------------------------');
  
  try {
    console.log('📤 Données de modification:', updateData);
    
    const response = await axios.put(`${BASE_URL}/api/users/${userId}`, updateData);
    
    console.log('✅ Utilisateur modifié avec succès!');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.log('❌ Erreur lors de la modification:');
    console.log('📋 Status:', error.response?.status);
    console.log('📋 Données:', JSON.stringify(error.response?.data, null, 2));
    return null;
  }
}

async function testDeleteUser(userId) {
  console.log(`\n🗑️ Test de suppression d'utilisateur ${userId}`);
  console.log('----------------------------------------');
  
  try {
    const response = await axios.delete(`${BASE_URL}/api/users/${userId}`);
    
    console.log('✅ Utilisateur supprimé avec succès!');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la suppression:');
    console.log('📋 Status:', error.response?.status);
    console.log('📋 Données:', JSON.stringify(error.response?.data, null, 2));
    return false;
  }
}

async function testCreateHotel() {
  console.log('\n🏨 Test de création d\'hôtel pour les tests');
  console.log('-------------------------------------------');
  
  const hotelData = {
    name: "Hôtel Test Modifications",
    address: "456 Rue de Test, 75002 Paris",
    latitude: "48.8606",
    longitude: "2.3376",
    is_active: true
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/api/hotels`, hotelData);
    console.log('✅ Hôtel créé avec succès!');
    console.log('📋 ID:', response.data.id);
    return response.data.id;
  } catch (error) {
    console.log('❌ Erreur lors de la création de l\'hôtel:');
    console.log('📋 Status:', error.response?.status);
    return null;
  }
}

async function runCompleteTests() {
  console.log('🚀 Lancement des tests complets...\n');
  
  // Test 1: Récupérer tous les utilisateurs
  const users = await testGetUsers();
  
  if (users && users.length > 0) {
    // Prendre le premier utilisateur pour les tests
    const testUser = users[0];
    console.log(`\n🎯 Utilisateur sélectionné pour les tests: ${testUser.username} (ID: ${testUser.id})`);
    
    // Test 2: Créer un hôtel pour les tests de modification
    const hotelId = await testCreateHotel();
    
    if (hotelId) {
      // Test 3: Modifier l'utilisateur
      const updateData = {
        username: testUser.username,
        role: "hotel",
        entityId: hotelId,
        password: "nouveauMotDePasse123"
      };
      
      await testUpdateUser(testUser.id, updateData);
      
      // Test 4: Vérifier les modifications
      console.log('\n🔄 Vérification après modification...');
      await testGetUsers();
      
      // Test 5: Supprimer l'utilisateur (optionnel)
      console.log('\n⚠️ Test de suppression (optionnel)...');
      const shouldDelete = false; // Mettre à true pour tester la suppression
      
      if (shouldDelete) {
        await testDeleteUser(testUser.id);
        
        // Vérifier que l'utilisateur a été supprimé
        console.log('\n🔄 Vérification après suppression...');
        await testGetUsers();
      } else {
        console.log('⏭️ Suppression ignorée pour préserver les données');
      }
    }
  }
  
  console.log('\n📊 Tests terminés!');
}

runCompleteTests().catch(console.error); 