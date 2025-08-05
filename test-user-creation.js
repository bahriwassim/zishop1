import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

console.log('👤 TEST DE CRÉATION D\'UTILISATEUR');
console.log('==================================');

async function testUserCreation() {
  console.log('\n🔧 Test de création d\'utilisateur hôtel');
  console.log('----------------------------------------');
  
  const userData = {
    username: "bahriwass@gmail.com",
    password: "password123",
    role: "hotel",
    entityId: 1  // ID de l'hôtel existant
  };
  
  try {
    console.log('📤 Envoi des données:', userData);
    
    const response = await axios.post(`${BASE_URL}/api/users`, userData);
    
    console.log('✅ Utilisateur créé avec succès!');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la création:');
    console.log('📋 Status:', error.response?.status);
    console.log('📋 Données:', JSON.stringify(error.response?.data, null, 2));
    
    return false;
  }
}

async function testHotelCreation() {
  console.log('\n🏨 Test de création d\'hôtel');
  console.log('----------------------------');
  
  const hotelData = {
    name: "Hôtel Test Bahri",
    address: "123 Rue de Test, 75001 Paris",
    latitude: "48.8566",
    longitude: "2.3522",
    is_active: true
  };
  
  try {
    console.log('📤 Envoi des données:', hotelData);
    
    const response = await axios.post(`${BASE_URL}/api/hotels`, hotelData);
    
    console.log('✅ Hôtel créé avec succès!');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return response.data.id;
  } catch (error) {
    console.log('❌ Erreur lors de la création de l\'hôtel:');
    console.log('📋 Status:', error.response?.status);
    console.log('📋 Données:', JSON.stringify(error.response?.data, null, 2));
    
    return null;
  }
}

async function runTests() {
  console.log('🚀 Lancement des tests...\n');
  
  // Test 1: Créer un hôtel
  const hotelId = await testHotelCreation();
  
  if (hotelId) {
    console.log(`\n🏨 Hôtel créé avec l'ID: ${hotelId}`);
    
    // Test 2: Créer un utilisateur pour cet hôtel
    const userData = {
      username: "bahriwass@gmail.com",
      password: "password123",
      role: "hotel",
      entityId: hotelId
    };
    
    console.log('\n👤 Test de création d\'utilisateur avec le nouvel hôtel');
    console.log('-----------------------------------------------------');
    
    try {
      const response = await axios.post(`${BASE_URL}/api/users`, userData);
      console.log('✅ Utilisateur créé avec succès!');
      console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ Erreur lors de la création de l\'utilisateur:');
      console.log('📋 Status:', error.response?.status);
      console.log('📋 Données:', JSON.stringify(error.response?.data, null, 2));
    }
  } else {
    // Test avec l'hôtel existant
    await testUserCreation();
  }
  
  console.log('\n📊 Tests terminés!');
}

runTests().catch(console.error); 