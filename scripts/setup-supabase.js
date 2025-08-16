#!/usr/bin/env node

/**
 * Script de configuration automatique Supabase pour ZiShop
 * Ce script aide à configurer la base de données Supabase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🚀 Configuration Supabase pour ZiShop');
console.log('=====================================\n');

async function setupSupabase() {
  try {
    console.log('📋 Récupération des informations Supabase...\n');
    
    // Demander les informations Supabase
    const supabaseUrl = await question('🌐 URL du projet Supabase (ex: https://abc123.supabase.co): ');
    const supabaseAnonKey = await question('🔑 Clé API anon (anon public): ');
    const supabaseServiceRole = await question('🔐 Clé API service_role: ');
    const databasePassword = await question('🗄️ Mot de passe de la base de données: ');
    
    // Extraire l'ID du projet de l'URL
    const projectId = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (!projectId) {
      throw new Error('URL Supabase invalide. Format attendu: https://[project-id].supabase.co');
    }
    
    // Construire l'URL de la base de données
    const databaseUrl = `postgresql://postgres:${databasePassword}@db.${projectId}.supabase.co:5432/postgres`;
    
    // Générer une clé JWT secrète
    const jwtSecret = generateJWTSecret();
    
    // Créer le contenu du fichier .env
    const envContent = `# Configuration de l'environnement ZiShop avec Supabase
NODE_ENV=production

# Configuration du serveur
PORT=5000
HOST=0.0.0.0

# Configuration Supabase
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE=${supabaseServiceRole}

# Configuration de la base de données Supabase
DATABASE_URL=${databaseUrl}

# Configuration de sécurité
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# Configuration des limites
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configuration des notifications
NOTIFICATION_ENABLED=true
WEBSOCKET_PORT=5000

# Configuration des logs
LOG_LEVEL=info
LOG_TO_FILE=false
LOG_FILE_PATH=./logs/app.log

# Configuration CORS (production)
CORS_ORIGIN_PROD=https://zishop.co,https://www.zishop.co

# Configuration de l'API
API_VERSION=v1
API_PREFIX=/api
`;
    
    // Créer le fichier .env
    const envPath = path.join(__dirname, '..', '.env');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Fichier .env créé avec succès !');
    console.log(`📁 Emplacement: ${envPath}`);
    
    // Créer le fichier de configuration Supabase
    const supabaseConfigPath = path.join(__dirname, '..', 'supabase-config.json');
    const supabaseConfig = {
      projectId,
      supabaseUrl,
      databaseUrl: databaseUrl.replace(databasePassword, '[MOT_DE_PASSE_MASQUÉ]'),
      createdAt: new Date().toISOString(),
      note: 'Configuration Supabase pour ZiShop - Ne pas commiter ce fichier'
    };
    
    fs.writeFileSync(supabaseConfigPath, JSON.stringify(supabaseConfig, null, 2));
    console.log(`📄 Configuration Supabase sauvegardée: ${supabaseConfigPath}`);
    
    // Instructions suivantes
    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('1. ✅ Fichier .env créé');
    console.log('2. 🔄 Exécuter: npm run db:generate');
    console.log('3. 🗃️ Exécuter: npm run db:migrate');
    console.log('4. 🚀 Démarrer: npm start');
    
    console.log('\n🔒 SÉCURITÉ:');
    console.log('- Le fichier .env contient des informations sensibles');
    console.log('- Ne le commitez JAMAIS dans Git');
    console.log('- Ajoutez .env à votre .gitignore');
    
    console.log('\n🎯 Configuration terminée !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la configuration:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

function generateJWTSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Vérifier que le script est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSupabase();
}
