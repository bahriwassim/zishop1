// Script de test pour simuler l'application mobile
const testMobileApp = async () => {
  console.log("🧪 Test de l'application mobile");
  
  try {
    // Simuler exactement ce que fait l'application mobile
    console.log("1. Test de création d'utilisateur (comme l'app mobile)...");
    
    const testUser = {
      email: "bahriwass@gmail.com",
      password: "password123",
      first_name: "wassim",
      last_name: "bahri",
      phone: "05 55 33 21 56"
    };
    
    const response = await fetch('http://localhost:5000/api/clients/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Succès:", data);
    } else {
      const errorText = await response.text();
      console.error("❌ Erreur HTTP:", response.status);
      console.error("Response:", errorText.substring(0, 200));
    }
    
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
};

// Exécuter le test
testMobileApp(); 