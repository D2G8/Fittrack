-- ============================================
-- ADD INJURIES/ALLERGIES FIELD TO PROFILES TABLE
-- ============================================

-- Add injuries_and_allergies column (TEXT to allow free text)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS injuries_and_allergies TEXT DEFAULT '';

-- ============================================
-- UPDATE handle_new_user FUNCTION TO INCLUDE NEW FIELD
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, age, weight, height, target_weight, objective, level, xp, xp_to_next_level, workout_frequency, workout_location, injuries_and_allergies)
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
    COALESCE(NEW.raw_user_meta_data->>'workoutLocation', 'gym'),
    COALESCE(NEW.raw_user_meta_data->>'injuriesAndAllergies', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

