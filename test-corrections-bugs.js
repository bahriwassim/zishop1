#!/usr/bin/env node

/**
 * Script de test des corrections de bugs implémentées
 * Vérifie que toutes les améliorations fonctionnent correctement
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  SERVER_URL: 'http://localhost:5000',
  API_URL: 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Fonction de log coloré
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Fonction de test avec retry
async function testWithRetry(testFunction, testName, maxRetries = CONFIG.RETRY_ATTEMPTS) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await testFunction();
      log(`✅ ${testName} - Succès`, 'green');
      return true;
    } catch (error) {
      if (attempt === maxRetries) {
        log(`❌ ${testName} - Échec après ${maxRetries} tentatives: ${error.message}`, 'red');
        return false;
      }
      log(`⚠️  ${testName} - Tentative ${attempt}/${maxRetries} échouée: ${error.message}`, 'yellow');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

// Tests des corrections de bugs

// 1. Test de la sécurité et du rate limiting
async function testSecurityAndRateLimiting() {
  log('\n🔒 Test de la sécurité et du rate limiting...', 'blue');
  
  // Test du rate limiting
  const requests = Array(150).fill().map(() => 
    axios.get(`${CONFIG.API_URL}/hotels`, { timeout: 5000 })
  );
  
  try {
    await Promise.all(requests);
    throw new Error('Rate limiting ne fonctionne pas');
  } catch (error) {
    if (error.response?.status === 429) {
      log('✅ Rate limiting fonctionne correctement', 'green');
    } else {
      throw new Error(`Rate limiting inattendu: ${error.response?.status}`);
    }
  }
}

// 2. Test de la gestion d'erreurs
async function testErrorHandling() {
  log('\n🚨 Test de la gestion d'erreurs...', 'blue');
  
  // Test d'une route inexistante
  try {
    await axios.get(`${CONFIG.API_URL}/route-inexistante`, { timeout: 5000 });
    throw new Error('Route inexistante devrait retourner 404');
  } catch (error) {
    if (error.response?.status === 404) {
      log('✅ Gestion des routes 404 correcte', 'green');
    } else {
      throw new Error(`Statut inattendu: ${error.response?.status}`);
    }
  }
  
  // Test de validation des données
  try {
    await axios.post(`${CONFIG.API_URL}/hotels`, {
      name: '', // Nom vide pour déclencher une erreur de validation
      address: 'Test',
      code: 'TEST'
    }, { timeout: 5000 });
    throw new Error('Validation devrait échouer avec un nom vide');
  } catch (error) {
    if (error.response?.status === 400) {
      log('✅ Validation des données correcte', 'green');
    } else {
      throw new Error(`Statut de validation inattendu: ${error.response?.status}`);
    }
  }
}

// 3. Test de la configuration CORS
async function testCORS() {
  log('\n🌐 Test de la configuration CORS...', 'blue');
  
  // Test avec une origine autorisée
  try {
    const response = await axios.get(`${CONFIG.API_URL}/hotels`, {
      timeout: 5000,
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    
    if (response.headers['access-control-allow-origin']) {
      log('✅ CORS configuré correctement', 'green');
    } else {
      throw new Error('Headers CORS manquants');
    }
  } catch (error) {
    throw new Error(`Erreur CORS: ${error.message}`);
  }
}

// 4. Test de la validation des données
async function testDataValidation() {
  log('\n✅ Test de la validation des données...', 'blue');
  
  // Test de validation des coordonnées
  try {
    await axios.post(`${CONFIG.API_URL}/hotels`, {
      name: 'Hôtel Test',
      address: '123 Rue Test, 75001 Paris',
      code: 'TEST123',
      latitude: 'invalid-latitude', // Coordonnée invalide
      longitude: '2.3522'
    }, { timeout: 5000 });
    throw new Error('Validation des coordonnées devrait échouer');
  } catch (error) {
    if (error.response?.status === 400) {
      log('✅ Validation des coordonnées correcte', 'green');
    } else {
      throw new Error(`Statut de validation des coordonnées inattendu: ${error.response?.status}`);
    }
  }
  
  // Test de validation du code d'hôtel
  try {
    await axios.post(`${CONFIG.API_URL}/hotels`, {
      name: 'Hôtel Test',
      address: '123 Rue Test, 75001 Paris',
      code: 'test-123', // Code avec caractères invalides
      latitude: '48.8566',
      longitude: '2.3522'
    }, { timeout: 5000 });
    throw new Error('Validation du code d\'hôtel devrait échouer');
  } catch (error) {
    if (error.response?.status === 400) {
      log('✅ Validation du code d\'hôtel correcte', 'green');
    } else {
      throw new Error(`Statut de validation du code inattendu: ${error.response?.status}`);
    }
  }
}

// 5. Test de la gestion des timeouts
async function testTimeouts() {
  log('\n⏱️  Test de la gestion des timeouts...', 'blue');
  
  // Test avec un timeout très court
  try {
    await axios.get(`${CONFIG.API_URL}/hotels`, { timeout: 1 });
    throw new Error('Timeout devrait être déclenché');
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      log('✅ Gestion des timeouts correcte', 'green');
    } else {
      throw new Error(`Erreur de timeout inattendue: ${error.code}`);
    }
  }
}

// 6. Test de la validation des headers
async function testHeaderValidation() {
  log('\n📋 Test de la validation des headers...', 'blue');
  
  // Test avec un Content-Type invalide
  try {
    await axios.post(`${CONFIG.API_URL}/hotels`, 'données invalides', {
      timeout: 5000,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    throw new Error('Validation du Content-Type devrait échouer');
  } catch (error) {
    if (error.response?.status === 400) {
      log('✅ Validation des headers correcte', 'green');
    } else {
      throw new Error(`Statut de validation des headers inattendu: ${error.response?.status}`);
    }
  }
}

// 7. Test de la taille des requêtes
async function testRequestSize() {
  log('\n📏 Test de la taille des requêtes...', 'blue');
  
  // Créer une requête très volumineuse
  const largeData = {
    name: 'Hôtel Test',
    address: 'A'.repeat(1024 * 1024), // 1MB d'adresse
    code: 'TEST123',
    latitude: '48.8566',
    longitude: '2.3522'
  };
  
  try {
    await axios.post(`${CONFIG.API_URL}/hotels`, largeData, { timeout: 5000 });
    throw new Error('Validation de la taille devrait échouer');
  } catch (error) {
    if (error.response?.status === 413) {
      log('✅ Validation de la taille des requêtes correcte', 'green');
    } else {
      throw new Error(`Statut de validation de la taille inattendu: ${error.response?.status}`);
    }
  }
}

// 8. Test de la gestion des erreurs non capturées
async function testUncaughtErrorHandling() {
  log('\n🚨 Test de la gestion des erreurs non capturées...', 'blue');
  
  // Test avec des données malformées
  try {
    await axios.post(`${CONFIG.API_URL}/hotels`, null, { timeout: 5000 });
    throw new Error('Gestion des données null devrait échouer');
  } catch (error) {
    if (error.response?.status === 400) {
      log('✅ Gestion des erreurs non capturées correcte', 'green');
    } else {
      throw new Error(`Statut de gestion des erreurs inattendu: ${error.response?.status}`);
    }
  }
}

// Fonction principale de test
async function runAllTests() {
  log('🚀 Démarrage des tests des corrections de bugs...', 'bright');
  log(`📡 Serveur: ${CONFIG.SERVER_URL}`, 'cyan');
  
  const tests = [
    { name: 'Sécurité et Rate Limiting', test: testSecurityAndRateLimiting },
    { name: 'Gestion d\'Erreurs', test: testErrorHandling },
    { name: 'Configuration CORS', test: testCORS },
    { name: 'Validation des Données', test: testDataValidation },
    { name: 'Gestion des Timeouts', test: testTimeouts },
    { name: 'Validation des Headers', test: testHeaderValidation },
    { name: 'Taille des Requêtes', test: testRequestSize },
    { name: 'Erreurs Non Capturées', test: testUncaughtErrorHandling },
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const { name, test } of tests) {
    try {
      const success = await testWithRetry(test, name);
      if (success) passedTests++;
    } catch (error) {
      log(`❌ ${name} - Erreur critique: ${error.message}`, 'red');
    }
  }
  
  // Résumé des tests
  log('\n📊 RÉSUMÉ DES TESTS', 'bright');
  log(`Tests réussis: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 Tous les tests sont passés avec succès !', 'green');
    log('✅ Les corrections de bugs sont fonctionnelles', 'green');
  } else {
    log(`⚠️  ${totalTests - passedTests} test(s) ont échoué`, 'yellow');
    log('🔧 Vérifiez les erreurs et corrigez les problèmes', 'red');
  }
  
  return passedTests === totalTests;
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  log('❌ Promesse rejetée non gérée:', 'red');
  console.error(reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log('❌ Erreur non capturée:', 'red');
  console.error(error);
  process.exit(1);
});

// Point d'entrée
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`❌ Erreur fatale: ${error.message}`, 'red');
      console.error(error);
      process.exit(1);
    });
}

module.exports = { runAllTests, testWithRetry };
