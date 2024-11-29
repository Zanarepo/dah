import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Using env variable for URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY; // Using env variable for anon key

export const supabase = createClient(supabaseUrl, supabaseKey); // Initialize Supabase client
