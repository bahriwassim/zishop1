const testHotelCreation = async () => {
  const hotelData = {
    name: "Hôtel Test",
    address: "123 Rue Test, 75001 Paris",
    code: "ZITEST12345",
    latitude: "48.8566",
    longitude: "2.3522",
    qr_code: "https://zishop.co/hotel/ZITEST12345",
    is_active: true
  };

  try {
    console.log('Testing hotel creation...');
    const response = await fetch('http://localhost:5000/api/hotels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(hotelData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', result);
    
    if (response.ok) {
      console.log('✅ Hotel creation successful!');
    } else {
      console.log('❌ Hotel creation failed');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Wait a bit for server to start
setTimeout(testHotelCreation, 2000); 