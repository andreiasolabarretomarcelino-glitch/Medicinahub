// src/components/Navigation.js
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  
  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // Set scrolled state (for styling)
      setScrolled(currentScrollPos > 10);
      
      // Set visible state based on scroll direction
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      
      // Update previous scroll position
      setPrevScrollPos(currentScrollPos);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);
  
  // Function to determine active class
  const activeStyle = ({ isActive }) => 
    isActive ? 'active' : '';

  return (
    <nav className={`${!visible ? 'nav-up' : ''} ${scrolled ? 'with-header' : ''}`}>
      <div className="container">
        <ul>
          <li>
            <NavLink to="/" className={activeStyle}>
              <i className="fas fa-home"></i> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/congressos" className={activeStyle}>
              <i className="fas fa-calendar-alt"></i> Congressos
            </NavLink>
          </li>
          <li>
            <NavLink to="/residencia" className={activeStyle}>
              <i className="fas fa-user-md"></i> Residência
            </NavLink>
          </li>
          <li>
            <NavLink to="/pesquisahub" className={activeStyle}>
              <i className="fas fa-microscope"></i> PesquisaHub
            </NavLink>
          </li>
          <li>
            <NavLink to="/portal" className={activeStyle}>
              <i className="fas fa-graduation-cap"></i> Portal
            </NavLink>
          </li>
          <li>
            <NavLink to="/prescricoes" className={activeStyle}>
              <i className="fas fa-pills"></i> Prescrições
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
