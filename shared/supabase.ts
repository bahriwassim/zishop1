import { createClient } from '@supabase/supabase-js'

// Récupération des variables d'environnement avec fallback
const supabaseUrl = process.env.SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY

console.log('Configuration Supabase:', {
  url: supabaseUrl ? 'Définie' : 'Manquante',
  key: supabaseAnonKey ? 'Définie' : 'Manquante'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes')
  console.error('SUPABASE_URL:', supabaseUrl)
  console.error('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Définie' : 'Manquante')
  
  // En mode développement, utiliser des valeurs par défaut pour les tests
  if (process.env.NODE_ENV === 'development') {
    console.warn('Mode développement: utilisation de valeurs par défaut pour les tests')
  } else {
    throw new Error('Variables d\'environnement Supabase manquantes')
  }
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key', {
  db: {
    schema: 'public'
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Configuration pour les buckets storage
export const STORAGE_BUCKETS = {
  hotels: 'hotels',
  merchants: 'merchants', 
  products: 'products',
  avatars: 'avatars'
} as const

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS] 

export default supabase; 