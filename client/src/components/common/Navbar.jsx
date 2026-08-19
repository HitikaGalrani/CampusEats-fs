import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import {
  Utensils,
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  Bell,
  Menu as MenuIcon,
  X,
  History,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logoutUser } = useAuth();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-amber-700 to-amber-500 bg-clip-text text-transparent">
                CampusEats
              </span>
              <span className="block text-[10px] font-semibold text-amber-700 -mt-1 tracking-wider uppercase">
                Smart Canteen
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 font-medium text-slate-600">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                isActive('/')
                  ? 'bg-amber-50 text-amber-800 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                isActive('/menu')
                  ? 'bg-amber-50 text-amber-800 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Explore Menu
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/orders"
                  className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/orders')
                      ? 'bg-amber-50 text-amber-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  My Orders
                </Link>
                <Link
                  to="/live-tracking"
                  className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/live-tracking')
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  Live Tracker ⚡
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Portal
              </Link>
            )}
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center gap-3">
            
            {/* Cart Icon */}
            {!isAdmin && (
              <Link
                to="/cart"
                className="relative p-2.5 text-slate-700 hover:text-amber-800 hover:bg-slate-100/80 rounded-xl transition-all"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-amber-500/30 animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Notifications Icon */}
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="p-2.5 text-slate-700 hover:text-amber-800 hover:bg-slate-100/80 rounded-xl transition-all"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </Link>
            )}

            {/* Authenticated User Menu Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-amber-400 bg-white shadow-sm transition-all focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 hidden sm:inline-block max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-md uppercase tracking-wider">
                        {user?.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {isAdmin ? (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-800" />
                            Admin Dashboard
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-800" />
                            Student Dashboard
                          </Link>
                          <Link
                            to="/orders"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <History className="w-4 h-4 text-amber-800" />
                            Order History
                          </Link>
                        </>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 text-amber-800" />
                        Profile Settings
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-amber-50 hover:text-amber-800"
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-amber-50 hover:text-amber-800"
          >
            Explore Menu
          </Link>
          {isAuthenticated && !isAdmin && (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-amber-50 hover:text-amber-800"
              >
                My Orders
              </Link>
              <Link
                to="/live-tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 font-semibold"
              >
                Live Order Tracker ⚡
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-amber-800 font-bold bg-amber-50"
            >
              Admin Portal
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
