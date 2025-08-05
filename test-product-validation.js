// Test pour créer des produits en attente de validation
console.log("🛍️ Création de produits pour test de validation...");

const API_BASE = "http://localhost:5000/api";

async function createProductsForValidation() {
  try {
    console.log("📦 Création des produits de test...");

    // Produit 1: Conforme - Doit être approuvé facilement
    const product1 = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Tour Eiffel Miniature Premium",
        description: "Magnifique réplique de la Tour Eiffel en métal doré, finition soignée, parfait souvenir de Paris. Hauteur 15cm, base gravée.",
        price: "19.90",
        category: "Monuments",
        imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400",
        merchantId: 1,
        isAvailable: true,
        isSouvenir: true,
        origin: "France, Paris",
        material: "Métal doré",
        validation_status: "pending" // En attente de validation
      })
    });

    // Produit 2: Avec problèmes - Description trop courte
    const product2 = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Magnet Paris",
        description: "Joli magnet", // Trop court
        price: "4.90",
        category: "Magnets",
        imageUrl: "https://images.unsplash.com/photo-1549924979-315ce2d7717e?w=400",
        merchantId: 1,
        isAvailable: true,
        isSouvenir: true,
        origin: "France",
        // material manquant
        validation_status: "pending"
      })
    });

    // Produit 3: Prix trop bas
    const product3 = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Petit Artisanat Local",
        description: "Petit objet artisanal fait main par des artisans locaux de la région parisienne, travail traditionnel respectueux de l'environnement.",
        price: "0.50", // Trop bas
        category: "Artisanat",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        merchantId: 1,
        isAvailable: true,
        isSouvenir: true,
        origin: "France, Île-de-France",
        material: "Bois",
        validation_status: "pending"
      })
    });

    // Produit 4: Parfait souvenir
    const product4 = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bijou Artisanal Parisien",
        description: "Élégant bijou artisanal inspiré de l'architecture parisienne, créé par des artistes locaux. Chaque pièce est unique et reflète l'âme de la capitale française.",
        price: "45.00",
        category: "Bijoux",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        merchantId: 1,
        isAvailable: true,
        isSouvenir: true,
        origin: "France, Paris",
        material: "Métal argenté, pierres semi-précieuses",
        validation_status: "pending"
      })
    });

    // Produit 5: Sans image
    const product5 = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Livre Guide de Paris",
        description: "Guide complet de Paris avec toutes les informations essentielles pour découvrir la ville lumière, ses monuments, restaurants et activités.",
        price: "12.50",
        category: "Livres",
        // imageUrl manquante
        merchantId: 1,
        isAvailable: true,
        isSouvenir: false,
        validation_status: "pending"
      })
    });

    const results = await Promise.all([product1, product2, product3, product4, product5]);
    
    console.log("✅ Produits créés pour validation:");
    results.forEach((response, index) => {
      if (response.ok) {
        console.log(`   ${index + 1}. Produit ${index + 1} créé avec succès`);
      } else {
        console.log(`   ${index + 1}. Erreur création produit ${index + 1}:`, response.status);
      }
    });

    const products = await Promise.all(
      results.map(async (response, index) => {
        if (response.ok) {
          return await response.json();
        } else {
          console.error(`Erreur produit ${index + 1}:`, await response.text());
          return null;
        }
      })
    );

    console.log("");
    console.log("📋 Instructions pour tester la validation:");
    console.log("1. Ouvrez le Dashboard Admin");
    console.log("2. Connectez-vous avec n'importe quel nom d'utilisateur/mot de passe");
    console.log("3. Allez dans 'Validation' → 'Validation des produits'");
    console.log("4. Vous verrez les produits avec différents problèmes:");
    console.log("   - Produit 1: ✅ Conforme (à approuver)");
    console.log("   - Produit 2: ⚠️ Description trop courte + matériau manquant");
    console.log("   - Produit 3: ⚠️ Prix trop bas");
    console.log("   - Produit 4: ✅ Parfait souvenir (à approuver)");
    console.log("   - Produit 5: ⚠️ Image manquante");
    console.log("");
    console.log("🎯 Actions de test:");
    console.log("   - Cliquez sur 'Approuver' pour les produits conformes");
    console.log("   - Cliquez sur 'Rejeter' pour les produits avec problèmes");
    console.log("   - Ajoutez des notes de validation");
    console.log("   - Vérifiez les logs dans la console serveur");

  } catch (error) {
    console.error("❌ Erreur lors de la création des produits:", error);
  }
}

// Lancer le test
createProductsForValidation();