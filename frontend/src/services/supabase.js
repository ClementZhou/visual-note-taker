import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured in .env.local')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Auth methods
export const auth = {
  async signUp(email, password) {
    return supabase.auth.signUp({ email, password })
  },

  async signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password })
  },

  async signOut() {
    return supabase.auth.signOut()
  },

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

export default supabase
