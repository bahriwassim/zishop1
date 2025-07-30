// Test très simple de fetch
console.log("🧪 Test très simple de fetch");

fetch('http://localhost:5000/api/hotels')
  .then(response => {
    console.log("Status:", response.status);
    return response.json();
  })
  .then(data => {
    console.log("✅ Données reçues:", data.length, "hôtels");
  })
  .catch(error => {
    console.error("❌ Erreur:", error.message);
  }); 