async function createTestMerchant() {
  console.log('🧪 Création d\'un commerçant de test...');
  
  const testMerchant = {
    name: "Boutique de Souvenirs Test",
    address: "123 Rue de la Paix, Paris",
    category: "Souvenirs",
    latitude: "48.8566",
    longitude: "2.3522",
    rating: "4.5",
    reviewCount: 0,
    isOpen: true,
    imageUrl: "https://example.com/merchant.jpg"
  };

  try {
    console.log('📤 Envoi de la requête...');
    console.log('Données envoyées:', JSON.stringify(testMerchant, null, 2));
    
    const response = await fetch('http://localhost:5000/api/merchants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testMerchant)
    });

    console.log('📥 Réponse reçue:');
    console.log('Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Erreur:', errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Succès!');
    console.log('Commerçant créé:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

async function getMerchants() {
  console.log('\n🧪 Récupération des commerçants...');
  
  try {
    const response = await fetch('http://localhost:5000/api/merchants', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });

    console.log('Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Erreur:', errorText);
      return;
    }

    const merchants = await response.json();
    console.log('✅ Commerçants récupérés:', merchants.length);
    console.log('Liste des commerçants:', JSON.stringify(merchants, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests...\n');
  
  await createTestMerchant();
  await getMerchants();
  
  console.log('\n🏁 Tests terminés');
}

runTests(); 