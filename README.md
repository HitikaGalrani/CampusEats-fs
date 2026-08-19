# CampusEats – Smart College Canteen 🍔⚡

> **"Good Food. Less Waiting."**  
> CampusEats is a modern full-stack college canteen food ordering application with **real-time order tracking** powered by WebSockets (Socket.IO), Redux Toolkit, React, Tailwind CSS, Express, Node.js, and MongoDB Mongoose.

---

## 🌟 Technical Highlights (10 Core Requirements)

1. **Responsive React UI**: Styled with Tailwind CSS & glassmorphism.
2. **React Hooks**: Fulfills `useState`, `useEffect`, `useMemo`, and custom hooks (`useAuth`, `useSocket`).
3. **Redux Toolkit**: Centralized global state management for Auth, Cart, Menu, and Live Orders.
4. **REST APIs + MongoDB + Mongoose**: Complete database models for User, MenuItem, Category, Order, Rating, and Notification.
5. **Secure REST APIs**: Includes input validation, error handling, and security middleware.
6. **JWT Authentication**: Role-based access control with `USER` (Student) and `ADMIN` roles.
7. **Docker**: Production-grade Dockerfiles for both client (Nginx) and server (Node).
8. **WebSockets via Socket.IO**: Real-time bidirectional order updates without page refresh.
9. **Docker Compose**: One-command orchestration (`docker compose up --build`).
10. **GitHub Actions CI/CD**: Ready for automated build checks, Vercel frontend, and Render backend deployment.

---

## 🚀 Key Features

### 👨‍🎓 Student / User Features
- **Authentication**: Register, Login, Logout, Profile view.
- **Menu Browsing**: Search food by name, filter by category, sort by price (INR) or rating, filter sold-out items.
- **Food Details**: View rating breakdowns, reviews, and post ratings/comments.
- **Redux Shopping Cart**: Add/remove food, adjust quantities, calculate subtotal, taxes (5% GST), and total INR.
- **Checkout & Place Order**: Select campus pickup location, enter special instructions, and select "Pay at Canteen".
- **Real-Time Order Tracking**: 5-Stage visual order status pipeline (`PLACED` → `CONFIRMED` → `PREPARING` → `READY` → `COMPLETED`).
- **Live Notifications**: Instant banner alert *"🎉 Your order is ready for pickup!"* when status changes to `READY` without refreshing.

### 🛡️ Admin Features
- **Admin Dashboard**: Real-time stats (Today's Orders count, Today's Revenue in INR, Pending Orders, Preparing Orders, Ready Orders).
- **Live Order Feed**: Instant incoming order notification & status update dropdowns via Socket.IO.
- **Menu CRUD**: Add, edit, delete menu items, and toggle food availability (Available 🟢 vs SOLD OUT 🔴).
- **Category CRUD**: Manage food categories (Breakfast, Lunch, Snacks, Beverages, Desserts).
- **User Management**: Inspect registered student accounts.
- **Review Moderation**: View & delete customer ratings.

---

## 🔑 Demo Admin & Student Credentials

The database seeder automatically populates the following test accounts:

| Role | Email | Password | Description |
|---|---|---|---|
| **ADMIN** | `admin@campuseats.edu` | `admin123` | Canteen Admin Portal Access |
| **USER** | `rahul@college.edu` | `student123` | Student Account 1 |
| **USER** | `priya@college.edu` | `student123` | Student Account 2 |
| **USER** | `amit@college.edu` | `student123` | Student Account 3 |

---

## 📂 Project Structure

```
CampusEats/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute, FoodCard, OrderStatusTracker
│   │   ├── hooks/              # useAuth, useSocket
│   │   ├── pages/              # Home, Menu, FoodDetails, CartPage, CheckoutPage, LiveOrderTracking...
│   │   │   └── admin/          # AdminDashboard, ManageMenu, AddEditMenuItem, ManageCategories, ManageOrders...
│   │   ├── services/           # api.js (Axios with JWT interceptor)
│   │   ├── store/              # store.js & slices (authSlice, cartSlice, orderSlice, menuSlice)
│   │   ├── App.jsx             # React Router definitions
│   │   └── main.jsx            # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── server/                     # Express + Socket.IO + Mongoose Backend
│   ├── config/                 # db.js (Mongoose connection)
│   ├── controllers/            # authController, menuController, orderController, adminController...
│   ├── middleware/             # authMiddleware (JWT & adminOnly), errorMiddleware
│   ├── models/                 # User, MenuItem, Category, Order, Rating, Notification
│   ├── routes/                 # Express API routes
│   ├── services/               # socketService.js (Socket.IO event handlers)
│   ├── seed/                   # seed.js (DB seeder script)
│   ├── server.js               # HTTP & Socket.IO server
│   ├── Dockerfile
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI Workflow
│
├── docker-compose.yml          # Multi-container orchestration (Frontend, Backend, MongoDB)
├── .env.example                # Environment variables template
└── README.md                   # Full documentation
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or v20)
- MongoDB running locally OR a free MongoDB Atlas connection string.

### 2. Environment Variables Setup
Create `.env` inside `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campuseats
JWT_SECRET=campuseats_secret_jwt_key_2026_super_secure
NODE_ENV=development
```

Create `.env` inside `client/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Install & Seed Database
```bash
# Backend Setup
cd server
npm install
npm run seed     # Populates 10 menu items, 5 categories, 1 admin, 3 students, 5 orders

# Frontend Setup
cd ../client
npm install
```

### 4. Run Locally
Start backend server (Terminal 1):
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

Start frontend client (Terminal 2):
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

---

## 🐳 Running with Docker & Docker Compose

Run the entire application stack (React Frontend, Express Backend, MongoDB) with a single command:

```bash
docker compose up --build
```

Access services:
- **Frontend App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000/api`
- **MongoDB**: `localhost:27017`

Stop containers:
```bash
docker compose down
```

---

## 🔌 API & WebSocket Documentation

### REST API Endpoints

#### Authentication
- `POST /api/auth/register` - Create student account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Fetch profile (Protected)

#### Menu & Categories
- `GET /api/menu` - Fetch menu with search, category, sort (`price-asc`, `rating-desc`), & availability filters
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)
- `PATCH /api/menu/:id/toggle-availability` - Toggle Available 🟢 vs SOLD OUT 🔴 (Admin)
- `GET /api/categories` - Fetch categories
- `POST /api/categories` - Create category (Admin)

#### Orders & Real-Time Tracking
- `POST /api/orders` - Place order & emit `newOrder` WebSocket event to Admin
- `GET /api/orders` - Get logged-in user order history
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update status & emit `orderStatusUpdated` WebSocket event to Student (Admin)

#### Admin Portal
- `GET /api/admin/dashboard` - Get revenue, order status counts & recent orders
- `GET /api/admin/orders` - Get all canteen orders
- `GET /api/admin/users` - Get registered student list

### WebSocket Events (Socket.IO)

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `join_admin` | Client -> Server | None | Admin joins `admin` room |
| `join_order` | Client -> Server | `orderId` | Student joins `order_{id}` room |
| `newOrder` | Server -> Client | `order` | Sent to `admin` room when a student places order |
| `orderStatusUpdated` | Server -> Client | `{ orderId, status }` | Broadcast to `order_{id}` room when status changes |
| `orderReady` | Server -> Client | `{ message, orderId }` | Triggered when admin marks status as `READY` |

---

## 🌐 Production Deployment Guide

### Vercel (Frontend)
1. Push `client` directory to GitHub repository.
2. Import project into Vercel and select Root Directory as `client`.
3. Add Environment Variables:
   - `VITE_API_URL` = `https://your-render-backend.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://your-render-backend.onrender.com`

### Render (Backend)
1. Create a Web Service on Render pointing to `server/` directory.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Add Environment Variables:
   - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster.mongodb.net/campuseats`
   - `JWT_SECRET` = `your_super_secret_jwt_key`
   - `NODE_ENV` = `production`

---

## 📜 License & Credits

Built as a college full-stack web engineering project demonstrating modern React, Redux Toolkit, Node.js, Express, MongoDB Mongoose, and Socket.IO WebSockets.
