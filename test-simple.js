const testSimple = async () => {
  console.log('🧪 Test Simple - Diagnostic');
  console.log('===========================\n');

  try {
    // 1. Test de l'API hôtels
    console.log('1️⃣ Test API hôtels...');
    const hotelsResponse = await fetch('http://localhost:5000/api/hotels');
    if (hotelsResponse.ok) {
      const hotels = await hotelsResponse.json();
      console.log(`   ✅ Hôtels trouvés: ${hotels.length}`);
      hotels.forEach(hotel => {
        console.log(`      - ${hotel.name} (ID: ${hotel.id})`);
      });
    } else {
      console.log(`   ❌ Erreur API hôtels: ${hotelsResponse.status}`);
    }

    // 2. Test de l'API commerçants
    console.log('\n2️⃣ Test API commerçants...');
    const merchantsResponse = await fetch('http://localhost:5000/api/merchants');
    if (merchantsResponse.ok) {
      const merchants = await merchantsResponse.json();
      console.log(`   ✅ Commerçants trouvés: ${merchants.length}`);
    } else {
      console.log(`   ❌ Erreur API commerçants: ${merchantsResponse.status}`);
    }

    // 3. Test de l'API produits
    console.log('\n3️⃣ Test API produits...');
    const productsResponse = await fetch('http://localhost:5000/api/products');
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log(`   ✅ Produits trouvés: ${products.length}`);
    } else {
      console.log(`   ❌ Erreur API produits: ${productsResponse.status}`);
    }

    // 4. Test de création d'hôtel
    console.log('\n4️⃣ Test création hôtel...');
    const newHotel = {
      name: "Hôtel Test Diagnostic",
      address: "123 Rue de Test, 75001 Paris",
      latitude: 48.8566,
      longitude: 2.3522,
      qr_code: "https://zishop.co/hotel/ZITESTDIAG",
      is_active: true
    };

    const createResponse = await fetch('http://localhost:5000/api/hotels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHotel)
    });

    if (createResponse.ok) {
      const createdHotel = await createResponse.json();
      console.log(`   ✅ Hôtel créé: ${createdHotel.name} (ID: ${createdHotel.id})`);
      
      // Vérifier qu'il apparaît dans la liste
      await new Promise(resolve => setTimeout(resolve, 1000));
      const listResponse = await fetch('http://localhost:5000/api/hotels');
      const updatedHotels = await listResponse.json();
      const hotelExists = updatedHotels.some(h => h.name === newHotel.name);
      
      if (hotelExists) {
        console.log(`   ✅ Hôtel trouvé dans la liste (Total: ${updatedHotels.length})`);
      } else {
        console.log(`   ❌ Hôtel non trouvé dans la liste`);
      }
    } else {
      console.log(`   ❌ Erreur création hôtel: ${createResponse.status}`);
    }

    console.log('\n🎉 Test simple terminé !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

// Exécuter immédiatement
testSimple(); 