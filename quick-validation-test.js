// Test rapide de validation de produits
console.log("🔍 Test de validation des produits...");

const API_BASE = "http://localhost:5000/api";

async function testValidation() {
  try {
    // 1. Récupérer les produits
    console.log("1. Récupération des produits...");
    const productsResponse = await fetch(`${API_BASE}/products`);
    const products = await productsResponse.json();
    console.log(`   ✅ ${products.length} produits trouvés`);

    if (products.length === 0) {
      console.log("⚠️ Aucun produit trouvé. Créez d'abord des produits avec:");
      console.log("   node test-product-validation.js");
      return;
    }

    // 2. Prendre le premier produit pour test
    const testProduct = products[0];
    console.log(`2. Test avec produit: "${testProduct.name}"`);

    // 3. Test d'approbation
    console.log("3. Test d'approbation...");
    const approveResponse = await fetch(`${API_BASE}/products/${testProduct.id}/validate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-admin-token' // Test avec token factice
      },
      body: JSON.stringify({
        action: 'approve',
        note: 'Test automatique - Produit conforme aux standards'
      })
    });

    if (approveResponse.ok) {
      const result = await approveResponse.json();
      console.log("   ✅ Validation réussie:", result.message);
    } else {
      const error = await approveResponse.text();
      console.log("   ❌ Erreur validation:", approveResponse.status, error);
    }

    console.log("");
    console.log("🎯 Test terminé ! Instructions:");
    console.log("1. Ouvrez http://localhost:5173");
    console.log("2. Dashboard Admin > Validation > Validation des produits");
    console.log("3. Vous devriez voir les produits avec boutons fonctionnels");
    console.log("4. En cas de problème, vérifiez les logs serveur");

  } catch (error) {
    console.error("❌ Erreur test:", error.message);
  }
}

testValidation();