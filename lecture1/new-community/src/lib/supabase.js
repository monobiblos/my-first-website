import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrokkyzpapxivbtpgosn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyb2treXpwYXB4aXZidHBnb3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNDc1MzYsImV4cCI6MjA4NDcyMzUzNn0.dYkFT8mdLyysLjJWwMMVvE7IK7O1yN9S7Res8aZLQro';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
