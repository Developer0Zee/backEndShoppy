# 🛒 ShoppyGlobe E-commerce Backend

This project is the backend API for **ShoppyGlobe**, a full-stack e-commerce application. It is built using **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Password hashing with bcryptjs
- **Testing Tool**: ThunderClient (or Postman)

---

## 🚀 Features

- ✅ User Registration & Login with JWT
- ✅ CRUD APIs for Products
- ✅ User-specific Cart with:
  - Add to cart
  - View cart
  - Update quantity
  - Delete cart item
- ✅ Error handling and input validation
- ✅ Secure routes with authentication middleware
- ✅ MongoDB data pre-seeding

---

---

## 🛠️ Getting Started

### 1. Clone the repository

bash
git clone https://github.com/Developer0Zee/backEndShoppy.git
cd shoppyglobe-backend

2. Install dependencies

npm install

3. Start MongoDB locally

mongodb://localhost:27017

4. Run the server

npm start

🔐 Authentication

Authorization: Bearer <your_token>

📡 API Endpoints

👤 Auth Routes
Method Endpoint Description
POST /register Register new user
POST /login Login and get token

📦 Product Routes
Method Endpoint Description
GET /products Get all products
GET /products/:id Get product by ID

🛒 Cart Routes (Protected)
Method Endpoint Description
GET /cart Get logged-in user’s cart
POST /cart Add product to cart
PUT /cart/:id Update quantity of a cart item
DELETE /cart/:id Remove item from cart

📦 Sample Product Data
Preloaded automatically if DB is empty:


[
  {
    "name": "Samsung Crystal 4K Vivid",
    "price": 42990,
    "description": "UHD Smart TV with vibrant colors and crisp display",
    "stockQuantity": 5
  },
  {
    "name": "vivo T4x 5G",
    "price": 13999,
    "description": "Powerful phone with 6500mAh battery and 44W fast charge",
    "stockQuantity": 1000
  }
]
🧪 ThunderClient Testing

Test and capture screenshots for:

Register

Login

Products list and single product

Cart (add, get, update, delete)

📸 MongoDB Compass Screenshots
Include screenshots of:

products collection

users collection

carts collection

