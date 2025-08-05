async function testProductCreation() {
  console.log('🧪 Test de création de produit...');
  
  const testProduct = {
    merchantId: 28, // Utiliser le commerçant qui existe
    name: "Test Produit",
    description: "Description de test pour le produit",
    price: "15.99",
    category: "Monuments",
    imageUrl: "https://example.com/image.jpg",
    isAvailable: true,
    isSouvenir: true,
    origin: "France",
    material: "Métal",
    stock: 50
  };

  try {
    console.log('📤 Envoi de la requête...');
    console.log('Données envoyées:', JSON.stringify(testProduct, null, 2));
    
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testProduct)
    });

    console.log('📥 Réponse reçue:');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      console.log('❌ Erreur:', responseText);
      return;
    }

    const result = JSON.parse(responseText);
    console.log('✅ Succès!');
    console.log('Produit créé:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

async function testGetProducts() {
  console.log('\n🧪 Test de récupération des produits...');
  
  try {
    const response = await fetch('http://localhost:5000/api/products/merchant/28', {
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

    const products = await response.json();
    console.log('✅ Produits récupérés:', products.length);
    console.log('Liste des produits:', JSON.stringify(products, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests...\n');
  
  await testProductCreation();
  await testGetProducts();
  
  console.log('\n🏁 Tests terminés');
}

runTests(); 