# LocalMart Backend - Node.js/Express API

## 🚀 Deploy to Render.com (FREE)

### Step 1: Get Firebase Service Account
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `localmart-385ad`
3. Click ⚙️ Project Settings → Service Accounts
4. Click "Generate new private key" → Download JSON file

### Step 2: Deploy on Render
1. Push your code to GitHub
2. Go to [Render.com](https://render.com/)
3. Sign up with GitHub (free)
4. Click "New +" → "Web Service"
5. Connect your GitHub repository
6. Configure:
   - **Name**: localmart-api
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables in Render
In Render dashboard, add these environment variables from your Firebase JSON:
- `FIREBASE_PROJECT_ID` = `localmart-385ad`
- `FIREBASE_PRIVATE_KEY_ID` = (from JSON file)
- `FIREBASE_PRIVATE_KEY` = (from JSON file - copy whole key)
- `FIREBASE_CLIENT_EMAIL` = (from JSON file)
- `FIREBASE_CLIENT_ID` = (from JSON file)
- `PORT` = `3000`

### Step 4: Deploy!
- Click "Create Web Service"
- Wait 2-3 minutes for deployment
- Your API will be live at: `https://localmart-api.onrender.com`

## 💻 Local Development

### Install Dependencies
```bash
cd backend
npm install
```

### Create .env file
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

### Run Locally
```bash
npm run dev
# Server runs at http://localhost:3000
```

## 📌 API Endpoints

Base URL: `https://localmart-api.onrender.com/api`

### Authentication
- `POST /api/auth/send-phone-otp` - Send OTP to phone
- `POST /api/auth/verify-phone-otp` - Verify OTP
- `POST /api/auth/send-email-verification` - Send verification email

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/:userId` - Get user's orders

## ✅ Cost
**100% FREE** on Render.com free tier:
- 750 hours/month
- Auto-sleep after 15 min inactivity
- Perfect for development and small apps
