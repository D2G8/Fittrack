# TODO - Logout Button Implementation

## Plan:
- [x] Modify `app/page.tsx` to check auth state and show logout button when logged in

## Changes:
- [x] Import getCurrentUser and signOut from lib/supabase
- [x] Add useEffect to check user auth state on mount
- [x] Show "Logout" button when user is logged in
- [x] Show "Login" button when user is NOT logged in
- [x] Handle logout click to call signOut() and refresh
