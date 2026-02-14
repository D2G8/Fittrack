# TODO - Adicionar campos de frequência ao Settings

## Objetivo
Adicionar os campos `workout_frequency` e `workout_location` (e `height`) que existem na base de dados à interface do Settings.

## Tarefas

- [x] 1. Analisar código existente e identificar onde fazer alterações
- [x] 2. Atualizar lib/store.ts - adicionar campos ao UserProfile
- [x] 3. Atualizar app/settings/page.tsx - adicionar campos ao formulário
- [x] 4. Testar as alterações

## Ficheiros editados

1. **lib/store.ts**
   - ✅ Adicionado `height`, `workoutFrequency`, `workoutLocation` ao interface `UserProfile`
   - ✅ Atualizado `convertToUserProfile` para mapear estes campos
   - ✅ Atualizado `defaultProfile` com valores padrão
   - ✅ Atualizado `updateProfile` para enviar estes campos

2. **app/settings/page.tsx**
   - ✅ Adicionado estado para os novos campos
   - ✅ Adicionado inputs/selects no formulário
   - ✅ Atualizado handleSave para incluir os novos campos

