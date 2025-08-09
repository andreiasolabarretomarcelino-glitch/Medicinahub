// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3 className="footer-title">MedicinaHub</h3>
            <p>
              Sua plataforma completa para informações sobre congressos médicos e programas de residência.
              Conectando estudantes e profissionais de medicina com as melhores oportunidades.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section links">
            <h3 className="footer-title">Links Rápidos</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/congressos">Congressos</Link></li>
              <li><Link to="/residencia">Residências</Link></li>
              <li><Link to="/portal">Portal</Link></li>
              <li><Link to="/pesquisahub">PesquisaHub <span className="coming-soon-badge">Em breve</span></Link></li>
              <li><Link to="/sobre">Sobre Nós</Link></li>
            </ul>
          </div>
          
          <div className="footer-section contact">
            <h3 className="footer-title">Contato</h3>
            <ul className="contact-info">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>São Paulo, SP - Brasil</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>contato@medicinahub.com.br</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>(11) 99999-9999</span>
              </li>
            </ul>
          </div>
          
          <div className="footer-section newsletter">
            <h3 className="footer-title">Newsletter</h3>
            <p>Inscreva-se para receber atualizações sobre novos congressos e residências.</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Seu email" 
                required 
              />
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} MedicinaHub. Todos os direitos reservados.
          </div>
          <div className="footer-bottom-links">
            <Link to="/privacidade">Política de Privacidade</Link>
            <Link to="/cookies">Política de Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
