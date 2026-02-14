-- ============================================
-- ADD NEW FIELDS TO PROFILES TABLE
-- ============================================

-- Add height column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS height DECIMAL(5,1) DEFAULT 170;

-- Add workout frequency (times per week)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS workout_frequency TEXT DEFAULT '3-4';

-- Add workout location (gym, home, or both)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS workout_location TEXT DEFAULT 'gym' 
CHECK (workout_location IN ('gym', 'home', 'both'));

-- ============================================
-- UPDATE handle_new_user FUNCTION TO INCLUDE NEW FIELDS
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, age, weight, height, target_weight, objective, level, xp, xp_to_next_level, workout_frequency, workout_location)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 25),
    COALESCE((NEW.raw_user_meta_data->>'weight')::DECIMAL(5,1), 70),
    COALESCE((NEW.raw_user_meta_data->>'height')::DECIMAL(5,1), 170),
    COALESCE((NEW.raw_user_meta_data->>'targetWeight')::DECIMAL(5,1), 70),
    COALESCE(NEW.raw_user_meta_data->>'objective', 'Build Muscle'),
    1,
    0,
    1000,
    COALESCE(NEW.raw_user_meta_data->>'workoutFrequency', '3-4'),
    COALESCE(NEW.raw_user_meta_data->>'workoutLocation', 'gym')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
