import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('chatorzzz_user');
    const storedToken = localStorage.getItem('chatorzzz_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, data } = response.data;
      
      localStorage.setItem('chatorzzz_token', token);
      localStorage.setItem('chatorzzz_user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(data.user);
      toast.success('Welcome back to Chatorzzz!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);
      toast.success(response.data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      const { token, data } = response.data;
      
      localStorage.setItem('chatorzzz_token', token);
      localStorage.setItem('chatorzzz_user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(data.user);
      toast.success('Account verified and logged in!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      return false;
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await axios.post('/api/auth/google-login', { credential });
      const { token, data } = response.data;
      
      localStorage.setItem('chatorzzz_token', token);
      localStorage.setItem('chatorzzz_user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(data.user);
      toast.success('Logged in with Google!');
      return true;
    } catch (error) {
      toast.error('Google login failed');
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      toast.success(response.data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
      return false;
    }
  };

  const resetPassword = async (resetData) => {
    try {
      const response = await axios.post('/api/auth/reset-password', resetData);
      const { token, data } = response.data;
      
      localStorage.setItem('chatorzzz_token', token);
      localStorage.setItem('chatorzzz_user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(data.user);
      toast.success('Password reset and logged in!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('chatorzzz_token');
    localStorage.removeItem('chatorzzz_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verifyOTP, googleLogin, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
