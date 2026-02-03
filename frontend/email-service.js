// Email OTP Service for LocalMart
// Integrated with EmailJS for sending real emails

const OTP_EXPIRY_MINUTES = 10;

// Generate random 6-digit OTP
export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in sessionStorage with expiry
export function storeOTP(email, otp) {
    const otpData = {
        otp: otp,
        email: email,
        expiry: Date.now() + (OTP_EXPIRY_MINUTES * 60 * 1000)
    };
    sessionStorage.setItem('email_otp_' + email, JSON.stringify(otpData));
}

// Verify OTP
export function verifyOTP(email, inputOTP) {
    const stored = sessionStorage.getItem('email_otp_' + email);

    if (!stored) {
        return { success: false, message: 'No OTP found. Please request a new one.' };
    }

    const otpData = JSON.parse(stored);

    // Check expiry
    if (Date.now() > otpData.expiry) {
        sessionStorage.removeItem('email_otp_' + email);
        return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    // Check if OTP matches
    if (otpData.otp !== inputOTP) {
        return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    // Clear OTP after successful verification
    sessionStorage.removeItem('email_otp_' + email);
    return { success: true, message: 'Email verified successfully!' };
}

// Send OTP via EmailJS
export async function sendOTPEmail(toEmail, otp) {
    // =====================================================
    // EmailJS Configuration
    // Get these from https://www.emailjs.com/
    // =====================================================
    const EMAILJS_SERVICE_ID = 'service_w9xn6lo';
    const EMAILJS_TEMPLATE_ID = 'template_jznut5q';
    const EMAILJS_PUBLIC_KEY = '34jfoUE1n5fl7rZap';

    // Check if EmailJS is configured (compare against placeholder values)
    const isConfigured = EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
        EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
        EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

    if (!isConfigured) {
        // Development mode - show OTP in alert
        console.log(`[DEV MODE] OTP for ${toEmail}: ${otp}`);
        alert(`📧 Development Mode - OTP for Testing\n\nEmail: ${toEmail}\nOTP: ${otp}\n\n⚠️ To send real emails:\n1. Go to https://www.emailjs.com/\n2. Set up your account\n3. Update credentials in email-service.js`);
        return { success: true };
    }

    // Production mode - send actual email via EmailJS
    try {
        // Make sure EmailJS library is loaded
        if (typeof emailjs === 'undefined') {
            return {
                success: false,
                message: 'EmailJS library not loaded. Please check your internet connection and refresh the page.'
            };
        }

        console.log('📧 Sending OTP email via EmailJS to:', toEmail);

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                to_email: toEmail,
                to_name: toEmail.split('@')[0],
                otp: otp,
                expiry_minutes: OTP_EXPIRY_MINUTES
            },
            EMAILJS_PUBLIC_KEY
        );

        console.log('✅ Email sent successfully:', response);
        return { success: true };

    } catch (error) {
        console.error('❌ Email sending failed:', error);

        // STRICT MODE: No fallback, return error
        let errorMessage = 'Failed to send verification email. ';

        if (error.text) {
            errorMessage += error.text;
        } else if (error.message) {
            errorMessage += error.message;
        } else {
            errorMessage += 'Please check:\n- EmailJS service is connected\n- Template variables are correct\n- Internet connection is stable';
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}
