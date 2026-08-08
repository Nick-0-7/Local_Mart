# 🛒 Local_Mart

### A Hyperlocal E-Commerce Platform Connecting Local Buyers and Sellers

Local_Mart is a full-stack hyperlocal marketplace designed to connect local buyers with nearby sellers. The platform provides a convenient way for users to discover products, browse stores, and interact with local businesses through a modern web interface.

The project focuses on making local shopping more accessible while giving small businesses a digital platform to showcase and sell their products.

---

## 🌐 Live Demo

🔗 **Live Website:**  
https://local-mart-liard.vercel.app/

---

## 📌 Features

### 👤 Buyer

- Browse products from local sellers
- Search and explore available products
- View product information
- Discover nearby/local stores
- Responsive user interface
- User authentication

### 🏪 Seller

- Seller registration and authentication
- Add and manage products
- Upload product images
- Manage product information
- Store information management
- Store location and availability details

### 🔐 Authentication

- Secure user authentication
- Buyer and seller workflows
- OTP-based verification
- Protected backend operations

### 📍 Local Store Features

- Store location information
- Store operating hours
- Local seller discovery
- Product availability

---

## 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │       User           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Frontend        │
                    │   HTML / CSS / JS    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Backend        │
                    │    Node.js / Express │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌────────────────┐          ┌────────────────┐
        │    Supabase    │          │    Firebase    │
        │    Database    │          │ Authentication │
        └────────────────┘          └────────────────┘
