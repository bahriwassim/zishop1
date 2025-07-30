// Test de la route des hôtels
const testHotelCode = async () => {
  console.log("🧪 Test de la route des hôtels");
  
  try {
    const response = await fetch('http://localhost:5000/api/hotels/code/ZI75015');
    
    if (response.ok) {
      const hotel = await response.json();
      console.log("✅ Hôtel trouvé:", hotel.name);
      console.log("Code:", hotel.code);
    } else {
      const error = await response.text();
      console.error("❌ Erreur:", response.status, error);
    }
    
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
};

testHotelCode(); 