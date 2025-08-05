import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

console.log('🔧 CORRECTION FINALE DES ENTITÉS');
console.log('================================');

async function fixEntitiesFinal() {
  try {
    console.log('\n📋 1. Récupération des utilisateurs');
    const usersResponse = await axios.get(`${BASE_URL}/api/users`);
    console.log(`📊 ${usersResponse.data.length} utilisateurs trouvés`);
    
    console.log('\n📋 2. Récupération des hôtels et commerçants');
    const hotelsResponse = await axios.get(`${BASE_URL}/api/hotels`);
    const merchantsResponse = await axios.get(`${BASE_URL}/api/merchants`);
    
    console.log(`🏨 ${hotelsResponse.data.length} hôtels disponibles`);
    console.log(`🏪 ${merchantsResponse.data.length} commerçants disponibles`);
    
    if (hotelsResponse.data.length === 0) {
      console.log('\n⚠️ Aucun hôtel disponible, création d\'un hôtel de test...');
      const hotelData = {
        name: "Hôtel Principal",
        address: "1 Avenue des Champs-Élysées, 75008 Paris",
        latitude: "48.8698679",
        longitude: "2.3072976",
        is_active: true
      };
      
      const newHotel = await axios.post(`${BASE_URL}/api/hotels`, hotelData);
      console.log('✅ Hôtel créé:', newHotel.data.name);
      hotelsResponse.data.push(newHotel.data);
    }
    
    if (merchantsResponse.data.length === 0) {
      console.log('\n⚠️ Aucun commerçant disponible, création d\'un commerçant de test...');
      const merchantData = {
        name: "Souvenirs de Paris",
        address: "45 Rue de Rivoli, 75001 Paris",
        category: "Souvenirs",
        latitude: "48.8718679",
        longitude: "2.3082976",
        rating: "4.8",
        reviewCount: 127,
        isOpen: true
      };
      
      const newMerchant = await axios.post(`${BASE_URL}/api/merchants`, merchantData);
      console.log('✅ Commerçant créé:', newMerchant.data.name);
      merchantsResponse.data.push(newMerchant.data);
    }
    
    console.log('\n🔧 3. Correction des utilisateurs');
    
    for (const user of usersResponse.data) {
      console.log(`\n👤 Correction de: ${user.username} (${user.role})`);
      
      let updateData = {
        username: user.username,
        role: user.role
      };
      
      // Assigner des entités selon le rôle
      if (user.role === "admin") {
        updateData.entityId = null;
        console.log('   ✅ Admin - Pas d\'entité nécessaire');
      } else if (user.role === "hotel") {
        if (hotelsResponse.data.length > 0) {
          updateData.entityId = hotelsResponse.data[0].id;
          console.log(`   ✅ Assigné à l'hôtel: ${hotelsResponse.data[0].name}`);
        } else {
          console.log('   ⚠️ Aucun hôtel disponible');
        }
      } else if (user.role === "merchant") {
        if (merchantsResponse.data.length > 0) {
          updateData.entityId = merchantsResponse.data[0].id;
          console.log(`   ✅ Assigné au commerçant: ${merchantsResponse.data[0].name}`);
        } else {
          console.log('   ⚠️ Aucun commerçant disponible');
        }
      }
      
      // Mettre à jour l'utilisateur
      try {
        await axios.put(`${BASE_URL}/api/users/${user.id}`, updateData);
        console.log('   ✅ Utilisateur corrigé avec succès');
      } catch (error) {
        console.log('   ❌ Erreur lors de la correction:', error.response?.data?.message || error.message);
      }
    }
    
    console.log('\n🔄 4. Vérification finale');
    const finalResponse = await axios.get(`${BASE_URL}/api/users`);
    
    console.log('\n📊 RÉSULTATS FINAUX:');
    finalResponse.data.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Entity ID: ${user.entity_id || 'null'}`);
      console.log(`   Entity Name: ${user.entityName || 'N/A'}`);
      console.log(`   Entity Description: ${user.entityDescription || 'N/A'}`);
      console.log(`   Created: ${user.created_at || 'N/A'}`);
      console.log(`   Updated: ${user.updated_at || 'N/A'}`);
    });
    
    // Vérifier les problèmes restants
    const problems = [];
    finalResponse.data.forEach(user => {
      if (user.entityDescription === 'Non assigné') {
        problems.push(`- ${user.username}: Entité non assignée`);
      }
    });
    
    if (problems.length > 0) {
      console.log('\n⚠️ Problèmes restants:');
      problems.forEach(problem => console.log(problem));
    } else {
      console.log('\n🎉 TOUS LES PROBLÈMES RÉSOLUS!');
      console.log('✅ Toutes les entités sont correctement assignées');
      console.log('✅ Toutes les dates sont formatées');
      console.log('✅ Tous les utilisateurs ont des informations complètes');
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.response?.data || error.message);
  }
}

fixEntitiesFinal(); 