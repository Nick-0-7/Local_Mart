const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

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
        message: 'LocalMart API is running!',
        version: '1.0.0'
    });
});

// ==================== AUTHENTICATION ENDPOINTS ====================

/**
 * Send Phone OTP
 * POST /api/auth/send-phone-otp
 */
app.post('/api/auth/send-phone-otp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in Firestore with 10-minute expiry
        await db.collection('phoneOTPs').doc(phoneNumber).set({
            otp: otp,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000)
        });

        // In production, send OTP via SMS service (Twilio, etc.)
        // For development, returning OTP in response
        res.json({
            success: true,
            message: 'OTP sent successfully',
            otp: otp // Remove this in production!
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Verify Phone OTP
 * POST /api/auth/verify-phone-otp
 */
app.post('/api/auth/verify-phone-otp', async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ error: 'Phone number and OTP are required' });
        }

        const otpDoc = await db.collection('phoneOTPs').doc(phoneNumber).get();

        if (!otpDoc.exists) {
            return res.status(400).json({ error: 'OTP not found or expired' });
        }

        const otpData = otpDoc.data();

        // Check if OTP is expired
        if (otpData.expiresAt.toMillis() < Date.now()) {
            await db.collection('phoneOTPs').doc(phoneNumber).delete();
            return res.status(400).json({ error: 'OTP expired' });
        }

        // Verify OTP
        if (otpData.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Delete OTP after successful verification
        await db.collection('phoneOTPs').doc(phoneNumber).delete();

        res.json({
            success: true,
            message: 'Phone verified successfully'
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Send Email Verification
 * POST /api/auth/send-email-verification
 */
app.post('/api/auth/send-email-verification', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await auth.getUserByEmail(email);
        const link = await auth.generateEmailVerificationLink(email);

        res.json({
            success: true,
            message: 'Verification link generated',
            link: link
        });
    } catch (error) {
        console.error('Error sending verification:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== USER ENDPOINTS ====================

/**
 * Get User Profile
 * GET /api/users/:userId
 */
app.get('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user: userDoc.data()
        });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Update User Profile
 * PUT /api/users/:userId
 */
app.put('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        // Remove sensitive fields
        delete updates.uid;
        delete updates.email;
        delete updates.role;
        delete updates.createdAt;

        await db.collection('users').doc(userId).update({
            ...updates,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== PRODUCT ENDPOINTS ====================

/**
 * Get All Products
 * GET /api/products
 */
app.get('/api/products', async (req, res) => {
    try {
        const { category, sellerId, minPrice, maxPrice } = req.query;

        let query = db.collection('products');

        if (category) {
            query = query.where('category', '==', category);
        }

        if (sellerId) {
            query = query.where('sellerId', '==', sellerId);
        }

        const snapshot = await query.get();
        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter by price
        if (minPrice) {
            products = products.filter(p => p.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            products = products.filter(p => p.price <= parseFloat(maxPrice));
        }

        res.json({
            success: true,
            products: products
        });
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get Product by ID
 * GET /api/products/:productId
 */
app.get('/api/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const productDoc = await db.collection('products').doc(productId).get();

        if (!productDoc.exists) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            success: true,
            product: { id: productDoc.id, ...productDoc.data() }
        });
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Create Product
 * POST /api/products
 */
app.post('/api/products', async (req, res) => {
    try {
        const productData = req.body;

        const required = ['sellerId', 'title', 'price', 'category'];
        for (const field of required) {
            if (!productData[field]) {
                return res.status(400).json({ error: `${field} is required` });
            }
        }

        const newProduct = {
            ...productData,
            avgRating: 0,
            reviewCount: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('products').add(newProduct);

        res.json({
            success: true,
            message: 'Product created successfully',
            productId: docRef.id
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Update Product
 * PUT /api/products/:productId
 */
app.put('/api/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        delete updates.sellerId;
        delete updates.avgRating;
        delete updates.reviewCount;
        delete updates.createdAt;

        await db.collection('products').doc(productId).update({
            ...updates,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Delete Product
 * DELETE /api/products/:productId
 */
app.delete('/api/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        await db.collection('products').doc(productId).delete();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== ORDER ENDPOINTS ====================

/**
 * Create Order
 * POST /api/orders
 */
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;

        const newOrder = {
            ...orderData,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('orders').add(newOrder);

        res.json({
            success: true,
            message: 'Order created successfully',
            orderId: docRef.id
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get User Orders
 * GET /api/orders/user/:userId
 */
app.get('/api/orders/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const snapshot = await db.collection('orders')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ error: error.message });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 LocalMart API running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});
