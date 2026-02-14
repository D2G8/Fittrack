import useSWR, { mutate } from "swr"

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
  objective: "Build Muscle",
  profilePicture: "",
  level: 7,
  xp: 2340,
  xpToNextLevel: 3000,
}
// import <- 
// 
// 
// 
// 
// 
// 

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
  const { data, error } = useSWR<UserProfile>("profile", fetcher("profile", defaultProfile))
  return {
    profile: data ?? defaultProfile,
    isLoading: !data && !error,
    updateProfile: (updates: Partial<UserProfile>) => {
      mutate("profile", { ...(data ?? defaultProfile), ...updates }, false)
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

// export function useExercisePlans() { // FUNÇAO QUE TIRA AS COISAS E LEVAM ELA PRO """frontend""" com mts aspas
//   const { data, error } = useSWR<ExercisePlan[]>("exercisePlans", fetcher("exercisePlans", defaultExercisePlans))
//   return {
//     plans: data ?? defaultExercisePlans,
//     isLoading: !data && !error,
//     addPlan: (plan: ExercisePlan) => {
//       mutate("exercisePlans", [...(data ?? defaultExercisePlans), plan], false)
//     },
//     updatePlan: (planId: string, updates: Partial<ExercisePlan>) => {
//       const current = data ?? defaultExercisePlans
//       mutate("exercisePlans", current.map(p => p.id === planId ? { ...p, ...updates } : p), false)
//     },
//     deletePlan: (planId: string) => {
//       const current = data ?? defaultExercisePlans
//       mutate("exercisePlans", current.filter(p => p.id !== planId), false)
//     },
//     toggleExercise: (planId: string, exerciseId: string) => {
//       const current = data ?? defaultExercisePlans
//       mutate("exercisePlans", current.map(p =>
//         p.id === planId
//           ? { ...p, exercises: p.exercises.map(e => e.id === exerciseId ? { ...e, completed: !e.completed } : e) }
//           : p
//       ), false)
//     },
//   }
// }

export function useExercisePlans(user?: UserProfile) {


  const safeUser = user ?? defaultProfile; // ← AQUI


  const generatedPlans = generatePlans(safeUser);

  const { data, error } = useSWR<ExercisePlan[]>(
    "exercisePlans",
    () => generatedPlans
  );

  return {
    plans: data ?? generatedPlans,
    isLoading: !data && !error,
    addPlan: (plan: ExercisePlan) => {
      mutate("exercisePlans", [...(data ?? generatedPlans), plan], false)
    },
    updatePlan: (planId: string, updates: Partial<ExercisePlan>) => {
      const current = data ?? generatedPlans;
      mutate("exercisePlans", current.map(p => p.id === planId ? { ...p, ...updates } : p), false)
    },
    deletePlan: (planId: string) => {
      const current = data ?? generatedPlans;
      mutate("exercisePlans", current.filter(p => p.id !== planId), false)
    },
    toggleExercise: (planId: string, exerciseId: string) => {
      const current = data ?? generatedPlans;
      mutate("exercisePlans", current.map(p =>
        p.id === planId
          ? { ...p, exercises: p.exercises.map(e => e.id === exerciseId ? { ...e, completed: !e.completed } : e) }
          : p
      ), false)
    },
  };
}



export function useTrainingLogs() {
  const { data, error } = useSWR<TrainingLog[]>("trainingLogs", fetcher("trainingLogs", defaultTrainingLogs))
  return {
    logs: data ?? defaultTrainingLogs,
    isLoading: !data && !error,
    addLog: (log: TrainingLog) => {
      mutate("trainingLogs", [log, ...(data ?? defaultTrainingLogs)], false)
    },
  }
}

export function useNutritionPlans() {
  const { data, error } = useSWR<NutritionPlan[]>("nutritionPlans", fetcher("nutritionPlans", defaultNutritionPlans))
  return {
    plans: data ?? defaultNutritionPlans,
    isLoading: !data && !error,
    addPlan: (plan: NutritionPlan) => {
      mutate("nutritionPlans", [...(data ?? defaultNutritionPlans), plan], false)
    },
    updatePlan: (planId: string, updates: Partial<NutritionPlan>) => {
      const current = data ?? defaultNutritionPlans
      mutate("nutritionPlans", current.map(p => p.id === planId ? { ...p, ...updates } : p), false)
    },
  }
}

export function useDailyNutrition() {
  const { data, error } = useSWR<DailyNutrition>("dailyNutrition", fetcher("dailyNutrition", defaultDailyNutrition))
  return {
    nutrition: data ?? defaultDailyNutrition,
    isLoading: !data && !error,
    addEntry: (entry: MealEntry) => {
      const current = data ?? defaultDailyNutrition
      mutate("dailyNutrition", { ...current, entries: [...current.entries, entry] }, false)
    },
    removeEntry: (id: string) => {
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
