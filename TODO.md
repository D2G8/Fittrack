# TODO - Connect Exercise Page to Supabase

## Status: IN PROGRESS

## Tasks:
- [x] Analyze current state of exercise components and store
- [ ] Add addExercise/removeExercise functions to useExercisePlans hook in lib/store.ts
- [ ] Connect useTrainingLogs to database (addLog, deleteLog)
- [ ] Update PlanEditor to use DB-connected functions
- [ ] Test the integration

## Notes:
- lib/supabase.ts already has all the needed database functions
- Most of the integration is already in place, just need to add missing pieces
