import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      const errorMsg = `
Supabase environment variables are not set!
- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'set' : 'MISSING'}
- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'set' : 'MISSING'}

Please add these environment variables in your Vercel project settings:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add NEXT_PUBLIC_SUPABASE_URL (your Supabase project URL)
3. Add NEXT_PUBLIC_SUPABASE_ANON_KEY (your Supabase anon key)
4. Redeploy your project
`
      console.error(errorMsg)
      throw new Error('Supabase is not configured. Please set the environment variables.')
    }

    // Validate URL format
    if (!supabaseUrl.startsWith('https://')) {
      console.error('Invalid Supabase URL: Must start with https://')
      throw new Error('Invalid Supabase URL. Must start with https://')
    }

    if (!supabaseUrl.includes('.supabase.co')) {
      console.error('Invalid Supabase URL: Must contain .supabase.co')
      throw new Error('Invalid Supabase URL. Must be a valid Supabase project URL.')
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'fittrack-web'
        }
      }
    })
    console.log('Supabase client initialized successfully with URL:', supabaseUrl)
    console.log('Supabase URL format check:', { 
      hasHttps: supabaseUrl.startsWith('https://'),
      hasSupabaseDomain: supabaseUrl.includes('.supabase.co')
    })
  }
  return supabaseClient
}

// Export a proxy object that lazily initializes the client
export const supabase = {
  get client() {
    return getSupabaseClient()
  }
}

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.client.auth.getUser()
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  return user
}

// Helper function to sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.client.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Error signing in:', error)
      return { user: null, error }
    }
    return { user: data.user, error: null }
  } catch (err: any) {
    console.error('Exception signing in:', err)
    return { user: null, error: { message: err.message || 'Failed to sign in', name: 'Error' } }
  }
}

// Helper function to sign up with email and password
export async function signUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.client.auth.signUp({
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
  } catch (err: any) {
    console.error('Exception signing up:', err)
    return { user: null, error: { message: err.message || 'Failed to sign up', name: 'Error' } }
  }
}

// Helper function to sign out
export async function signOut() {
  const { error } = await supabase.client.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    return { error }
  }
  return { error: null }
}

// Helper function to listen to auth changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.client.auth.onAuthStateChange(callback)
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
  const { data, error } = await supabase.client
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
  const { data, error } = await supabase.client
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
  const { data, error } = await supabase.client
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

// ===== EXERCISE PLAN TYPES =====

export interface ExercisePlanDb {
  id: string
  user_id: string
  name: string
  day_of_week: string
  created_at: string
  updated_at: string
}

export interface ExerciseDb {
  id: string
  plan_id: string
  user_id: string
  name: string
  sets: number
  reps: number
  weight: number
  body_part: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface TrainingLogDb {
  id: string
  user_id: string
  date: string
  plan_name: string
  duration: number
  created_at: string
  updated_at: string
}

export interface TrainingLogExerciseDb {
  id: string
  log_id: string
  user_id: string
  name: string
  sets: number
  reps: number
  weight: number
  body_part: string
  completed: boolean
  created_at: string
}

// Combined type for exercise plan with exercises
export interface ExercisePlanWithExercises {
  id: string
  name: string
  dayOfWeek: string
  exercises: {
    id: string
    name: string
    sets: number
    reps: number
    weight: number
    bodyPart: string
    completed: boolean
  }[]
}

// Combined type for training log with exercises
export interface TrainingLogWithExercises {
  id: string
  date: string
  planName: string
  exercises: {
    id: string
    name: string
    sets: number
    reps: number
    weight: number
    bodyPart: string
    completed: boolean
  }[]
  duration: number
}

// ===== EXERCISE PLAN FUNCTIONS =====

// Get all exercise plans for a user with their exercises
export async function getExercisePlans(userId: string): Promise<ExercisePlanWithExercises[]> {
  // First get all plans
  const { data: plans, error: plansError } = await supabase.client
    .from('exercise_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  
  if (plansError) {
    console.error('Error fetching exercise plans:', plansError)
    return []
  }
  
  if (!plans || plans.length === 0) {
    return []
  }
  
  // Get all exercises for these plans
  const planIds = plans.map(p => p.id)
  const { data: exercises, error: exercisesError } = await supabase.client
    .from('exercises')
    .select('*')
    .in('plan_id', planIds)
    .order('created_at', { ascending: true })
  
  if (exercisesError) {
    console.error('Error fetching exercises:', exercisesError)
    return []
  }
  
  // Combine plans with their exercises
  return plans.map((plan: ExercisePlanDb) => ({
    id: plan.id,
    name: plan.name,
    dayOfWeek: plan.day_of_week,
    exercises: exercises
      ?.filter(e => e.plan_id === plan.id)
      .map((e: ExerciseDb) => ({
        id: e.id,
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
        bodyPart: e.body_part,
        completed: e.completed,
      })) || []
  }))
}

// Create a new exercise plan with exercises
export async function createExercisePlan(
  userId: string, 
  plan: { name: string; dayOfWeek: string; exercises: { name: string; sets: number; reps: number; weight: number; bodyPart: string }[] }
): Promise<ExercisePlanWithExercises | null> {
  // Create the plan first
  const { data: planData, error: planError } = await supabase.client
    .from('exercise_plans')
    .insert({
      user_id: userId,
      name: plan.name,
      day_of_week: plan.dayOfWeek,
    })
    .select()
    .single()
  
  if (planError) {
    console.error('Error creating exercise plan:', planError)
    return null
  }
  
  // If there are exercises, add them
  if (plan.exercises && plan.exercises.length > 0) {
    const exercisesToInsert = plan.exercises.map(e => ({
      plan_id: planData.id,
      user_id: userId,
      name: e.name,
      sets: e.sets,
      reps: e.reps,
      weight: e.weight,
      body_part: e.bodyPart,
      completed: false,
    }))
    
    const { error: exercisesError } = await supabase.client
      .from('exercises')
      .insert(exercisesToInsert)
    
    if (exercisesError) {
      console.error('Error creating exercises:', exercisesError)
    }
  }
  
  // Fetch the complete plan with exercises
  return getExercisePlanById(planData.id)
}

// Get a single exercise plan by ID
export async function getExercisePlanById(planId: string): Promise<ExercisePlanWithExercises | null> {
  const { data: plan, error: planError } = await supabase.client
    .from('exercise_plans')
    .select('*')
    .eq('id', planId)
    .single()
  
  if (planError || !plan) {
    console.error('Error fetching exercise plan:', planError)
    return null
  }
  
  const { data: exercises, error: exercisesError } = await supabase.client
    .from('exercises')
    .select('*')
    .eq('plan_id', planId)
    .order('created_at', { ascending: true })
  
  if (exercisesError) {
    console.error('Error fetching exercises:', exercisesError)
    return null
  }
  
  return {
    id: plan.id,
    name: plan.name,
    dayOfWeek: plan.day_of_week,
    exercises: exercises?.map((e: ExerciseDb) => ({
      id: e.id,
      name: e.name,
      sets: e.sets,
      reps: e.reps,
      weight: e.weight,
      bodyPart: e.body_part,
      completed: e.completed,
    })) || []
  }
}

// Update an exercise plan
export async function updateExercisePlan(
  planId: string, 
  updates: { name?: string; dayOfWeek?: string }
): Promise<boolean> {
  const updateData: any = {}
  if (updates.name) updateData.name = updates.name
  if (updates.dayOfWeek) updateData.day_of_week = updates.dayOfWeek
  updateData.updated_at = new Date().toISOString()
  
  const { error } = await supabase.client
    .from('exercise_plans')
    .update(updateData)
    .eq('id', planId)
  
  if (error) {
    console.error('Error updating exercise plan:', error)
    return false
  }
  return true
}

// Delete an exercise plan (cascades to exercises)
export async function deleteExercisePlan(planId: string): Promise<boolean> {
  const { error } = await supabase.client
    .from('exercise_plans')
    .delete()
    .eq('id', planId)
  
  if (error) {
    console.error('Error deleting exercise plan:', error)
    return false
  }
  return true
}

// Add an exercise to a plan
export async function addExercise(
  planId: string,
  userId: string,
  exercise: { name: string; sets: number; reps: number; weight: number; bodyPart: string }
): Promise<ExerciseDb | null> {
  const { data, error } = await supabase.client
    .from('exercises')
    .insert({
      plan_id: planId,
      user_id: userId,
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      body_part: exercise.bodyPart,
      completed: false,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding exercise:', error)
    return null
  }
  return data as ExerciseDb
}

// Update an exercise
export async function updateExercise(
  exerciseId: string, 
  updates: { name?: string; sets?: number; reps?: number; weight?: number; bodyPart?: string; completed?: boolean }
): Promise<boolean> {
  const updateData: any = {}
  if (updates.name) updateData.name = updates.name
  if (updates.sets !== undefined) updateData.sets = updates.sets
  if (updates.reps !== undefined) updateData.reps = updates.reps
  if (updates.weight !== undefined) updateData.weight = updates.weight
  if (updates.bodyPart) updateData.body_part = updates.bodyPart
  if (updates.completed !== undefined) updateData.completed = updates.completed
  updateData.updated_at = new Date().toISOString()
  
  const { error } = await supabase.client
    .from('exercises')
    .update(updateData)
    .eq('id', exerciseId)
  
  if (error) {
    console.error('Error updating exercise:', error)
    return false
  }
  return true
}

// Delete an exercise
export async function deleteExercise(exerciseId: string): Promise<boolean> {
  const { error } = await supabase.client
    .from('exercises')
    .delete()
    .eq('id', exerciseId)
  
  if (error) {
    console.error('Error deleting exercise:', error)
    return false
  }
  return true
}

// Toggle exercise completion status
export async function toggleExerciseCompletion(exerciseId: string): Promise<boolean> {
  // First get the current status
  const { data, error: fetchError } = await supabase.client
    .from('exercises')
    .select('completed')
    .eq('id', exerciseId)
    .single()
  
  if (fetchError || !data) {
    console.error('Error fetching exercise:', fetchError)
    return false
  }
  
  // Toggle the status
  const { error } = await supabase.client
    .from('exercises')
    .update({ completed: !data.completed, updated_at: new Date().toISOString() })
    .eq('id', exerciseId)
  
  if (error) {
    console.error('Error toggling exercise:', error)
    return false
  }
  return true
}

// ===== TRAINING LOG FUNCTIONS =====

// Get all training logs for a user
export async function getTrainingLogs(userId: string): Promise<TrainingLogWithExercises[]> {
  // First get all logs
  const { data: logs, error: logsError } = await supabase.client
    .from('training_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  
  if (logsError) {
    console.error('Error fetching training logs:', logsError)
    return []
  }
  
  if (!logs || logs.length === 0) {
    return []
  }
  
  // Get all exercises for these logs
  const logIds = logs.map(l => l.id)
  const { data: exercises, error: exercisesError } = await supabase.client
    .from('training_log_exercises')
    .select('*')
    .in('log_id', logIds)
    .order('created_at', { ascending: true })
  
  if (exercisesError) {
    console.error('Error fetching training log exercises:', exercisesError)
    return []
  }
  
  // Combine logs with their exercises
  return logs.map((log: TrainingLogDb) => ({
    id: log.id,
    date: log.date,
    planName: log.plan_name,
    duration: log.duration,
    exercises: exercises
      ?.filter(e => e.log_id === log.id)
      .map((e: TrainingLogExerciseDb) => ({
        id: e.id,
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
        bodyPart: e.body_part,
        completed: e.completed,
      })) || []
  }))
}

// Create a new training log with exercises
export async function createTrainingLog(
  userId: string,
  log: { date: string; planName: string; duration: number; exercises: { name: string; sets: number; reps: number; weight: number; bodyPart: string; completed: boolean }[] }
): Promise<TrainingLogWithExercises | null> {
  // Create the log first
  const { data: logData, error: logError } = await supabase.client
    .from('training_logs')
    .insert({
      user_id: userId,
      date: log.date,
      plan_name: log.planName,
      duration: log.duration,
    })
    .select()
    .single()
  
  if (logError) {
    console.error('Error creating training log:', logError)
    return null
  }
  
  // If there are exercises, add them
  if (log.exercises && log.exercises.length > 0) {
    const exercisesToInsert = log.exercises.map(e => ({
      log_id: logData.id,
      user_id: userId,
      name: e.name,
      sets: e.sets,
      reps: e.reps,
      weight: e.weight,
      body_part: e.bodyPart,
      completed: e.completed,
    }))
    
    const { error: exercisesError } = await supabase.client
      .from('training_log_exercises')
      .insert(exercisesToInsert)
    
    if (exercisesError) {
      console.error('Error creating training log exercises:', exercisesError)
    }
  }
  
  // Fetch the complete log with exercises
  return getTrainingLogById(logData.id)
}

// Get a single training log by ID
export async function getTrainingLogById(logId: string): Promise<TrainingLogWithExercises | null> {
  const { data: log, error: logError } = await supabase.client
    .from('training_logs')
    .select('*')
    .eq('id', logId)
    .single()
  
  if (logError || !log) {
    console.error('Error fetching training log:', logError)
    return null
  }
  
  const { data: exercises, error: exercisesError } = await supabase.client
    .from('training_log_exercises')
    .select('*')
    .eq('log_id', logId)
    .order('created_at', { ascending: true })
  
  if (exercisesError) {
    console.error('Error fetching training log exercises:', exercisesError)
    return null
  }
  
  return {
    id: log.id,
    date: log.date,
    planName: log.plan_name,
    duration: log.duration,
    exercises: exercises?.map((e: TrainingLogExerciseDb) => ({
      id: e.id,
      name: e.name,
      sets: e.sets,
      reps: e.reps,
      weight: e.weight,
      bodyPart: e.body_part,
      completed: e.completed,
    })) || []
  }
}

// Delete a training log (cascades to exercises)
export async function deleteTrainingLog(logId: string): Promise<boolean> {
  const { error } = await supabase.client
    .from('training_logs')
    .delete()
    .eq('id', logId)
  
  if (error) {
    console.error('Error deleting training log:', error)
    return false
  }
  return true
}

// ===== NUTRITION PLAN TYPES =====

export interface NutritionPlanDb {
  id: string
  user_id: string
  name: string
  target_calories: number
  target_protein: number
  target_carbs: number
  target_fat: number
  meals: { name: string; items: string[] }[]
  created_at: string
  updated_at: string
}

export interface DailyNutritionDb {
  id: string
  user_id: string
  date: string
  target_calories: number
  created_at: string
  updated_at: string
}

export interface MealEntryDb {
  id: string
  user_id: string
  daily_nutrition_id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  created_at: string
  updated_at: string
}

export interface RecipeDb {
  id: string
  user_id: string
  name: string
  description: string
  servings: number
  prep_time: string
  cook_time: string
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: { name: string; amount: string }[]
  instructions: string[]
  estimated_cost: string
  created_at: string
}

// Combined type for nutrition plan with meals
export interface NutritionPlanWithMeals {
  id: string
  name: string
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
  meals: { name: string; items: string[] }[]
}

// Combined type for daily nutrition with entries
export interface DailyNutritionWithEntries {
  date: string
  targetCalories: number
  entries: {
    id: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  }[]
}

// ===== NUTRITION PLAN FUNCTIONS =====

// Get all nutrition plans for a user
export async function getNutritionPlans(userId: string): Promise<NutritionPlanWithMeals[]> {
  const { data, error } = await supabase.client
    .from('nutrition_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching nutrition plans:', error)
    return []
  }
  
  return data?.map((plan: NutritionPlanDb) => ({
    id: plan.id,
    name: plan.name,
    targetCalories: plan.target_calories,
    targetProtein: plan.target_protein,
    targetCarbs: plan.target_carbs,
    targetFat: plan.target_fat,
    meals: plan.meals || [],
  })) || []
}

// Create a new nutrition plan
export async function createNutritionPlan(
  userId: string,
  plan: { name: string; targetCalories: number; targetProtein: number; targetCarbs: number; targetFat: number; meals?: { name: string; items: string[] }[] }
): Promise<NutritionPlanWithMeals | null> {
  const { data, error } = await supabase.client
    .from('nutrition_plans')
    .insert({
      user_id: userId,
      name: plan.name,
      target_calories: plan.targetCalories,
      target_protein: plan.targetProtein,
      target_carbs: plan.targetCarbs,
      target_fat: plan.targetFat,
      meals: plan.meals || [],
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating nutrition plan:', error)
    return null
  }
  
  return {
    id: data.id,
    name: data.name,
    targetCalories: data.target_calories,
    targetProtein: data.target_protein,
    targetCarbs: data.target_carbs,
    targetFat: data.target_fat,
    meals: data.meals || [],
  }
}

// Update a nutrition plan
export async function updateNutritionPlan(
  planId: string,
  updates: { name?: string; targetCalories?: number; targetProtein?: number; targetCarbs?: number; targetFat?: number; meals?: { name: string; items: string[] }[] }
): Promise<boolean> {
  const updateData: any = {}
  if (updates.name) updateData.name = updates.name
  if (updates.targetCalories) updateData.target_calories = updates.targetCalories
  if (updates.targetProtein) updateData.target_protein = updates.targetProtein
  if (updates.targetCarbs) updateData.target_carbs = updates.targetCarbs
  if (updates.targetFat) updateData.target_fat = updates.targetFat
  if (updates.meals) updateData.meals = updates.meals
  updateData.updated_at = new Date().toISOString()
  
  const { error } = await supabase.client
    .from('nutrition_plans')
    .update(updateData)
    .eq('id', planId)
  
  if (error) {
    console.error('Error updating nutrition plan:', error)
    return false
  }
  return true
}

// Delete a nutrition plan
export async function deleteNutritionPlan(planId: string): Promise<boolean> {
  const { error } = await supabase.client
    .from('nutrition_plans')
    .delete()
    .eq('id', planId)
  
  if (error) {
    console.error('Error deleting nutrition plan:', error)
    return false
  }
  return true
}

// ===== DAILY NUTRITION FUNCTIONS =====

// Get or create daily nutrition for a user on a specific date
export async function getDailyNutrition(userId: string, date: string): Promise<DailyNutritionWithEntries> {
  // First try to get existing daily nutrition
  const { data: dailyNutrition, error: dnError } = await supabase.client
    .from('daily_nutrition')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single()
  
  if (dnError || !dailyNutrition) {
    // Return default if not found
    return {
      date,
      targetCalories: 2000,
      entries: [],
    }
  }
  
  // Get meal entries for this daily nutrition
  const { data: entries, error: entriesError } = await supabase.client
    .from('meal_entries')
    .select('*')
    .eq('daily_nutrition_id', dailyNutrition.id)
    .order('created_at', { ascending: true })
  
  if (entriesError) {
    console.error('Error fetching meal entries:', entriesError)
    return {
      date,
      targetCalories: dailyNutrition.target_calories,
      entries: [],
    }
  }
  
  return {
    date: dailyNutrition.date,
    targetCalories: dailyNutrition.target_calories,
    entries: entries?.map((e: MealEntryDb) => ({
      id: e.id,
      name: e.name,
      calories: e.calories,
      protein: e.protein,
      carbs: e.carbs,
      fat: e.fat,
      mealType: e.meal_type,
    })) || [],
  }
}

// Create or update daily nutrition
export async function createOrUpdateDailyNutrition(
  userId: string,
  date: string,
  targetCalories: number
): Promise<DailyNutritionWithEntries | null> {
  // Check if exists
  const { data: existing } = await supabase.client
    .from('daily_nutrition')
    .select('id')
    .eq('user_id', userId)
    .eq('date', date)
    .single()
  
  if (existing) {
    // Update
    const { error } = await supabase.client
      .from('daily_nutrition')
      .update({ target_calories: targetCalories, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    
    if (error) {
      console.error('Error updating daily nutrition:', error)
      return null
    }
  } else {
    // Create
    const { error } = await supabase.client
      .from('daily_nutrition')
      .insert({
        user_id: userId,
        date,
        target_calories: targetCalories,
      })
    
    if (error) {
      console.error('Error creating daily nutrition:', error)
      return null
    }
  }
  
  return getDailyNutrition(userId, date)
}

// ===== MEAL ENTRY FUNCTIONS =====

// Add a meal entry
export async function addMealEntry(
  userId: string,
  date: string,
  entry: { name: string; calories: number; protein: number; carbs: number; fat: number; mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' }
): Promise<any | null> {
  // Get or create daily nutrition
  const dailyNutrition = await createOrUpdateDailyNutrition(userId, date, 2000)
  if (!dailyNutrition) return null
  
  // Find daily nutrition id
  const { data: dn } = await supabase.client
    .from('daily_nutrition')
    .select('id')
    .eq('user_id', userId)
    .eq('date', date)
    .single()
  
  if (!dn) return null
  
  const { data, error } = await supabase.client
    .from('meal_entries')
    .insert({
      user_id: userId,
      daily_nutrition_id: dn.id,
      name: entry.name,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      meal_type: entry.mealType,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding meal entry:', error)
    return null
  }
  
  return data
}

// Update a meal entry
export async function updateMealEntry(
  entryId: string,
  updates: { name?: string; calories?: number; protein?: number; carbs?: number; fat?: number; mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack' }
): Promise<boolean> {
  const updateData: any = {}
  if (updates.name) updateData.name = updates.name
  if (updates.calories !== undefined) updateData.calories = updates.calories
  if (updates.protein !== undefined) updateData.protein = updates.protein
  if (updates.carbs !== undefined) updateData.carbs = updates.carbs
  if (updates.fat !== undefined) updateData.fat = updates.fat
  if (updates.mealType) updateData.meal_type = updates.mealType
  updateData.updated_at = new Date().toISOString()
  
  const { error } = await supabase.client
    .from('meal_entries')
    .update(updateData)
    .eq('id', entryId)
  
  if (error) {
    console.error('Error updating meal entry:', error)
    return false
  }
  return true
}

// Delete a meal entry
export async function deleteMealEntry(entryId: string): Promise<boolean> {
  const { error } = await supabase.client
    .from('meal_entries')
    .delete()
    .eq('id', entryId)
  
  if (error) {
    console.error('Error deleting meal entry:', error)
    return false
  }
  return true
}

// ===== RECIPE FUNCTIONS =====

// Get all recipes for a user
export async function getRecipes(userId: string): Promise<RecipeDb[]> {
  const { data, error } = await supabase.client
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
  
  return data || []
}

// Create a new recipe
export async function createRecipe(
  userId: string,
  recipe: { name: string; description?: string; servings?: number; prep_time?: string; cook_time?: string; calories?: number; protein?: number; carbs?: number; fat?: number; ingredients?: { name: string; amount: string }[]; instructions?: string[]; estimated_cost?: string }
): Promise<RecipeDb | null> {
  const { data, error } = await supabase.client
    .from('recipes')
    .insert({
      user_id: userId,
      name: recipe.name,
      description: recipe.description || '',
      servings: recipe.servings || 1,
      prep_time: recipe.prep_time || '',
      cook_time: recipe.cook_time || '',
      calories: recipe.calories || 0,
      protein: recipe.protein || 0,
      carbs: recipe.carbs || 0,
      fat: recipe.fat || 0,
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      estimated_cost: recipe.estimated_cost || '',
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating recipe:', error)
    return null
  }
  
  return data
}

// Delete a recipe
export async function deleteRecipe(recipeId: string): Promise<boolean> {
  const { error } = await supabase.client
    .from('recipes')
    .delete()
    .eq('id', recipeId)
  
  if (error) {
    console.error('Error deleting recipe:', error)
    return false
  }
  return true
}
