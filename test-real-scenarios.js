const testRealScenarios = async () => {
  console.log('🏨 Test des scénarios réels de ZiShop');
  console.log('=====================================');

  // Scénario 1: Création d'hôtels réels
  console.log('\n📋 Scénario 1: Création d\'hôtels réels');
  
  const hotels = [
    {
      name: "Hôtel Ritz Paris",
      address: "15 Place Vendôme, 75001 Paris",
      latitude: "48.8676",
      longitude: "2.3294",
      code: "ZIRITZ001",
      qr_code: "https://zishop.co/hotel/ZIRITZ001",
      is_active: true
    },
    {
      name: "Le Bristol Paris",
      address: "112 Rue du Faubourg Saint-Honoré, 75008 Paris",
      latitude: "48.8719",
      longitude: "2.3186",
      code: "ZIBRIS002",
      qr_code: "https://zishop.co/hotel/ZIBRIS002",
      is_active: true
    },
    {
      name: "Hôtel de Crillon",
      address: "10 Place de la Concorde, 75008 Paris",
      latitude: "48.8674",
      longitude: "2.3214",
      code: "ZICRIL003",
      qr_code: "https://zishop.co/hotel/ZICRIL003",
      is_active: true
    }
  ];

  for (const hotel of hotels) {
    try {
      const response = await fetch('http://localhost:5000/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotel)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Hôtel créé: ${hotel.name} (ID: ${result.id})`);
      } else {
        console.log(`❌ Erreur création hôtel: ${hotel.name}`);
      }
    } catch (error) {
      console.log(`❌ Erreur réseau: ${hotel.name}`);
    }
  }

  // Scénario 2: Création de commerçants
  console.log('\n🛍️ Scénario 2: Création de commerçants');
  
  const merchants = [
    {
      name: "Souvenirs de Paris",
      address: "45 Rue de Rivoli, 75001 Paris",
      category: "Souvenirs",
      latitude: "48.8584",
      longitude: "2.2945",
      rating: "4.8",
      review_count: 127,
      is_open: true,
      image_url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0"
    },
    {
      name: "Art & Craft Paris",
      address: "78 Boulevard Saint-Germain, 75005 Paris",
      category: "Artisanat",
      latitude: "48.8530",
      longitude: "2.3499",
      rating: "4.2",
      review_count: 89,
      is_open: true,
      image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
    },
    {
      name: "Galerie Française",
      address: "25 Rue du Louvre, 75001 Paris",
      category: "Galerie",
      latitude: "48.8606",
      longitude: "2.3376",
      rating: "4.9",
      review_count: 203,
      is_open: true,
      image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5"
    }
  ];

  for (const merchant of merchants) {
    try {
      const response = await fetch('http://localhost:5000/api/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merchant)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Commerçant créé: ${merchant.name} (ID: ${result.id})`);
      } else {
        console.log(`❌ Erreur création commerçant: ${merchant.name}`);
      }
    } catch (error) {
      console.log(`❌ Erreur réseau: ${merchant.name}`);
    }
  }

  // Scénario 3: Vérification des données
  console.log('\n📊 Scénario 3: Vérification des données');
  
  try {
    const hotelsResponse = await fetch('http://localhost:5000/api/hotels');
    const hotelsData = await hotelsResponse.json();
    console.log(`📈 Nombre d'hôtels: ${hotelsData.length}`);
    
    const merchantsResponse = await fetch('http://localhost:5000/api/merchants');
    const merchantsData = await merchantsResponse.json();
    console.log(`📈 Nombre de commerçants: ${merchantsData.length}`);
    
    console.log('\n🏨 Liste des hôtels:');
    hotelsData.forEach(hotel => {
      console.log(`  - ${hotel.name} (${hotel.code})`);
    });
    
    console.log('\n🛍️ Liste des commerçants:');
    merchantsData.forEach(merchant => {
      console.log(`  - ${merchant.name} (${merchant.category})`);
    });
    
  } catch (error) {
    console.log('❌ Erreur lors de la vérification des données');
  }

  console.log('\n✅ Test des scénarios terminé !');
};

// Attendre que le serveur démarre
setTimeout(testRealScenarios, 3000); 