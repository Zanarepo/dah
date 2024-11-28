import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quqadbverlnveuepwnxa.supabase.co'; // Corrected URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWFkYnZlcmxudmV1ZXB3bnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzM5NTIsImV4cCI6MjA0ODE0OTk1Mn0.blF_IYc0EJWgUnUItT0SnI1FXRzFko9pZhAGAANy4FQ'; // Your Anon Key

export const supabase = createClient(supabaseUrl, supabaseKey);
