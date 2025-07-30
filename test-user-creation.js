// Script de test pour la création d'utilisateur
const testUserCreation = async () => {
  console.log("🧪 Test de création d'utilisateur mobile");
  
  try {
    // Test 1: Vérifier que le serveur est accessible
    console.log("1. Vérification de l'accessibilité du serveur...");
    const healthCheck = await fetch("http://localhost:5000/api/hotels");
    if (!healthCheck.ok) {
      throw new Error("Serveur non accessible");
    }
    console.log("✅ Serveur accessible");
    
    // Test 2: Créer un utilisateur de test
    console.log("2. Test de création d'utilisateur...");
    const testUser = {
      email: "test@zishop.com",
      password: "password123",
      first_name: "Test",
      last_name: "User",
      phone: "06 12 34 56 78"
    };
    
    const response = await fetch("http://localhost:5000/api/clients/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testUser)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log("✅ Utilisateur créé avec succès:", result);
    } else {
      console.log("❌ Erreur lors de la création:", result);
    }
    
    // Test 3: Vérifier la connexion
    console.log("3. Test de connexion...");
    const loginResponse = await fetch("http://localhost:5000/api/clients/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const loginResult = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log("✅ Connexion réussie:", loginResult);
    } else {
      console.log("❌ Erreur de connexion:", loginResult);
    }
    
  } catch (error) {
    console.error("❌ Erreur lors du test:", error.message);
  }
};

// Exécuter le test
testUserCreation(); 