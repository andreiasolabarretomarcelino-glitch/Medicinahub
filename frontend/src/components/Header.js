// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/header.css';
import logoImage from '../assets/Medicinahublogo.png';

/**
 * Header component
 * Displays the site header with navigation and user authentication options
 */
const Header = () => {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check authentication status on mount and when auth state changes
  useEffect(() => {
    const currentUser = AuthService.getUser();
    setUser(currentUser);
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      setUser(AuthService.getUser());
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  // Handle logout
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setUserMenuOpen(false);
    navigate('/');
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };
  
  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-button') && !event.target.closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
      
      if (userMenuOpen && !event.target.closest('.user-menu-button') && !event.target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen, userMenuOpen]);
  
  // Close mobile menu when window is resized above mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);
  
  return (
    <header className={`site-header ${scrolled ? 'scrolled-down' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <img src={logoImage} alt="MedicinaHub Logo" />
              <span>MedicinaHub</span>
            </Link>
          </div>
          
          <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <ul className="nav-links">
              <li><Link to="/" onClick={() => setMobileMenuOpen(false)}><i className="fas fa-home"></i> Home</Link></li>
              <li><Link to="/congressos" onClick={() => setMobileMenuOpen(false)}><i className="fas fa-calendar-day"></i> Congressos</Link></li>
              <li><Link to="/residencia" onClick={() => setMobileMenuOpen(false)}><i className="fas fa-hospital"></i> Residência</Link></li>
              <li><Link to="/portal" onClick={() => setMobileMenuOpen(false)}><i className="fas fa-newspaper"></i> Portal</Link></li>
              <li>
                <Link to="/pesquisahub" onClick={() => setMobileMenuOpen(false)}>
                  <i className="fas fa-microscope"></i> PesquisaHub
                </Link>
              </li>
            </ul>
            
            {mobileMenuOpen && (
              <div className="mobile-auth-buttons">
                {!user ? (
                  <div className="auth-buttons">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline">Entrar</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">Cadastrar</Link>
                  </div>
                ) : null}
              </div>
            )}
          </nav>
          
          <div className="header-actions">
            {user ? (
              <div className="user-menu-container">
                <button 
                  className="user-menu-button"
                  onClick={toggleUserMenu}
                  aria-expanded={userMenuOpen}
                  aria-label="User menu"
                >
                  <span className="user-name">{user.name.split(' ')[0]}</span>
                  <i className={`fas fa-chevron-${userMenuOpen ? 'up' : 'down'}`}></i>
                </button>
                
                {userMenuOpen && (
                  <div className="user-menu">
                    <div className="user-menu-header">
                      <span className="user-full-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                    <ul className="user-menu-items">
                      <li>
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                          <i className="fas fa-user"></i> Meu Perfil
                        </Link>
                      </li>
                      {user.role === 'admin' && (
                        <li>
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)}>
                            <i className="fas fa-cog"></i> Admin Panel
                          </Link>
                        </li>
                      )}
                      <li>
                        <button onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt"></i> Sair
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons desktop-only">
                <Link to="/login" className="btn btn-outline">Entrar</Link>
                <Link to="/register" className="btn btn-primary">Cadastrar</Link>
              </div>
            )}
            
            <button 
              className="mobile-menu-button" 
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label="Mobile menu"
            >
              <i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
