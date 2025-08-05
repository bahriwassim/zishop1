import fs from 'fs';
import path from 'path';

console.log('🔍 Vérification des corrections finales...\n');

// Liste des fichiers modifiés
const filesToCheck = [
  'client/src/components/admin/hotel-merchant-association.tsx',
  'client/src/components/ImageUpload.tsx',
  'shared/storage-utils.ts',
  'shared/supabase.ts',
  'client/src/components/qr-scanner.tsx'
];

// Vérifications spécifiques
const checks = [
  {
    name: 'Correction méthode HTTP dans hotel-merchant-association',
    file: 'client/src/components/admin/hotel-merchant-association.tsx',
    check: (content) => content.includes('method: "PUT"') && !content.includes('method: "PATCH"'),
    description: 'La méthode PATCH a été remplacée par PUT pour correspondre à l\'API'
  },
  {
    name: 'Amélioration gestion d\'erreurs dans ImageUpload',
    file: 'client/src/components/ImageUpload.tsx',
    check: (content) => content.includes('debugInfo') && content.includes('console.log'),
    description: 'Ajout de logs de debug et gestion d\'erreurs améliorée'
  },
  {
    name: 'Amélioration uploadImage dans storage-utils',
    file: 'shared/storage-utils.ts',
    check: (content) => content.includes('console.log') && content.includes('Erreur Supabase'),
    description: 'Ajout de logs détaillés et meilleure gestion des erreurs Supabase'
  },
  {
    name: 'Configuration Supabase améliorée',
    file: 'shared/supabase.ts',
    check: (content) => content.includes('import.meta.env') && content.includes('console.log'),
    description: 'Support des variables d\'environnement Vite et logs de configuration'
  },
  {
    name: 'Amélioration QR Scanner',
    file: 'client/src/components/qr-scanner.tsx',
    check: (content) => content.includes('isScanning') && content.includes('disabled={isScanning}'),
    description: 'Ajout d\'état de scan et désactivation des boutons pendant le scan'
  }
];

let allPassed = true;

// Vérifier l'existence des fichiers
console.log('📁 Vérification de l\'existence des fichiers:');
filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allPassed = false;
});

console.log('\n🔧 Vérification des corrections spécifiques:');

checks.forEach(check => {
  try {
    const content = fs.readFileSync(check.file, 'utf8');
    const passed = check.check(content);
    console.log(`  ${passed ? '✅' : '❌'} ${check.name}`);
    if (passed) {
      console.log(`     ${check.description}`);
    } else {
      console.log(`     ❌ Échec: ${check.description}`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`  ❌ ${check.name} - Erreur de lecture: ${error.message}`);
    allPassed = false;
  }
});

// Vérifications supplémentaires
console.log('\n🔍 Vérifications supplémentaires:');

// Vérifier que les routes API existent
const routesContent = fs.readFileSync('server/routes.ts', 'utf8');
const apiRoutes = [
  'app.get("/api/hotels/:hotelId/merchants"',
  'app.post("/api/hotel-merchants"',
  'app.put("/api/hotel-merchants/:hotelId/:merchantId"',
  'app.delete("/api/hotel-merchants/:hotelId/:merchantId"'
];

apiRoutes.forEach(route => {
  const exists = routesContent.includes(route);
  console.log(`  ${exists ? '✅' : '❌'} Route API: ${route}`);
  if (!exists) allPassed = false;
});

// Vérifier la configuration des buckets
const supabaseContent = fs.readFileSync('shared/supabase.ts', 'utf8');
const buckets = ['hotels', 'merchants', 'products', 'avatars'];
buckets.forEach(bucket => {
  const exists = supabaseContent.includes(`'${bucket}'`);
  console.log(`  ${exists ? '✅' : '❌'} Bucket: ${bucket}`);
  if (!exists) allPassed = false;
});

console.log('\n📊 Résumé:');
if (allPassed) {
  console.log('✅ Toutes les corrections ont été appliquées avec succès!');
  console.log('\n🎯 Prochaines étapes:');
  console.log('1. Tester l\'upload d\'images dans le formulaire d\'ajout de produit');
  console.log('2. Tester l\'association hôtel-commerçants dans l\'admin');
  console.log('3. Tester le scan QR dans l\'application mobile');
  console.log('4. Vérifier les logs de debug dans la console du navigateur');
} else {
  console.log('❌ Certaines corrections n\'ont pas été appliquées correctement');
  console.log('Veuillez vérifier les erreurs ci-dessus et réappliquer les corrections');
}

console.log('\n🔧 Pour tester les corrections:');
console.log('1. Redémarrez le serveur de développement');
console.log('2. Ouvrez la console du navigateur pour voir les logs de debug');
console.log('3. Testez chaque fonctionnalité une par une');
console.log('4. Vérifiez que les erreurs sont maintenant affichées clairement'); 