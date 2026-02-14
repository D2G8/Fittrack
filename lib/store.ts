import useSWR, { mutate } from "swr"
import { 
  getCurrentUser, 
  getProfile, 
  updateProfile as updateProfileInDb, 
  Profile as DbProfile,
  getExercisePlans as getExercisePlansFromDb,
  createExercisePlan as createExercisePlanInDb,
  updateExercisePlan as updateExercisePlanInDb,
  deleteExercisePlan as deleteExercisePlanInDb,
  addExercise as addExerciseToDb,
  updateExercise as updateExerciseInDb,
  deleteExercise as deleteExerciseFromDb,
  toggleExerciseCompletion as toggleExerciseInDb,
  getTrainingLogs as getTrainingLogsFromDb,
  createTrainingLog as createTrainingLogInDb,
  deleteTrainingLog as deleteTrainingLogFromDb,
  ExercisePlanWithExercises,
  TrainingLogWithExercises,
  getNutritionPlans as getNutritionPlansFromDb,
  createNutritionPlan as createNutritionPlanInDb,
  updateNutritionPlan as updateNutritionPlanInDb,
  deleteNutritionPlan as deleteNutritionPlanInDb,
  getDailyNutrition as getDailyNutritionFromDb,
  addMealEntry as addMealEntryToDb,
  deleteMealEntry as deleteMealEntryFromDb,
  NutritionPlanWithMeals,
  DailyNutritionWithEntries
} from "./supabase"
import { User } from "@supabase/supabase-js"

// ===== TYPES =====
export interface UserProfile { // aqui é oq cada perfil tem 
  name: string
  age: number
  weight: number
  targetWeight: number
  objective: string
  profilePicture: string
  level: number
  xp: number
  xpToNextLevel: number
  height: number
  workoutFrequency: string
  workoutLocation: string
  injuriesAndAllergies: string
}

// Helper to convert database Profile to UserProfile
function convertToUserProfile(dbProfile: DbProfile | null): UserProfile | null {
  if (!dbProfile) return null
  return {
    name: dbProfile.name,
    age: dbProfile.age,
    weight: dbProfile.weight,
    targetWeight: dbProfile.target_weight,
    objective: dbProfile.objective,
    profilePicture: dbProfile.profile_picture,
    level: dbProfile.level,
    xp: dbProfile.xp,
    xpToNextLevel: dbProfile.xp_to_next_level,
    height: dbProfile.height,
    workoutFrequency: dbProfile.workout_frequency,
    workoutLocation: dbProfile.workout_location,
    injuriesAndAllergies: dbProfile.injuries_and_allergies || "",
  }
}

export interface Mission {
  id: string
  title: string
  description: string
  xpReward: number
  completed: boolean
  type: "exercise" | "food" | "general"
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  bodyPart: string
  completed: boolean
}

export interface ExercisePlan {
  id: string
  name: string
  dayOfWeek: string
  exercises: Exercise[]
}

export interface TrainingLog {
  id: string
  date: string
  planName: string
  exercises: Exercise[]
  duration: number
}

export interface MealEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
}

export interface NutritionPlan {
  id: string
  name: string
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
  meals: { name: string; items: string[] }[]
}

export interface DailyNutrition {
  date: string
  entries: MealEntry[]
  targetCalories: number
}

// ===== DEFAULT DATA =====
export const defaultProfile: UserProfile = {
  name: "Meu piru",
  age: 20,
  weight: 82,
  targetWeight: 75,
  objective: "",
  profilePicture: "",
  level: 7,
  xp: 2340,
  xpToNextLevel: 3000,
  height: 170,
  workoutFrequency: "3-4",
  workoutLocation: "gym",
  injuriesAndAllergies: "",
}


const defaultMissions: Mission[] = [
  { id: "m1", title: "Complete Chest Day", description: "Finish your chest workout today", xpReward: 150, completed: false, type: "exercise" },
  { id: "m2", title: "Hit Protein Goal", description: "Reach your daily protein target", xpReward: 100, completed: false, type: "food" },
  { id: "m3", title: "Log All Meals", description: "Log every meal you eat today", xpReward: 75, completed: true, type: "food" },
  { id: "m4", title: "Drink 3L Water", description: "Stay hydrated throughout the day", xpReward: 50, completed: false, type: "general" },
  { id: "m5", title: "30-Min Cardio", description: "Complete a 30 minute cardio session", xpReward: 120, completed: false, type: "exercise" },
]

const defaultExercisePlans: ExercisePlan[] = [ // depende das opçoes do user..... 

  {
    id: "p1",
    name: "dia do puxo",
    dayOfWeek: "Monday",
    exercises: [
      { id: "e1", name: "Bench Press", sets: 4, reps: 10, weight: 80, bodyPart: "chest", completed: false },
      { id: "e2", name: "Overhead Press", sets: 3, reps: 12, weight: 40, bodyPart: "shoulders", completed: false },
      { id: "e3", name: "Tricep Pushdown", sets: 3, reps: 15, weight: 25, bodyPart: "arms", completed: false },
      { id: "e4", name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 30, bodyPart: "chest", completed: false },
    ],
  },
  {
    id: "p2",
    name: "Pull Day",
    dayOfWeek: "Tuesday",
    exercises: [
      { id: "e5", name: "Deadlift", sets: 4, reps: 8, weight: 120, bodyPart: "back", completed: false },
      { id: "e6", name: "Pull-ups", sets: 3, reps: 10, weight: 0, bodyPart: "back", completed: false },
      { id: "e7", name: "Barbell Rows", sets: 3, reps: 12, weight: 60, bodyPart: "back", completed: false },
      { id: "e8", name: "Bicep Curls", sets: 3, reps: 12, weight: 15, bodyPart: "arms", completed: false },
    ],
  },
  {
    id: "p3",
    name: "Leg Day",
    dayOfWeek: "Wednesday",
    exercises: [
      { id: "e9", name: "Squats", sets: 4, reps: 10, weight: 100, bodyPart: "legs", completed: false },
      { id: "e10", name: "Leg Press", sets: 3, reps: 12, weight: 150, bodyPart: "legs", completed: false },
      { id: "e11", name: "Leg Curls", sets: 3, reps: 15, weight: 40, bodyPart: "legs", completed: false },
      { id: "e12", name: "Calf Raises", sets: 4, reps: 20, weight: 60, bodyPart: "legs", completed: false },
    ],
  },
]

const defaultTrainingLogs: TrainingLog[] = [
  {
    id: "tl1",
    date: "2026-02-12",
    planName: "Push Day",
    exercises: defaultExercisePlans[0].exercises.map(e => ({ ...e, completed: true })),
    duration: 62,
  },
  {
    id: "tl2",
    date: "2026-02-11",
    planName: "Pull Day",
    exercises: defaultExercisePlans[1].exercises.map(e => ({ ...e, completed: true })),
    duration: 55,
  },
  {
    id: "tl3",
    date: "2026-02-10",
    planName: "Leg Day",
    exercises: defaultExercisePlans[2].exercises.map(e => ({ ...e, completed: true })),
    duration: 70,
  },
]

const defaultNutritionPlans: NutritionPlan[] = [
  {
    id: "np1",
    name: "Cut Plan",
    targetCalories: 2200,
    targetProtein: 180,
    targetCarbs: 200,
    targetFat: 70,
    meals: [
      { name: "Breakfast", items: ["Oats with banana", "Protein shake"] },
      { name: "Lunch", items: ["Chicken breast", "Brown rice", "Broccoli"] },
      { name: "Dinner", items: ["Salmon", "Sweet potato", "Asparagus"] },
    ],
  },
]

const defaultDailyNutrition: DailyNutrition = {
  date: "2026-02-13",
  targetCalories: 2200,
  entries: [
    { id: "de1", name: "Oatmeal with Banana", calories: 350, protein: 12, carbs: 55, fat: 8, mealType: "breakfast" },
    { id: "de2", name: "Protein Shake", calories: 200, protein: 30, carbs: 10, fat: 3, mealType: "breakfast" },
    { id: "de3", name: "Grilled Chicken Salad", calories: 450, protein: 40, carbs: 20, fat: 18, mealType: "lunch" },
  ],
}

// ===== SWR STORE HOOKS =====
const fetcher = <T>(key: string, defaultData: T) => (): T => {
  return defaultData
}

export function useProfile() {
  // Fetch profile from database using SWR
  const { data, error, isLoading } = useSWR<UserProfile>("profile", async () => {
    // Get the current user
    const user = await getCurrentUser()
    if (!user) {
      return defaultProfile
    }
    
    // Get the profile from database
    const dbProfile = await getProfile(user.id)
    if (!dbProfile) {
      return defaultProfile
    }
    
    // Convert database profile to UserProfile
    return convertToUserProfile(dbProfile) ?? defaultProfile
  })
  
  
  return {
    
    profile: data ?? defaultProfile,
    isLoading: isLoading,
    updateProfile: async (updates: Partial<UserProfile>) => {
      // Get current user
      const user = await getCurrentUser()
      if (!user) {
        console.error("No user found for update")
        return
      }
      
// Update in database
      const updatedProfile = await updateProfileInDb(user.id, {
        name: updates.name,
        age: updates.age,
        weight: updates.weight,
        target_weight: updates.targetWeight,
        objective: updates.objective,
        profile_picture: updates.profilePicture,
        level: updates.level,
        xp: updates.xp,
        xp_to_next_level: updates.xpToNextLevel,
        height: updates.height,
        workout_frequency: updates.workoutFrequency,
        workout_location: updates.workoutLocation,
        injuries_and_allergies: updates.injuriesAndAllergies,
      })
      
      if (updatedProfile) {
        // Update local cache
        mutate("profile", convertToUserProfile(updatedProfile), false)
      }
    },
  }
}

export function useMissions() {
  const { data, error } = useSWR<Mission[]>("missions", fetcher("missions", defaultMissions))
  return {
    missions: data ?? defaultMissions,
    isLoading: !data && !error,
    toggleMission: (id: string) => {
      const current = data ?? defaultMissions
      const updated = current.map(m => m.id === id ? { ...m, completed: !m.completed } : m)
      mutate("missions", updated, false)
    },
  }
}


export function useExercisePlans() {
  // Get the current user ID for the SWR key
  const { data: userId } = useSWR<string | null>("userId", async () => {
    const user = await getCurrentUser()
    return user?.id ?? null
  })

  // Get profile to generate plans based on objective
  const { data: profile } = useSWR<UserProfile>(
    userId ? ["profile", userId] : null,
    async () => {
      if (!userId) return defaultProfile
      const dbProfile = await getProfile(userId)
      return convertToUserProfile(dbProfile) ?? defaultProfile
    },
    { fallbackData: defaultProfile }
  )

  console.log(profile)

  const generatedPlans = generatePlans(profile ?? defaultProfile)

  const { data, error, isLoading } = useSWR<ExercisePlan[]>(
    userId ? ["exercisePlans", userId] : null,
    async () => {
      if (!userId) {
        return generatedPlans
      }
      
      // Fetch from database
      const dbPlans = await getExercisePlansFromDb(userId)
      
      if (!dbPlans || dbPlans.length === 0) {
        return generatedPlans
      }
      
      // Convert database plans to ExercisePlan format
      return dbPlans.map((plan: ExercisePlanWithExercises) => ({
        id: plan.id,
        name: plan.name,
        dayOfWeek: plan.dayOfWeek,
        exercises: plan.exercises.map(e => ({
          id: e.id,
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          bodyPart: e.bodyPart,
          completed: e.completed,
        }))
      }))
    },
    {
      fallbackData: generatedPlans,
    }
  )

  return {
    plans: data ?? generatedPlans,
    isLoading: !data && !error,
    addPlan: async (plan: ExercisePlan) => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        console.error("No user found for adding plan")
        return
      }
      
      // Save to database
      const dbPlan = await createExercisePlanInDb(currentUser.id, {
        name: plan.name,
        dayOfWeek: plan.dayOfWeek,
        exercises: plan.exercises.map(e => ({
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          bodyPart: e.bodyPart,
        }))
      })
      
      if (dbPlan) {
        // Update local cache with the new plan from database
        const newPlan: ExercisePlan = {
          id: dbPlan.id,
          name: dbPlan.name,
          dayOfWeek: dbPlan.dayOfWeek,
          exercises: dbPlan.exercises.map(e => ({
            id: e.id,
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            weight: e.weight,
            bodyPart: e.bodyPart,
            completed: e.completed,
          }))
        }
        mutate("exercisePlans", [...(data ?? generatedPlans), newPlan], false)
      }
    },
    updatePlan: async (planId: string, updates: Partial<ExercisePlan>) => {
      // Update in database
      await updateExercisePlanInDb(planId, {
        name: updates.name,
        dayOfWeek: updates.dayOfWeek,
      })
      
      // Update local cache
      const current = data ?? generatedPlans
      mutate("exercisePlans", current.map(p => p.id === planId ? { ...p, ...updates } : p), false)
    },
    deletePlan: async (planId: string) => {
      // Delete from database
      await deleteExercisePlanInDb(planId)
      
      // Update local cache
      const current = data ?? generatedPlans
      mutate("exercisePlans", current.filter(p => p.id !== planId), false)
    },
    toggleExercise: async (planId: string, exerciseId: string) => {
      // Toggle in database
      await toggleExerciseInDb(exerciseId)
      
      // Update local cache
      const current = data ?? generatedPlans
      mutate("exercisePlans", current.map(p =>
        p.id === planId
          ? { ...p, exercises: p.exercises.map(e => e.id === exerciseId ? { ...e, completed: !e.completed } : e) }
          : p
      ), false)
    },
    addExercise: async (planId: string, exercise: Omit<Exercise, "id" | "completed">) => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        console.error("No user found for adding exercise")
        return
      }
      
      // Add to database
      const dbExercise = await addExerciseToDb(planId, currentUser.id, {
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        bodyPart: exercise.bodyPart,
      })
      
      if (dbExercise) {
        // Update local cache with the new exercise from database
        const current = data ?? generatedPlans
        const newExercise: Exercise = {
          id: dbExercise.id,
          name: dbExercise.name,
          sets: dbExercise.sets,
          reps: dbExercise.reps,
          weight: dbExercise.weight,
          bodyPart: dbExercise.body_part,
          completed: dbExercise.completed,
        }
        mutate("exercisePlans", current.map(p =>
          p.id === planId
            ? { ...p, exercises: [...p.exercises, newExercise] }
            : p
        ), false)
      }
    },
    removeExercise: async (planId: string, exerciseId: string) => {
      // Delete from database
      await deleteExerciseFromDb(exerciseId)
      
      // Update local cache
      const current = data ?? generatedPlans
      mutate("exercisePlans", current.map(p =>
        p.id === planId
          ? { ...p, exercises: p.exercises.filter(e => e.id !== exerciseId) }
          : p
      ), false)
    },
  };
}



export function useTrainingLogs() {
  const { data, error, isLoading } = useSWR<TrainingLog[]>(
    "trainingLogs",
    async () => {
      // Get current user
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        return defaultTrainingLogs
      }
      
      // Fetch from database
      const dbLogs = await getTrainingLogsFromDb(currentUser.id)
      
      if (!dbLogs || dbLogs.length === 0) {
        return defaultTrainingLogs
      }
      
      // Convert database logs to TrainingLog format
      return dbLogs.map((log: TrainingLogWithExercises) => ({
        id: log.id,
        date: log.date,
        planName: log.planName,
        duration: log.duration,
        exercises: log.exercises.map(e => ({
          id: e.id,
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          bodyPart: e.bodyPart,
          completed: e.completed,
        }))
      }))
    },
    {
      fallbackData: defaultTrainingLogs,
    }
  )

  return {
    logs: data ?? defaultTrainingLogs,
    isLoading: !data && !error,
    addLog: async (log: Omit<TrainingLog, "id">) => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        console.error("No user found for adding log")
        return
      }
      
      // Save to database
      const dbLog = await createTrainingLogInDb(currentUser.id, {
        date: log.date,
        planName: log.planName,
        duration: log.duration,
        exercises: log.exercises.map(e => ({
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          bodyPart: e.bodyPart,
          completed: e.completed,
        }))
      })
      
      if (dbLog) {
        // Update local cache with the new log from database
        const newLog: TrainingLog = {
          id: dbLog.id,
          date: dbLog.date,
          planName: dbLog.planName,
          duration: dbLog.duration,
          exercises: dbLog.exercises.map(e => ({
            id: e.id,
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            weight: e.weight,
            bodyPart: e.bodyPart,
            completed: e.completed,
          }))
        }
        mutate("trainingLogs", [newLog, ...(data ?? defaultTrainingLogs)], false)
      }
    },
    deleteLog: async (logId: string) => {
      // Delete from database
      await deleteTrainingLogFromDb(logId)
      
      // Update local cache
      const current = data ?? defaultTrainingLogs
      mutate("trainingLogs", current.filter(l => l.id !== logId), false)
    },
  }
}

export function useNutritionPlans() {
  const { data, error, isLoading } = useSWR<NutritionPlan[]>(
    "nutritionPlans",
    async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        return defaultNutritionPlans
      }
      
      const dbPlans = await getNutritionPlansFromDb(currentUser.id)
      
      if (!dbPlans || dbPlans.length === 0) {
        return defaultNutritionPlans
      }
      
      return dbPlans.map((plan: NutritionPlanWithMeals) => ({
        id: plan.id,
        name: plan.name,
        targetCalories: plan.targetCalories,
        targetProtein: plan.targetProtein,
        targetCarbs: plan.targetCarbs,
        targetFat: plan.targetFat,
        meals: plan.meals,
      }))
    },
    {
      fallbackData: defaultNutritionPlans,
    }
  )

  return {
    plans: data ?? defaultNutritionPlans,
    isLoading: !data && !error,
    addPlan: async (plan: NutritionPlan) => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        console.error("No user found for adding plan")
        return
      }
      
      const dbPlan = await createNutritionPlanInDb(currentUser.id, {
        name: plan.name,
        targetCalories: plan.targetCalories,
        targetProtein: plan.targetProtein,
        targetCarbs: plan.targetCarbs,
        targetFat: plan.targetFat,
        meals: plan.meals,
      })
      
      if (dbPlan) {
        const newPlan: NutritionPlan = {
          id: dbPlan.id,
          name: dbPlan.name,
          targetCalories: dbPlan.targetCalories,
          targetProtein: dbPlan.targetProtein,
          targetCarbs: dbPlan.targetCarbs,
          targetFat: dbPlan.targetFat,
          meals: dbPlan.meals,
        }
        mutate("nutritionPlans", [...(data ?? defaultNutritionPlans), newPlan], false)
      }
    },
    updatePlan: async (planId: string, updates: Partial<NutritionPlan>) => {
      await updateNutritionPlanInDb(planId, {
        name: updates.name,
        targetCalories: updates.targetCalories,
        targetProtein: updates.targetProtein,
        targetCarbs: updates.targetCarbs,
        targetFat: updates.targetFat,
        meals: updates.meals,
      })
      
      const current = data ?? defaultNutritionPlans
      mutate("nutritionPlans", current.map(p => p.id === planId ? { ...p, ...updates } : p), false)
    },
    deletePlan: async (planId: string) => {
      await deleteNutritionPlanInDb(planId)
      
      const current = data ?? defaultNutritionPlans
      mutate("nutritionPlans", current.filter(p => p.id !== planId), false)
    },
  }
}

export function useDailyNutrition() {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error, isLoading } = useSWR<DailyNutrition>(
    ["dailyNutrition", today],
    async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        console.log("No user found, returning default daily nutrition")
        return defaultDailyNutrition
      }
      
      const dbNutrition = await getDailyNutritionFromDb(currentUser.id, today)
      
      if (!dbNutrition || dbNutrition.entries.length === 0) {
        console.log("No daily nutrition found in database, returning default")
        return defaultDailyNutrition
      }
      
      return {
        date: dbNutrition.date,
        targetCalories: dbNutrition.targetCalories,
        entries: dbNutrition.entries.map(e => ({
          id: e.id,
          name: e.name,
          calories: e.calories,
          protein: e.protein,
          carbs: e.carbs,
          fat: e.fat,
          mealType: e.mealType,
        })),
      }
    },
    {
      fallbackData: defaultDailyNutrition,
    }
  )

  return {
    nutrition: data ?? defaultDailyNutrition,
    isLoading: !data && !error,
    addEntry: async (entry: MealEntry) => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        console.error("No user found for adding entry")
        return
      }
      
      const dbEntry = await addMealEntryToDb(currentUser.id, today, {
        name: entry.name,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        mealType: entry.mealType,
      })
      
      if (dbEntry) {
        const newEntry: MealEntry = {
          id: dbEntry.id,
          name: dbEntry.name,
          calories: dbEntry.calories,
          protein: dbEntry.protein,
          carbs: dbEntry.carbs,
          fat: dbEntry.fat,
          mealType: dbEntry.meal_type,
        }
        const current = data ?? defaultDailyNutrition
        mutate("dailyNutrition", { ...current, entries: [...current.entries, newEntry] }, false)
      }
    },
    removeEntry: async (id: string) => {
      await deleteMealEntryFromDb(id)
      
      const current = data ?? defaultDailyNutrition
      mutate("dailyNutrition", { ...current, entries: current.entries.filter(e => e.id !== id) }, false)
    },
  }
}

// Helper
export function getTodaysPlan(plans: ExercisePlan[]): ExercisePlan | undefined {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = days[new Date().getDay()]
  return plans.find(p => p.dayOfWeek === today)
}

export function getBodyPartsForToday(plans: ExercisePlan[]): string[] {
  const plan = getTodaysPlan(plans)
  if (!plan) return []
  const parts = new Set(plan.exercises.map(e => e.bodyPart))
  return Array.from(parts)
}

// funçao que gera planos!!! de acordo com o usuario (quero usar o chat aqui né...)

function generatePlans(user: UserProfile): ExercisePlan[] {
  const plans: ExercisePlan[] = [];
  if (user.objective.includes("Lose Weight")) {
    plans.push({
      id: "cw1",
      name: "Cardio & Core",
      dayOfWeek: "Monday",
      exercises: [
        { id: "e1", name: "Running", sets: 1, reps: 30, weight: 0, bodyPart: "legs", completed: false },
        { id: "e2", name: "Plank", sets: 3, reps: 1, weight: 0, bodyPart: "core", completed: false },
      ],
    });
    plans.push({
      id: "cw2",
      name: "HIIT & Abs",
      dayOfWeek: "Wednesday",
      exercises: [
        { id: "e3", name: "Jumping Jacks", sets: 3, reps: 50, weight: 0, bodyPart: "fullBody", completed: false },
        { id: "e4", name: "Crunches", sets: 3, reps: 20, weight: 0, bodyPart: "core", completed: false },
      ],
    });
  }

  if (user.objective.includes("Build Muscle")) {
    const weightFactor = user.level * 5; // exemplo simples de ajustar peso
    plans.push({
      id: "mm1",
      name: "Push Day",
      dayOfWeek: "Tuesday",
      exercises: [
        { id: "e5", name: "Bench Press", sets: 4, reps: 10, weight: 50 + weightFactor, bodyPart: "chest", completed: false },
        { id: "e6", name: "Overhead Press", sets: 3, reps: 12, weight: 20 + weightFactor, bodyPart: "shoulders", completed: false },
      ],
    });
    plans.push({
      id: "mm2",
      name: "Pull Day",
      dayOfWeek: "Thursday",
      exercises: [
        { id: "e7", name: "Deadlift", sets: 4, reps: 8, weight: 60 + weightFactor, bodyPart: "back", completed: false },
        { id: "e8", name: "Pull-ups", sets: 3, reps: 10, weight: 0, bodyPart: "back", completed: false },
      ],
    });
  }

  return plans;
}
