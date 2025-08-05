import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

console.log('🔧 TESTS FINAUX - CORRECTION DES DERNIERS PROBLÈMES');
console.log('==================================================');

async function testClientRegistration() {
  console.log('\n👤 Test d\'inscription client');
  console.log('-----------------------------');
  
  const clientData = {
    email: "test@zishop.com",
    password: "password123",
    firstName: "Test",
    lastName: "Client",
    phone: "+33 6 12 34 56 78"
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/api/clients/register`, clientData);
    console.log('✅ Inscription client réussie:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Erreur inscription client:', error.response?.data);
    return false;
  }
}

async function testOrderCreation() {
  console.log('\n📦 Test de création de commande');
  console.log('-------------------------------');
  
  const orderData = {
    hotelId: 1,
    merchantId: 1,
    clientId: 1,
    customerName: "Test Client",
    customerRoom: "101",
    items: [
      { productId: 1, quantity: 2, name: "Souvenir Test", price: "15.50" }
    ],
    totalAmount: "31.00"
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/api/orders`, orderData);
    console.log('✅ Création commande réussie:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Erreur création commande:', error.response?.data);
    return false;
  }
}

async function runFinalTests() {
  console.log('🚀 Lancement des tests finaux...\n');
  
  const results = {
    client: await testClientRegistration(),
    order: await testOrderCreation()
  };
  
  console.log('\n📊 RÉSULTATS FINAUX');
  console.log('==================');
  console.log(`Client: ${results.client ? '✅' : '❌'}`);
  console.log(`Commande: ${results.order ? '✅' : '❌'}`);
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  const successRate = ((successCount / totalCount) * 100).toFixed(1);
  
  console.log(`\n🎯 Taux de succès: ${successRate}% (${successCount}/${totalCount})`);
  
  if (successRate === '100.0') {
    console.log('\n🎉 PARFAIT ! Tous les tests passent !');
  } else {
    console.log('\n⚠️ Encore des problèmes à résoudre...');
  }
}

runFinalTests().catch(console.error); 