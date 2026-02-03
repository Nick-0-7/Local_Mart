# Firebase Cloud Functions Quick Start Guide

## 🚀 Quick Setup

### Step 1: Install Dependencies
```bash
cd c:\Users\nikhi\Desktop\CODING\Project\LocalMart\functions
npm install
```

### Step 2: Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
firebase login
```

### Step 3: Test Locally
```bash
cd c:\Users\nikhi\Desktop\CODING\Project\LocalMart
firebase emulators:start
```

Your API will run at: `http://localhost:5001/localmart-385ad/us-central1/api`

### Step 4: Deploy to Production
```bash
firebase deploy --only functions
```

## 📌 API Endpoints Created

### Phone Verification
- **POST** `/api/sendPhoneOTP` - Send OTP to phone
- **POST** `/api/verifyPhoneOTP` - Verify OTP

### Email Verification
- **POST** `/api/sendEmailVerification` - Send verification email

### Products
- **GET** `/api/products` - List all products
- **POST** `/api/products` - Create product
- **GET** `/api/products/:id` - Get product details
- **PUT** `/api/products/:id` - Update product
- **DELETE** `/api/products/:id` - Delete product

### Users
- **GET** `/api/users/:userId` - Get user profile
- **PUT** `/api/users/:userId` - Update profile

### Orders
- **POST** `/api/orders` - Create order
- **GET** `/api/orders/user/:userId` - Get user's orders

## ⚡ Next Steps
1. Install dependencies with `npm install` in the functions folder
2. Test locally with Firebase emulators
3. Update frontend to use these API endpoints
4. Deploy to production
