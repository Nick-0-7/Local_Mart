const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase URL or Service Role Key missing in .env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'LocalMart Supabase API is running!',
        version: '2.0.0'
    });
});

// ==================== AUTHENTICATION ENDPOINTS ====================

/**
 * Send Phone OTP
 */
app.post('/api/auth/send-phone-otp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in Supabase Table 'phone_otps'
        const { error } = await supabase
            .from('phone_otps')
            .upsert({
                phone_number: phoneNumber,
                otp: otp,
                expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
            }, { onConflict: 'phone_number' });

        if (error) throw error;

        res.json({
            success: true,
            message: 'OTP sent successfully',
            otp: otp
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Verify Phone OTP
 */
app.post('/api/auth/verify-phone-otp', async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ error: 'Phone number and OTP are required' });
        }

        const { data: otpData, error } = await supabase
            .from('phone_otps')
            .select('*')
            .eq('phone_number', phoneNumber)
            .single();

        if (error || !otpData) {
            return res.status(400).json({ error: 'OTP not found or expired' });
        }

        if (new Date(otpData.expires_at) < new Date()) {
            await supabase.from('phone_otps').delete().eq('phone_number', phoneNumber);
            return res.status(400).json({ error: 'OTP expired' });
        }

        if (otpData.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        await supabase.from('phone_otps').delete().eq('phone_number', phoneNumber);

        res.json({
            success: true,
            message: 'Phone verified successfully'
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== USER ENDPOINTS ====================

app.get('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !profile) return res.status(404).json({ error: 'User not found' });

        res.json({ success: true, user: profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        delete updates.id;
        delete updates.email;
        delete updates.created_at;

        const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
        if (error) throw error;
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PRODUCT ENDPOINTS ====================

app.get('/api/products', async (req, res) => {
    try {
        const { category, sellerId, minPrice, maxPrice } = req.query;
        let query = supabase.from('products').select('*');
        if (category) query = query.eq('category', category);
        if (sellerId) query = query.eq('seller_id', sellerId);
        if (minPrice) query = query.gte('price', parseFloat(minPrice));
        if (maxPrice) query = query.lte('price', parseFloat(maxPrice));

        const { data: products, error } = await query;
        if (error) throw error;
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const productData = req.body;
        const { data, error } = await supabase.from('products').insert([productData]).select();
        if (error) throw error;
        res.json({ success: true, message: 'Product created successfully', productId: data[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ORDER ENDPOINTS ====================

app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        const { data, error } = await supabase.from('orders').insert([orderData]).select();
        if (error) throw error;
        res.json({ success: true, message: 'Order created successfully', orderId: data[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`🚀 LocalMart Supabase API running on port ${PORT}`));
