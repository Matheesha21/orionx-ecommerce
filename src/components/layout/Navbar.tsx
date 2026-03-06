import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../ui/SearchBar';
const LOGO_URL = "/WhatsApp_Image_2025-08-21_at_12.50.56_(1).jpg";

const navLinks = [
{
  label: 'Home',
  href: '/'
},
{
  label: 'Shop',
  href: '/shop'
},
{
  label: 'About',
  href: '/about'
},
{
  label: 'Contact',
  href: '/contact'
},
{
  label: 'Get Quote',
  href: '/quote'
}];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-lg border-b border-border shadow-soft' : 'bg-transparent'}`}>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={LOGO_URL} alt="ORIONX" className="h-8 md:h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors ${location.pathname === link.href ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>

                {link.label}
              </Link>
            )}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Wishlist">

              <HeartIcon className="w-5 h-5 md:w-6 md:h-6" />
              {wishlistCount > 0 &&
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                  {wishlistCount}
                </span>
              }
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Shopping cart">

              <ShoppingCartIcon className="w-5 h-5 md:w-6 md:h-6" />
              {cartCount > 0 &&
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full">
                  {cartCount}
                </span>
              }
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="User menu">

                {user?.avatar ?
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover" /> :


                <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                }
                <ChevronDownIcon className="hidden md:block w-4 h-4" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    opacity: 0,
                    y: 10
                  }}
                  transition={{
                    duration: 0.2
                  }}
                  className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-lg shadow-xl overflow-hidden">

                    {isAuthenticated ?
                  <>
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-medium text-text-primary">
                            {user?.name}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {user?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors">

                            <UserIcon className="w-4 h-4" />
                            My Profile
                          </Link>
                          <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors">

                            <PackageIcon className="w-4 h-4" />
                            My Orders
                          </Link>
                          {isAdmin &&
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors">

                              <LayoutDashboardIcon className="w-4 h-4" />
                              Admin Dashboard
                            </Link>
                      }
                          <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors">

                            <SettingsIcon className="w-4 h-4" />
                            Settings
                          </Link>
                        </div>
                        <div className="border-t border-border py-2">
                          <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-surface-elevated transition-colors">

                            <LogOutIcon className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </> :

                  <div className="py-2">
                        <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors">

                          Sign In
                        </Link>
                        <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors">

                          Create Account
                        </Link>
                      </div>
                  }
                  </motion.div>
                }
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Toggle menu">

              {isMobileMenuOpen ?
              <XIcon className="w-6 h-6" /> :

              <MenuIcon className="w-6 h-6" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen &&
          <motion.div
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: 'auto'
            }}
            exit={{
              opacity: 0,
              height: 0
            }}
            transition={{
              duration: 0.3
            }}
            className="md:hidden overflow-hidden">

              <div className="py-4 border-t border-border">
                {/* Mobile Search */}
                <div className="mb-4">
                  <SearchBar
                  isMobile
                  onClose={() => setIsMobileMenuOpen(false)} />

                </div>

                {/* Mobile Nav Links */}
                <div className="space-y-1">
                  {navLinks.map((link) =>
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${location.pathname === link.href ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'}`}>

                      {link.label}
                    </Link>
                )}
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </nav>
    </header>);

}