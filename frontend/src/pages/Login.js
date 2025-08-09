import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/AuthService';
import '../styles/auth.css';
import { GoogleLogin } from '@react-oauth/google';

// Define your Google client ID
const googleClientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual client ID

/**
 * Login component - Handles user authentication
 */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // If user is already logged in, redirect to the intended page
    if (authService.isAuthenticated()) {
      navigate(from);
    }
  }, [navigate, from]);
  
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      setGeneralError('');
      
      if (credentialResponse.credential) {
        await authService.loginWithGoogle(credentialResponse.credential);
        navigate(from);
      } else {
        throw new Error('Google authentication failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setGeneralError(error.message || 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };
  
  const handleGoogleError = () => {
    setGeneralError('Google login failed. Please try again.');
    setGoogleLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setGeneralError('');
    
    try {
      await authService.login(formData.email, formData.password);
      
      // Redirect to the page the user was trying to access or home
      navigate(from);
    } catch (error) {
      console.error('Login error:', error);
      setGeneralError(error.message || 'Falha no login. Verifique suas credenciais e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login</h1>
          <p>Entre com sua conta para acessar o MedicinaHub</p>
        </div>
        
        {generalError && (
          <div className="auth-error">
            {generalError}
          </div>
        )}
        
        {/* Google Sign-In Button */}
        <div className="google-signin-container">
          <GoogleLogin
            clientId={googleClientId}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            shape="rectangular"
            text="signin_with"
            theme="outline"
            width="100%"
          />
          {googleLoading && <div className="loader-small"></div>}
        </div>
        
        <div className="auth-divider">
          <span>ou</span>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="seu@email.com"
              autoComplete="email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Sua senha"
              autoComplete="current-password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className="form-group form-actions">
            <div className="remember-forgot">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Lembrar-me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Esqueceu a senha?
              </Link>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 