import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { FoodDetails } from './pages/FoodDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// User Pages
import { UserDashboard } from './pages/UserDashboard';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LiveOrderTracking } from './pages/LiveOrderTracking';
import { OrderHistory } from './pages/OrderHistory';
import { Profile } from './pages/Profile';
import { NotificationsPage } from './pages/NotificationsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageMenu } from './pages/admin/ManageMenu';
import { AddEditMenuItem } from './pages/admin/AddEditMenuItem';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ManageOrders } from './pages/admin/ManageOrders';
import { ManageUsers } from './pages/admin/ManageUsers';
import { AdminReviews } from './pages/admin/AdminReviews';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/food/:id" element={<FoodDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/live-tracking" element={<LiveOrderTracking />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/menu" element={<ManageMenu />} />
              <Route path="/admin/menu/add" element={<AddEditMenuItem />} />
              <Route path="/admin/menu/edit/:id" element={<AddEditMenuItem />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
