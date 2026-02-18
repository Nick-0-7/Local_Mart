const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zppircjtgsqfaweffimd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcGlyY2p0Z3NxZmF3ZWZmaW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDcwMDgsImV4cCI6MjA4NTUyMzAwOH0.qd2LzM6HarfnbMRraCCvBjVNQKIiSVwJiCZ-eL-Qjws';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSupabase() {
    console.log('🔄 Connecting to Supabase...');

    try {
        // 1. Check Connection / Products Table
        console.log('\n--- 📦 Checking Products Table ---');
        // select('count', { count: 'exact', head: true }) returns { count: N, data: null, error: ... }
        const { count, error: prodError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        if (prodError) {
            console.error('❌ Error fetching products:', prodError.message);
            console.error(prodError);
        } else {
            console.log(`✅ Success! Products table accessible. Count: ${count}`);
        }

        const { data: oneProduct, error: oneProdError } = await supabase
            .from('products')
            .select('title, price')
            .limit(1);

        if (oneProduct && oneProduct.length > 0) {
            console.log('   Sample Product:', oneProduct[0]);
        } else {
            console.log('   No products found in table (or error fetching sample).');
            if (oneProdError) console.error(oneProdError);
        }

        // 2. Check Profiles Table
        console.log('\n--- 👤 Checking Profiles Table ---');
        const { count: profCount, error: profError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (profError) {
            console.error('❌ Error fetching profiles:', profError.message);
        } else {
            console.log(`✅ Success! Profiles table accessible. Count: ${profCount}`);
        }

        console.log('\n✅ Supabase connection test complete!');

    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

checkSupabase();
