import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lwnrlxdsldwlcadzrinq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bnJseGRzbGR3bGNhZHpyaW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1ODkxNjEsImV4cCI6MjA5MTE2NTE2MX0.1MWu0Kwq6YnSLz6wLAKLi_jEZsI3dDnWsNX2ZykgT6A'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const email = 'test_signup_' + Date.now() + '@example.com'
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: { data: { full_name: 'Test Setup User' } }
  })
  
  if (error) console.error('ERROR:', error)
  else console.log('SUCCESS:', data)
}
test()
