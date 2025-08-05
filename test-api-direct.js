import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

console.log('🔧 TEST DIRECT DE L\'API');
console.log('========================');

async function testDirectAPI() {
  console.log('\n📋 Test direct de récupération des utilisateurs');
  console.log('------------------------------------------------');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/users`);
    console.log('✅ Réponse reçue!');
    console.log('📋 Status:', response.status);
    console.log('📋 Content-Type:', response.headers['content-type']);
    console.log('📋 Nombre d\'utilisateurs:', response.data.length);
    
    // Afficher le premier utilisateur en détail
    if (response.data.length > 0) {
      const user = response.data[0];
      console.log('\n👤 Premier utilisateur:');
      console.log('   ID:', user.id);
      console.log('   Username:', user.username);
      console.log('   Role:', user.role);
      console.log('   Entity ID:', user.entity_id);
      console.log('   Entity Name:', user.entityName);
      console.log('   Entity Description:', user.entityDescription);
      console.log('   Created:', user.created_at);
      console.log('   Updated:', user.updated_at);
    }
    
    return response.data;
  } catch (error) {
    console.log('❌ Erreur lors de la récupération:');
    console.log('📋 Status:', error.response?.status);
    console.log('📋 Content-Type:', error.response?.headers['content-type']);
    console.log('📋 Données:', error.response?.data);
    return null;
  }
}

async function testUpdateAPI() {
  console.log('\n✏️ Test direct de modification d\'utilisateur');
  console.log('----------------------------------------------');
  
  try {
    // D'abord récupérer un utilisateur
    const usersResponse = await axios.get(`${BASE_URL}/api/users`);
    if (usersResponse.data.length === 0) {
      console.log('❌ Aucun utilisateur trouvé pour le test');
      return;
    }
    
    const testUser = usersResponse.data[0];
    console.log(`🎯 Test avec l'utilisateur: ${testUser.username} (ID: ${testUser.id})`);
    
    // Données de test
    const updateData = {
      username: testUser.username,
      role: testUser.role,
      entityId: testUser.entity_id || null
    };
    
    console.log('📤 Données de modification:', updateData);
    
    const response = await axios.put(`${BASE_URL}/api/users/${testUser.id}`, updateData);
    console.log('✅ Réponse reçue!');
    console.log('📋 Status:', response.status);
    console.log('📋 Content-Type:', response.headers['content-type']);
    console.log('📋 Données:', response.data);
    
  } catch (error) {
    console.log('❌ Erreur lors de la modification:');
    console.log('📋 Status:', error.response?.status);
    console.log('📋 Content-Type:', error.response?.headers['content-type']);
    console.log('📋 Données:', error.response?.data);
  }
}

async function testServerHealth() {
  console.log('\n🏥 Test de santé du serveur');
  console.log('----------------------------');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/hotels`);
    console.log('✅ Serveur accessible!');
    console.log('📋 Status:', response.status);
    console.log('📋 Nombre d\'hôtels:', response.data.length);
  } catch (error) {
    console.log('❌ Serveur non accessible:');
    console.log('📋 Erreur:', error.message);
  }
}

async function runDirectTests() {
  console.log('🚀 Lancement des tests directs...\n');
  
  // Test 1: Santé du serveur
  await testServerHealth();
  
  // Test 2: Récupération des utilisateurs
  await testDirectAPI();
  
  // Test 3: Modification d'utilisateur
  await testUpdateAPI();
  
  console.log('\n📊 Tests directs terminés!');
}

runDirectTests().catch(console.error); 