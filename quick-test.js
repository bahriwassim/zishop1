console.log('🧪 Test Rapide - Vérification API');
console.log('==================================\n');

// Test simple avec fetch
fetch('http://localhost:3000/api/hotels')
  .then(response => {
    console.log('Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Hôtels trouvés:', data.length);
    data.forEach(hotel => {
      console.log(`- ${hotel.name} (ID: ${hotel.id})`);
    });
  })
  .catch(error => {
    console.error('Erreur:', error.message);
  });

console.log('Test en cours...'); 