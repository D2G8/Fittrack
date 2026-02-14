-- FitTrack Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER DEFAULT 25,
  weight DECIMAL(5,1) DEFAULT 70,
  target_weight DECIMAL(5,1) DEFAULT 70,
  objective TEXT DEFAULT 'Build Muscle',
  profile_picture TEXT DEFAULT '',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- MISSIONS TABLE
-- ============================================
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 100,
  completed BOOLEAN DEFAULT FALSE,
  mission_type TEXT DEFAULT 'general' CHECK (mission_type IN ('exercise', 'food', 'general')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own missions" ON missions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own missions" ON missions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions" ON missions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own missions" ON missions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- EXERCISE PLANS TABLE
-- ============================================
CREATE TABLE exercise_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE exercise_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own exercise plans" ON exercise_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise plans" ON exercise_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise plans" ON exercise_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercise plans" ON exercise_plans
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- EXERCISES TABLE
-- ============================================
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES exercise_plans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sets INTEGER DEFAULT 3,
  reps INTEGER DEFAULT 10,
  weight DECIMAL(6,1) DEFAULT 0,
  body_part TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own exercises" ON exercises
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercises" ON exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercises" ON exercises
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercises" ON exercises
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TRAINING LOGS TABLE
-- ============================================
CREATE TABLE training_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  plan_name TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE training_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own training logs" ON training_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training logs" ON training_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training logs" ON training_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own training logs" ON training_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TRAINING LOG EXERCISES TABLE (exercises done in a training session)
-- ============================================
CREATE TABLE training_log_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  log_id UUID REFERENCES training_logs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sets INTEGER DEFAULT 3,
  reps INTEGER DEFAULT 10,
  weight DECIMAL(6,1) DEFAULT 0,
  body_part TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE training_log_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own training log exercises" ON training_log_exercises
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training log exercises" ON training_log_exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own training log exercises" ON training_log_exercises
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- NUTRITION PLANS TABLE
-- ============================================
CREATE TABLE nutrition_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_calories INTEGER DEFAULT 2000,
  target_protein INTEGER DEFAULT 150,
  target_carbs INTEGER DEFAULT 200,
  target_fat INTEGER DEFAULT 70,
  meals JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own nutrition plans" ON nutrition_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition plans" ON nutrition_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition plans" ON nutrition_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition plans" ON nutrition_plans
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- DAILY NUTRITION TABLE
-- ============================================
CREATE TABLE daily_nutrition (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  target_calories INTEGER DEFAULT 2000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_nutrition ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily nutrition" ON daily_nutrition
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily nutrition" ON daily_nutrition
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily nutrition" ON daily_nutrition
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- MEAL ENTRIES TABLE
-- ============================================
CREATE TABLE meal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  daily_nutrition_id UUID REFERENCES daily_nutrition(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER DEFAULT 0,
  protein DECIMAL(6,1) DEFAULT 0,
  carbs DECIMAL(6,1) DEFAULT 0,
  fat DECIMAL(6,1) DEFAULT 0,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own meal entries" ON meal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal entries" ON meal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal entries" ON meal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal entries" ON meal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RECIPES TABLE (saved/generated recipes)
-- ============================================
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  servings INTEGER DEFAULT 1,
  prep_time TEXT,
  cook_time TEXT,
  calories INTEGER DEFAULT 0,
  protein DECIMAL(6,1) DEFAULT 0,
  carbs DECIMAL(6,1) DEFAULT 0,
  fat DECIMAL(6,1) DEFAULT 0,
  ingredients JSONB DEFAULT '[]',
  instructions JSONB DEFAULT '[]',
  estimated_cost TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recipes" ON recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" ON recipes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION TO AUTOMATICALLY CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, age, weight, target_weight, objective, level, xp, xp_to_next_level)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 25),
    COALESCE((NEW.raw_user_meta_data->>'weight')::DECIMAL(5,1), 70),
    COALESCE((NEW.raw_user_meta_data->>'targetWeight')::DECIMAL(5,1), 70),
    COALESCE(NEW.raw_user_meta_data->>'objective', 'Build Muscle'),
    1,
    0,
    1000
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION TO ADD DEFAULT MISSIONS FOR NEW USER
-- ============================================
CREATE OR REPLACE FUNCTION public.add_default_missions()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.missions (user_id, title, description, xp_reward, completed, mission_type)
  VALUES 
    (NEW.id, 'Complete Chest Day', 'Finish your chest workout today', 150, false, 'exercise'),
    (NEW.id, 'Hit Protein Goal', 'Reach your daily protein target', 100, false, 'food'),
    (NEW.id, 'Log All Meals', 'Log every meal you eat today', 75, false, 'food'),
    (NEW.id, 'Drink 3L Water', 'Stay hydrated throughout the day', 50, false, 'general'),
    (NEW.id, '30-Min Cardio', 'Complete a 30 minute cardio session', 120, false, 'exercise');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_user_created_missions
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.add_default_missions();
