// Test simple de connexion au serveur
const testSimpleRequest = async () => {
  console.log("🧪 Test simple de connexion");
  
  try {
    console.log("Test de GET /api/hotels...");
    
    // Ajouter un timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('http://localhost:5000/api/hotels', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log("Status:", response.status);
    console.log("Headers:", response.headers.get('content-type'));
    
    if (response.ok) {
      console.log("Lecture du JSON...");
      const data = await response.json();
      console.log("✅ Serveur répond, hôtels trouvés:", data.length);
    } else {
      console.error("❌ Erreur:", response.status);
    }
    
  } catch (error) {
    console.error("❌ Erreur de connexion:", error.message);
  }
};

testSimpleRequest(); 