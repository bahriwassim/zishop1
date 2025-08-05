import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

console.log('🔍 DÉBOGAGE AUTHENTIFICATION');
console.log('=============================');

async function debugAuth() {
  try {
    console.log('\n📋 1. Récupération de tous les utilisateurs');
    console.log('--------------------------------------------');
    
    const usersResponse = await axios.get(`${BASE_URL}/api/users`);
    console.log(`📊 ${usersResponse.data.length} utilisateurs trouvés:`);
    
    usersResponse.data.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Username: "${user.username}"`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Entity ID: ${user.entity_id || 'null'}`);
      console.log(`   Entity Name: ${user.entityName || 'N/A'}`);
    });
    
    console.log('\n📋 2. Recherche spécifique de bahriwass@gmail.com');
    console.log('---------------------------------------------------');
    
    const targetUser = usersResponse.data.find(user => user.username === 'bahriwass@gmail.com');
    
    if (targetUser) {
      console.log('✅ Utilisateur trouvé dans la base:');
      console.log(`   ID: ${targetUser.id}`);
      console.log(`   Username: "${targetUser.username}"`);
      console.log(`   Role: ${targetUser.role}`);
      console.log(`   Entity ID: ${targetUser.entity_id || 'null'}`);
    } else {
      console.log('❌ Utilisateur bahriwass@gmail.com NON TROUVÉ dans la base');
      
      // Vérifier les usernames similaires
      const similarUsers = usersResponse.data.filter(user => 
        user.username.includes('bahri') || 
        user.username.includes('gmail') ||
        user.username.includes('@')
      );
      
      if (similarUsers.length > 0) {
        console.log('\n🔍 Utilisateurs similaires trouvés:');
        similarUsers.forEach(user => {
          console.log(`   - "${user.username}" (ID: ${user.id})`);
        });
      }
    }
    
    console.log('\n📋 3. Test de connexion directe');
    console.log('--------------------------------');
    
    const loginData = {
      username: "bahriwass@gmail.com",
      password: "password123"
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    console.log('📋 Réponse de connexion:', JSON.stringify(loginResponse.data, null, 2));
    
    console.log('\n📋 4. Comparaison des données');
    console.log('------------------------------');
    
    if (targetUser && loginResponse.data.user) {
      console.log('📊 Comparaison:');
      console.log(`   Base de données: ID=${targetUser.id}, Role=${targetUser.role}`);
      console.log(`   Authentification: ID=${loginResponse.data.user.id}, Role=${loginResponse.data.user.role}`);
      
      if (targetUser.id === loginResponse.data.user.id && targetUser.role === loginResponse.data.user.role) {
        console.log('✅ Données cohérentes');
      } else {
        console.log('❌ Données incohérentes - Problème d\'authentification');
      }
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.response?.data || error.message);
  }
}

debugAuth(); 