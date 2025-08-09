import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Components
import Home from './pages/Home';
import Congressos from './pages/Congressos';
import Residencia from './pages/Residencia';
import Portal from './pages/Portal';
import ArticleDetail from './components/ArticleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import PesquisaHub from './pages/PesquisaHub';

// Admin components
import AdminArticleList from './components/admin/AdminArticleList';
import ArticleEditor from './components/admin/ArticleEditor';

/**
 * Routes configuration
 * Defines all application routes
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/congressos" element={<Congressos />} />
      <Route path="/residencia" element={<Residencia />} />
      <Route path="/portal" element={<Portal />} />
      
      {/* Article routes - support both slug and ID based routing */}
      <Route path="/portal/artigo/:slug" element={<ArticleDetail />} />
      <Route path="/portal/artigo/id/:id" element={<ArticleDetail />} />
      
      <Route path="/pesquisahub" element={<PesquisaHub />} />
      
      {/* Information Pages */}
      <Route path="/sobre" element={<About />} />
      <Route path="/privacidade" element={<PrivacyPolicy />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/articles" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminArticleList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/articles/new" 
        element={
          <ProtectedRoute adminOnly={true}>
            <ArticleEditor />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/articles/edit/:id" 
        element={
          <ProtectedRoute adminOnly={true}>
            <ArticleEditor />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect /admin to /admin/articles */}
      <Route path="/admin" element={<Navigate to="/admin/articles" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 