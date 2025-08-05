import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

console.log('🔧 CORRECTION DES UTILISATEURS EXISTANTS');
console.log('========================================');

async function fixExistingUsers() {
  console.log('\n📋 Récupération des utilisateurs existants...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/users`);
    const users = response.data;
    
    console.log(`📊 ${users.length} utilisateurs trouvés`);
    
    // Corriger chaque utilisateur
    for (const user of users) {
      console.log(`\n🔧 Correction de l'utilisateur: ${user.username} (ID: ${user.id})`);
      
      // Déterminer les données de correction selon le rôle
      let updateData = {
        username: user.username,
        role: user.role
      };
      
      // Assigner des entités selon le rôle
      if (user.role === "admin") {
        // Admin n'a pas besoin d'entité
        updateData.entityId = null;
      } else if (user.role === "hotel") {
        // Assigner le premier hôtel disponible
        try {
          const hotelsResponse = await axios.get(`${BASE_URL}/api/hotels`);
          if (hotelsResponse.data.length > 0) {
            updateData.entityId = hotelsResponse.data[0].id;
            console.log(`   ✅ Assigné à l'hôtel: ${hotelsResponse.data[0].name}`);
          } else {
            console.log(`   ⚠️ Aucun hôtel disponible`);
          }
        } catch (error) {
          console.log(`   ❌ Erreur lors de la récupération des hôtels`);
        }
      } else if (user.role === "merchant") {
        // Assigner le premier commerçant disponible
        try {
          const merchantsResponse = await axios.get(`${BASE_URL}/api/merchants`);
          if (merchantsResponse.data.length > 0) {
            updateData.entityId = merchantsResponse.data[0].id;
            console.log(`   ✅ Assigné au commerçant: ${merchantsResponse.data[0].name}`);
          } else {
            console.log(`   ⚠️ Aucun commerçant disponible`);
          }
        } catch (error) {
          console.log(`   ❌ Erreur lors de la récupération des commerçants`);
        }
      }
      
      // Mettre à jour l'utilisateur
      try {
        const updateResponse = await axios.put(`${BASE_URL}/api/users/${user.id}`, updateData);
        console.log(`   ✅ Utilisateur corrigé avec succès`);
      } catch (error) {
        console.log(`   ❌ Erreur lors de la correction:`, error.response?.data?.message || error.message);
      }
    }
    
    console.log('\n🔄 Vérification finale...');
    const finalResponse = await axios.get(`${BASE_URL}/api/users`);
    const finalUsers = finalResponse.data;
    
    console.log(`📊 ${finalUsers.length} utilisateurs après correction`);
    
    // Afficher les détails finaux
    finalUsers.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Entity ID: ${user.entity_id || 'null'}`);
      console.log(`   Entity Name: ${user.entityName || 'N/A'}`);
      console.log(`   Entity Description: ${user.entityDescription || 'N/A'}`);
      console.log(`   Created: ${user.created_at || 'N/A'}`);
      console.log(`   Updated: ${user.updated_at || 'N/A'}`);
    });
    
  } catch (error) {
    console.log('❌ Erreur lors de la correction:', error.response?.data || error.message);
  }
}

fixExistingUsers().catch(console.error); 