const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Test des corrections apportées à Zishop...\n');

// Fonction pour vérifier si un fichier existe
function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

// Fonction pour vérifier le contenu d'un fichier
function checkFileContent(filePath, expectedContent) {
  if (!checkFileExists(filePath)) {
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(expectedContent);
}

// Tests des corrections
const tests = [
  {
    name: 'Service de géolocalisation',
    file: 'client/src/services/geolocation.service.ts',
    check: () => checkFileExists('client/src/services/geolocation.service.ts'),
    description: 'Vérification de la création du service de géolocalisation'
  },
  {
    name: 'Widget de géolocalisation',
    file: 'client/src/components/geolocation-widget.tsx',
    check: () => checkFileExists('client/src/components/geolocation-widget.tsx'),
    description: 'Vérification de la création du widget de géolocalisation'
  },
  {
    name: 'Association Hôtel-Commerçants Admin',
    file: 'client/src/components/admin/hotel-merchant-association.tsx',
    check: () => checkFileExists('client/src/components/admin/hotel-merchant-association.tsx'),
    description: 'Vérification de la création du composant d\'association admin'
  },
  {
    name: 'Menu Admin mis à jour',
    file: 'client/src/components/admin-sidebar.tsx',
    check: () => checkFileContent('client/src/components/admin-sidebar.tsx', 'hotel-merchants'),
    description: 'Vérification de l\'ajout de la section hotel-merchants dans le menu admin'
  },
  {
    name: 'Dashboard Admin mis à jour',
    file: 'client/src/pages/admin-dashboard.tsx',
    check: () => checkFileContent('client/src/pages/admin-dashboard.tsx', 'HotelMerchantAssociation'),
    description: 'Vérification de l\'intégration du composant d\'association dans le dashboard admin'
  },
  {
    name: 'Configuration Supabase corrigée',
    file: 'shared/supabase.ts',
    check: () => checkFileContent('shared/supabase.ts', 'hotels: \'hotels\''),
    description: 'Vérification de la correction de la configuration des buckets storage'
  },
  {
    name: 'Composant ImageUpload amélioré',
    file: 'client/src/components/ImageUpload.tsx',
    check: () => checkFileContent('client/src/components/ImageUpload.tsx', 'AlertCircle'),
    description: 'Vérification de l\'amélioration du composant d\'upload d\'images'
  },
  {
    name: 'Dashboard Client avec géolocalisation',
    file: 'client/src/pages/client-dashboard.tsx',
    check: () => checkFileContent('client/src/pages/client-dashboard.tsx', 'GeolocationWidget'),
    description: 'Vérification de l\'intégration de la géolocalisation dans le dashboard client'
  }
];

// Exécution des tests
let passedTests = 0;
let totalTests = tests.length;

console.log('📋 Résultats des tests:\n');

tests.forEach((test, index) => {
  const result = test.check();
  const status = result ? '✅' : '❌';
  const statusText = result ? 'PASSÉ' : 'ÉCHOUÉ';
  
  console.log(`${index + 1}. ${status} ${test.name}`);
  console.log(`   ${test.description}`);
  console.log(`   Fichier: ${test.file}`);
  console.log(`   Statut: ${statusText}\n`);
  
  if (result) passedTests++;
});

// Résumé
console.log('📊 Résumé:');
console.log(`Tests passés: ${passedTests}/${totalTests}`);
console.log(`Taux de réussite: ${Math.round((passedTests / totalTests) * 100)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 Toutes les corrections ont été appliquées avec succès!');
} else {
  console.log('\n⚠️  Certaines corrections nécessitent une attention supplémentaire.');
}

// Vérification des dépendances
console.log('\n🔍 Vérification des dépendances...');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['@supabase/supabase-js', 'lucide-react', 'sonner'];
  
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.log('⚠️  Dépendances manquantes:', missingDeps.join(', '));
  } else {
    console.log('✅ Toutes les dépendances requises sont présentes');
  }
} catch (error) {
  console.log('⚠️  Impossible de vérifier les dépendances:', error.message);
}

console.log('\n📝 Prochaines étapes:');
console.log('1. Vérifier que Supabase est correctement configuré');
console.log('2. Tester l\'upload d\'images dans l\'ajout de produits');
console.log('3. Tester la géolocalisation dans l\'application mobile');
console.log('4. Tester la gestion des associations hôtel-commerçants côté admin');
console.log('5. Vérifier que les buckets storage existent dans Supabase'); 