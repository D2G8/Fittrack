<<<<<<< HEAD
# TODO - OpenAI Nutrition Chatbot Implementation

## Tasks:
- [x] Create API route at /api/chat for the chatbot
- [x] Create the NutritionChatbot component
- [x] Add the chatbot to the food page (app/food/page.tsx)
- [x] Configure the OpenAI API key (user added to .env.local)

## Status: COMPLETED ✅
=======
# TODO - Adicionar campos de frequência ao Settings

## Objetivo
Adicionar os campos `workout_frequency` e `workout_location` (e `height` e `injuries_and_allergies`) que existem na base de dados à interface do Settings.

## Tarefas

- [x] 1. Analisar código existente e identificar onde fazer alterações
- [x] 2. Atualizar lib/store.ts - adicionar campos ao UserProfile
- [x] 3. Atualizar app/settings/page.tsx - adicionar campos ao formulário
- [x] 4. Testar as alterações

## Ficheiros editados

1. **lib/supabase.ts**
   - Adicionado `injuries_and_allergies` ao interface `Profile`

2. **lib/store.ts**
   - Adicionado `height`, `workoutFrequency`, `workoutLocation`, `injuriesAndAllergies` ao interface `UserProfile`
   - Atualizado `convertToUserProfile` para mapear estes campos
   - Atualizado `defaultProfile` com valores padrão
   - Atualizado `updateProfile` para enviar estes campos para a base de dados

3. **app/settings/page.tsx**
   - Adicionado estado para os novos campos
   - Adicionado input para `height`
   - Adicionado select para `workoutFrequency`
   - Adicionado select para `workoutLocation`
   - Adicionado textarea para `injuriesAndAllergies`
   - Atualizado handleSave para incluir os novos campos

>>>>>>> e267a3661583fc585a3211e37f8b8b4923717d29
