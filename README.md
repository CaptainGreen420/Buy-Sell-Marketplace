# Buy & Sell Marketplace

## Description
A dedicated buy-sell platform built using the MERN stack. This marketplace allows users to list, buy, and sell products securely without external taxation. The platform supports user authentication, product management, order tracking, and an AI-powered support chatbot.

## File Structure
```
.
├── ./README.md
├── ./backend
│   ├── ./backend/config
│   │   └── ./backend/config/mongodb.js
│   ├── ./backend/controllers
│   │   ├── ./backend/controllers/chatController.js
│   │   ├── ./backend/controllers/orderController.js
│   │   ├── ./backend/controllers/productController.js
│   │   └── ./backend/controllers/userController.js
│   ├── ./backend/middleware
│   │   └── ./backend/middleware/authMiddleware.js
│   ├── ./backend/models
│   │   ├── ./backend/models/cartModel.js
│   │   ├── ./backend/models/itemModel.js
│   │   ├── ./backend/models/orderModel.js
│   │   └── ./backend/models/userModel.js
│   ├── ./backend/package.json
│   ├── ./backend/routes
│   │   ├── ./backend/routes/orderRoute.js
│   │   ├── ./backend/routes/productRoute.js
│   │   └── ./backend/routes/userRoute.js
│   └── ./backend/server.js
└── ./frontend
    ├── ./frontend/README.md
    ├── ./frontend/eslint.config.js
    ├── ./frontend/index.html
    ├── ./frontend/package.json
    ├── ./frontend/postcss.config.js
    ├── ./frontend/src
    │   ├── ./frontend/src/App.jsx
    │   ├── ./frontend/src/assets
    │   │   ├── ./frontend/src/assets/assets.js
    │   │   ├── ./frontend/src/assets/buysell.jpeg
    │   │   ├── ./frontend/src/assets/icon.jpg
    │   │   └── ./frontend/src/assets/logo.png
    │   ├── ./frontend/src/components
    │   │   └── ./frontend/src/components/Navbar.jsx
    │   ├── ./frontend/src/index.css
    │   ├── ./frontend/src/main.jsx
    │   └── ./frontend/src/pages
    │       ├── ./frontend/src/pages/Buy.jsx
    │       ├── ./frontend/src/pages/Cart.jsx
    │       ├── ./frontend/src/pages/Chat.jsx
    │       ├── ./frontend/src/pages/Deliver.jsx
    │       ├── ./frontend/src/pages/Home.jsx
    │       ├── ./frontend/src/pages/Login.jsx
    │       ├── ./frontend/src/pages/Orders.jsx
    │       ├── ./frontend/src/pages/Product.jsx
    │       ├── ./frontend/src/pages/Profile.jsx
    │       ├── ./frontend/src/pages/Register.jsx
    │       └── ./frontend/src/pages/Sell.jsx
    ├── ./frontend/tailwind.config.js
    └── ./frontend/vite.config.js
```

## Features
- **Authentication**: Secure user login and registration with JWT authentication and password hashing.
- **Product Listings**: Users can list, edit, and remove items they wish to sell.
- **Search & Filters**: Buyers can search for products and filter them based on categories.
- **Order Management**: Secure transactions with OTP verification for delivery.
- **Cart System**: Buyers can add items to the cart and place bulk orders.
- **User Profiles**: Users can update their details and view seller reviews.
- **Order History**: Track bought and sold items.
- **AI Chat Support**: Automated chatbot for user queries.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT), bcrypt.js
- **Additional Tools**: ESLint, Prettier, Vite for frontend optimization

## Environment Variables
### Frontend
Create a `.env` file inside the frontend directory with the following:
```
VITE_SITE_KEY=your_google_recaptcha_v2_site_key
```

### Backend
Create a `.env` file inside the backend directory with the following:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SITE_KEY=your_google_recaptcha_v2_site_key
SECRET_KEY=your_google_recaptcha_v2_secret_key
GEMINI_API_KEY=your_gemini_chatbot_api_key
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/firearc7/Buy-Sell-Marketplace.git
   cd buy-sell-marketplace
   ```
2. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Start the backend server:
   ```bash
   cd backend && npm start
   ```
4. Start the frontend application:
   ```bash
   cd frontend && npm run dev
   ```
