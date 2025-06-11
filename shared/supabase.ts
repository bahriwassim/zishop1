import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://wmbwxdyifybrbrozlcef.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYnd4ZHlpZnlicmJyb3psY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzY1NjcsImV4cCI6MjA2NDkxMjU2N30.XdveZrItacB3XqKwHjBBKCO6KWU8qq5IXFcPZEFwKCk'

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