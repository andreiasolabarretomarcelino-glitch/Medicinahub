import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';
import '../styles/auth.css';
import { GoogleLogin } from '@react-oauth/google';

// Define your Google client ID
const googleClientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual client ID

/**
 * Register component - Handles user registration
 */
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);
  
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      setGeneralError('');
      
      if (credentialResponse.credential) {
        await authService.loginWithGoogle(credentialResponse.credential);
        navigate('/');
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Você deve concordar com os termos para se registrar';
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
      // Create user data object without confirmPassword and agreeTerms
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialty: formData.specialty || null
      };
      
      await authService.register(userData);
      
      setSuccess(true);
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        specialty: '',
        agreeTerms: false
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setGeneralError(error.message || 'Falha no registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-success">
            <div className="success-icon">✓</div>
            <h2>Registro Concluído!</h2>
            <p>Sua conta foi criada com sucesso.</p>
            <p>Você será redirecionado para a página de login em instantes...</p>
            <Link to="/login" className="auth-button">
              Ir para Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Cadastro</h1>
          <p>Crie sua conta para acessar o MedicinaHub</p>
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
            text="signup_with"
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
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Seu nome completo"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
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
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="specialty">Especialidade (opcional)</label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Sua especialidade médica"
            />
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
              placeholder="Crie uma senha forte"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirme sua senha"
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          <div className="form-group checkbox-group">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms">
                Concordo com os <Link to="/terms">Termos de Uso</Link> e <Link to="/privacy">Política de Privacidade</Link>
              </label>
            </div>
            {errors.agreeTerms && <div className="error-message">{errors.agreeTerms}</div>}
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 