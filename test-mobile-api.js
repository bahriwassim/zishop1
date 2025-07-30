// Script de test pour l'API mobile
const testMobileAPI = async () => {
  console.log("🧪 Test de l'API mobile");
  
  try {
    // Test 1: Vérifier l'endpoint de création d'utilisateur
    console.log("1. Test de l'endpoint /api/clients/register...");
    
    const testUser = {
      email: "mobile@zishop.com",
      password: "password123",
      first_name: "Mobile",
      last_name: "User",
      phone: "06 12 34 56 78"
    };
    
    const response = await fetch("http://localhost:5000/api/clients/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000"
      },
      body: JSON.stringify(testUser)
    });
    
    console.log("Status:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    
    const result = await response.text();
    console.log("Response:", result.substring(0, 200));
    
    if (response.ok) {
      console.log("✅ Endpoint accessible depuis l'application mobile");
    } else {
      console.log("❌ Erreur:", result);
    }
    
  } catch (error) {
    console.error("❌ Erreur lors du test:", error.message);
  }
};

// Exécuter le test
testMobileAPI(); 