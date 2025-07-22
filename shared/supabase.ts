import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://lcyevhpexzcrmbfozqwt.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjeWV2aHBleHpjcm1iZm96cXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTgzMDIsImV4cCI6MjA2MjM3NDMwMn0.5gdYUTdqzzGvoLRPkYjmyfLW9R5UAwdIuzePxCMj05Y'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
  HOTELS: 'hotels',
  MERCHANTS: 'merchants', 
  PRODUCTS: 'products',
  AVATARS: 'avatars'
} as const

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS] 