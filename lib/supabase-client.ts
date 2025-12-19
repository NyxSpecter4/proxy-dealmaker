import { createClient } from '@supabase/supabase-js'

// Check if we're in a build context or if environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client for build time if environment variables are missing
let supabase: any

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Create a mock client for build time
  console.warn('Supabase environment variables are missing. Using mock client.')
  supabase = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Not authenticated') }),
      signIn: () => Promise.resolve({ error: new Error('Mock client') }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Mock client') }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Mock client') }),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: new Error('Mock client') }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: new Error('Mock client') }),
      }),
    }),
  }
}

export { supabase }