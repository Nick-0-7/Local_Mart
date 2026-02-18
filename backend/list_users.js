const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zppircjtgsqfaweffimd.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in environment variables.');
    console.log('You need the SERVICE_ROLE_KEY (not anon key) to list users.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function listUsers() {
    console.log('🔄 Fetching users...');
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('❌ Error listing users:', error.message);
    } else {
        console.log(`✅ Found ${users.length} users:`);
        users.forEach(u => {
            console.log(`- ${u.email} (ID: ${u.id}) [Confirmed: ${u.email_confirmed_at ? 'Yes' : 'No'}]`);
        });
    }
}

listUsers();
