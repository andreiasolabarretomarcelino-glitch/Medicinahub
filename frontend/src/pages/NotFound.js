import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/notFound.css';

/**
 * NotFound component - Displays a 404 error page when a route is not found
 */
const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1>Página Não Encontrada</h1>
        <p>
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            Voltar para a Página Inicial
          </Link>
          <Link to="/portal" className="btn-outline">
            Explorar o Portal
          </Link>
        </div>
        <div className="not-found-suggestions">
          <h3>Você pode estar procurando por:</h3>
          <ul>
            <li>
              <Link to="/congressos">Congressos Médicos</Link>
            </li>
            <li>
              <Link to="/residencia">Programas de Residência</Link>
            </li>
            <li>
              <Link to="/portal">Artigos e Notícias</Link>
            </li>
            <li>
              <Link to="/login">Entrar na sua conta</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 