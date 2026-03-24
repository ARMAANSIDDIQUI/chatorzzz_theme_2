import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CurtainLoader from './components/CurtainLoader';
import CustomCursor from './components/CustomCursor';
import CursorSwitcher from './components/CursorSwitcher';
import ScrollToTop from './components/ScrollToTop';
import AutoScrollToTop from './components/AutoScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Product = lazy(() => import('./pages/Product'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const OurStory = lazy(() => import('./pages/OurStory'));
const PrivacyPolicy = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.TermsOfService })));
const ShippingInfo = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.ShippingInfo })));
const Returns = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.Returns })));
const BackgroundEmojis = lazy(() => import('./components/BackgroundEmojis'));

const BackgroundEmojiWrapper = () => {
  return <BackgroundEmojis />;
};

import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (user && user.role === 'admin') ? children : <Navigate to="/" />;
};

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-fuchsia-500 font-bold text-2xl animate-pulse italic">Loading Experience...</div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/story" element={<OurStory />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/returns" element={<Returns />} />
          
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AutoScrollToTop />
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Global animated background elements - Hidden on mobile for performance */}
        <div className="fixed inset-0 pointer-events-none z-0 hidden md:block">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-300/30 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-300/30 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <Navbar />
        <CustomCursor />
        <CursorSwitcher />
        <ScrollToTop />
        <CurtainLoader />
        <BackgroundEmojiWrapper />
        <main className="flex-grow z-10">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}
