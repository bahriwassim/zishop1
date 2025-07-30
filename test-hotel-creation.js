const testHotelCreation = async () => {
  console.log('🏨 Test de Création d\'Hôtels');
  console.log('=============================\n');

  const baseUrl = 'http://localhost:3000/api';

  try {
    // 1. Vérifier l'état initial
    console.log('1️⃣ Vérification de l\'état initial...');
    const initialResponse = await fetch(`${baseUrl}/hotels`);
    const initialHotels = await initialResponse.json();
    console.log(`   - Hôtels existants: ${initialHotels.length}`);

    // 2. Créer un nouvel hôtel
    console.log('\n2️⃣ Création d\'un nouvel hôtel...');
    const newHotel = {
      name: "Hôtel Test ZiShop",
      address: "123 Rue de Test, 75001 Paris",
      latitude: 48.8566,
      longitude: 2.3522,
      qr_code: "https://zishop.co/hotel/ZITEST123",
      is_active: true
    };

    const createResponse = await fetch(`${baseUrl}/hotels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHotel)
    });

    if (!createResponse.ok) {
      throw new Error(`Erreur création hôtel: ${createResponse.status}`);
    }

    const createdHotel = await createResponse.json();
    console.log(`   ✅ Hôtel créé: ${createdHotel.name} (ID: ${createdHotel.id})`);

    // 3. Vérifier que l'hôtel apparaît dans la liste
    console.log('\n3️⃣ Vérification de l\'apparition dans la liste...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde

    const listResponse = await fetch(`${baseUrl}/hotels`);
    const updatedHotels = await listResponse.json();
    
    const hotelExists = updatedHotels.some(hotel => hotel.name === newHotel.name);
    
    if (hotelExists) {
      console.log(`   ✅ Hôtel trouvé dans la liste (Total: ${updatedHotels.length} hôtels)`);
    } else {
      console.log(`   ❌ Hôtel non trouvé dans la liste`);
      console.log(`   📋 Hôtels dans la liste:`);
      updatedHotels.forEach(hotel => {
        console.log(`      - ${hotel.name} (ID: ${hotel.id})`);
      });
    }

    // 4. Test de l'interface utilisateur
    console.log('\n4️⃣ Instructions pour tester l\'interface:');
    console.log('   📱 Ouvrir: http://localhost:5000/admin/login');
    console.log('   🔑 Login: admin / nimportequoi');
    console.log('   🏨 Aller dans: "Gestion Hôtels"');
    console.log('   👀 Vérifier que l\'hôtel "Hôtel Test ZiShop" apparaît dans la liste');

    // 5. Test de création via l'interface
    console.log('\n5️⃣ Test de création via l\'interface:');
    console.log('   📝 Cliquer sur "Nouvel hôtel"');
    console.log('   📋 Remplir le formulaire:');
    console.log('      - Nom: "Hôtel Interface Test"');
    console.log('      - Adresse: "456 Avenue de Test, 75002 Paris"');
    console.log('      - Latitude: 48.8606');
    console.log('      - Longitude: 2.3376');
    console.log('   ✅ Cliquer sur "Créer l\'hôtel"');
    console.log('   👀 Vérifier que l\'hôtel apparaît immédiatement dans la liste');

    console.log('\n🎉 Test terminé !');
    console.log('=====================================');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
};

// Attendre que le serveur démarre
setTimeout(testHotelCreation, 3000); 