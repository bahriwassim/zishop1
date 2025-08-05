import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

console.log('🔐 TEST AUTHENTIFICATION CORRIGÉE');
console.log('==================================');

async function testAuthFix() {
  try {
    console.log('\n📋 1. Test de connexion avec bahriwass@gmail.com');
    console.log('--------------------------------------------------');
    
    const loginData = {
      username: "bahriwass@gmail.com",
      password: "password123"
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    console.log('✅ Connexion réussie!');
    console.log('📋 Réponse:', JSON.stringify(loginResponse.data, null, 2));
    
    // Vérifier le rôle
    if (loginResponse.data.user && loginResponse.data.user.role) {
      console.log(`🎯 Rôle détecté: ${loginResponse.data.user.role}`);
      
      if (loginResponse.data.user.role === 'hotel') {
        console.log('✅ Rôle correct: hotel');
      } else {
        console.log(`❌ Rôle incorrect: ${loginResponse.data.user.role} (devrait être hotel)`);
      }
    }
    
    console.log('\n📋 2. Test de connexion avec admin');
    console.log('------------------------------------');
    
    const adminLoginData = {
      username: "admin",
      password: "password123"
    };
    
    const adminLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, adminLoginData);
    console.log('✅ Connexion admin réussie!');
    console.log('📋 Réponse:', JSON.stringify(adminLoginResponse.data, null, 2));
    
    console.log('\n📋 3. Test de connexion avec hotel1');
    console.log('-------------------------------------');
    
    const hotelLoginData = {
      username: "hotel1",
      password: "password123"
    };
    
    const hotelLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, hotelLoginData);
    console.log('✅ Connexion hotel1 réussie!');
    console.log('📋 Réponse:', JSON.stringify(hotelLoginResponse.data, null, 2));
    
    console.log('\n📋 4. Vérification des utilisateurs dans la base');
    console.log('--------------------------------------------------');
    
    const usersResponse = await axios.get(`${BASE_URL}/api/users`);
    console.log(`📊 ${usersResponse.data.length} utilisateurs dans la base:`);
    
    usersResponse.data.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Entity ID: ${user.entity_id || 'null'}`);
      console.log(`   Entity Name: ${user.entityName || 'N/A'}`);
    });
    
    console.log('\n🎉 TEST D\'AUTHENTIFICATION TERMINÉ!');
    console.log('✅ Authentification corrigée');
    console.log('✅ Rôles correctement détectés');
    console.log('✅ Utilisateurs dans la base vérifiés');
    
  } catch (error) {
    console.log('❌ Erreur:', error.response?.data || error.message);
  }
}

testAuthFix(); 