import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Supabase credentials not configured in .env')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || ''
)

export default supabase
