/**
 * SUPABASE CONFIGURATION
 * This file initializes the Supabase client and makes it available globally.
 */
const SUPABASE_URL = 'https://zppircjtgsqfaweffimd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcGlyY2p0Z3NxZmF3ZWZmaW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDcwMDgsImV4cCI6MjA4NTUyMzAwOH0.qd2LzM6HarfnbMRraCCvBjVNQKIiSVwJiCZ-eL-Qjws';

// Ensure we don't have a conflict with the global 'supabase' library object
// 'supabase' is defined by the script tag: https://cdn.jsdelivr.net/npm/@supabase/supabase-js
if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded! Please check your script tags.');
} else {
    // Initialize the client
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Explicitly attach to window under the same name 'supabase' 
    // This will overwrite the library reference so code like 'supabase.auth' works
    window.supabase = client;

    console.log('✅ Supabase client initialized and ready.');
}
