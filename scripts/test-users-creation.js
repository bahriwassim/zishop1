// =====================================================
// SCRIPT DE TEST RAPIDE POUR LA CRÉATION D'UTILISATEURS
// Application ZiShop E-commerce
// =====================================================

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase (utiliser les valeurs de votre projet)
const supabaseUrl = 'https://dlbobqhmivvbpvuqmcoo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsYm9icWhtaXZ2YnB2dXFtY29vIiwicmF0aSI6ImFub24iLCJpYXQiOjE3NTMxODcxNDAsImV4cCI6MjA2ODc2MzE0MH0.iGyifmEihWi_C0HeAfrSfatxAVSRLYEo-GvGtMUkcqo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserCreation() {
  console.log('🧪 Test de création d\'utilisateurs de test...');
  console.log('=' .repeat(50));

  try {
    // 1. Test de connexion
    console.log('1. Test de connexion à Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Erreur de connexion:', testError.message);
      return;
    }
    console.log('✅ Connexion réussie');

    // 2. Créer un utilisateur de test simple
    console.log('\n2. Création d\'un utilisateur de test...');
    
    const testUser = {
      username: 'test_user_' + Date.now(),
      password: 'test123',
      role: 'admin',
      entity_id: null
    };

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([testUser])
      .select();

    if (userError) {
      console.error('❌ Erreur création utilisateur:', userError.message);
      return;
    }
    console.log('✅ Utilisateur de test créé:', userData[0].username);

    // 3. Créer un client de test simple
    console.log('\n3. Création d\'un client de test...');
    
    const testClient = {
      email: 'test.client.' + Date.now() + '@email.com',
      password: 'test123',
      first_name: 'Test',
      last_name: 'Client',
      phone: '+33 6 00 00 00 00',
      is_active: true,
      has_completed_tutorial: false
    };

    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert([testClient])
      .select();

    if (clientError) {
      console.error('❌ Erreur création client:', clientError.message);
      return;
    }
    console.log('✅ Client de test créé:', clientData[0].email);

    // 4. Vérifier les données créées
    console.log('\n4. Vérification des données...');
    
    const { data: usersCount, error: usersCountError } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .like('username', 'test_user_%');

    const { data: clientsCount, error: clientsCountError } = await supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .like('email', 'test.client.%');

    if (usersCountError || clientsCountError) {
      console.error('❌ Erreur lors du comptage:', usersCountError || clientsCountError);
    } else {
      console.log(`✅ Utilisateurs de test: ${usersCount.length}`);
      console.log(`✅ Clients de test: ${clientsCount.length}`);
    }

    // 5. Nettoyer les données de test
    console.log('\n5. Nettoyage des données de test...');
    
    if (userData && userData[0]) {
      const { error: deleteUserError } = await supabase
        .from('users')
        .delete()
        .eq('id', userData[0].id);
      
      if (deleteUserError) {
        console.error('❌ Erreur suppression utilisateur:', deleteUserError.message);
      } else {
        console.log('✅ Utilisateur de test supprimé');
      }
    }

    if (clientData && clientData[0]) {
      const { error: deleteClientError } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientData[0].id);
      
      if (deleteClientError) {
        console.error('❌ Erreur suppression client:', deleteClientError.message);
      } else {
        console.log('✅ Client de test supprimé');
      }
    }

    console.log('\n🎉 Test terminé avec succès!');
    console.log('=' .repeat(50));
    console.log('✅ La base de données est accessible');
    console.log('✅ Les tables users et clients sont fonctionnelles');
    console.log('✅ Les opérations CRUD fonctionnent correctement');
    console.log('\n💡 Vous pouvez maintenant utiliser les scripts de création complets');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.log('\n🔧 Vérifiez :');
    console.log('- La configuration Supabase');
    console.log('- Les permissions de base de données');
    console.log('- L\'existence des tables users et clients');
  }
}

// Exécuter le test
testUserCreation().catch(console.error);
