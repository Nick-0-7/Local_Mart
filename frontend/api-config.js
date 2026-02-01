// Backend API Configuration
const API_CONFIG = {
    BASE_URL: 'https://local-mart-nhl5.onrender.com',
    ENDPOINTS: {
        // Auth
        SEND_PHONE_OTP: '/api/auth/send-phone-otp',
        VERIFY_PHONE_OTP: '/api/auth/verify-phone-otp',
        SEND_EMAIL_VERIFICATION: '/api/auth/send-email-verification',

        // Users
        GET_USER: '/api/users',
        UPDATE_USER: '/api/users',

        // Products
        PRODUCTS: '/api/products',
        PRODUCT_BY_ID: '/api/products',

        // Orders
        ORDERS: '/api/orders',
        USER_ORDERS: '/api/orders/user'
    }
};

// Helper function to make API calls
async function callAPI(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }

    return await response.json();
}

// Phone OTP Functions
async function sendPhoneOTP(phoneNumber) {
    try {
        const result = await callAPI(API_CONFIG.ENDPOINTS.SEND_PHONE_OTP, {
            method: 'POST',
            body: JSON.stringify({ phoneNumber })
        });
        return result;
    } catch (error) {
        console.error('Error sending phone OTP:', error);
        throw error;
    }
}

async function verifyPhoneOTP(phoneNumber, otp) {
    try {
        const result = await callAPI(API_CONFIG.ENDPOINTS.VERIFY_PHONE_OTP, {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, otp })
        });
        return result;
    } catch (error) {
        console.error('Error verifying phone OTP:', error);
        throw error;
    }
}

// Export functions
window.API_CONFIG = API_CONFIG;
window.callAPI = callAPI;
window.sendPhoneOTP = sendPhoneOTP;
window.verifyPhoneOTP = verifyPhoneOTP;
