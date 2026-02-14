import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  return user
}

// Helper function to sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    console.error('Error signing in:', error)
    return { user: null, error }
  }
  return { user: data.user, error: null }
}

// Helper function to sign up with email and password
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })
  if (error) {
    console.error('Error signing up:', error)
    return { user: null, error }
  }
  return { user: data.user, error: null }
}

// Helper function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    return { error }
  }
  return { error: null }
}

// Helper function to listen to auth changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
}

// ===== PROFILE FUNCTIONS =====

// Profile type matching the database schema
export interface Profile {
  id: string
  name: string
  email: string
  age: number
  weight: number
  target_weight: number
  objective: string
  profile_picture: string
  level: number
  xp: number
  xp_to_next_level: number
  created_at: string
  updated_at: string
}

// Helper function to get profile from database
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  return data as Profile
}

// Helper function to update profile in database
export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating profile:', error)
    return null
  }
  return data as Profile
}

// Helper function to create a new profile in the database
export async function createProfile(userId: string, email: string, name: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      name,
      age: 25,
      weight: 70,
      target_weight: 70,
      objective: 'Build Muscle',
      profile_picture: '',
      level: 1,
      xp: 0,
      xp_to_next_level: 1000,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating profile:', error)
    return null
  }
  return data as Profile
}
