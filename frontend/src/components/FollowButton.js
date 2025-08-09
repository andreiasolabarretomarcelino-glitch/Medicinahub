import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

/**
 * Reusable follow button for congresses and residencies
 * @param {Object} props - Component props
 * @param {string} props.itemType - 'congress' or 'residency'
 * @param {string|number} props.itemId - ID of the item to follow
 * @param {string} props.className - Optional CSS class name
 */
const FollowButton = ({ itemType, itemId, className = '' }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [redirectToAuth, setRedirectToAuth] = useState(false);

  const handleFollow = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (itemType === 'congress') {
        result = await AuthService.followCongress(itemId);
      } else if (itemType === 'residency') {
        result = await AuthService.followResidency(itemId);
      } else {
        throw new Error('Tipo de item inválido');
      }
      
      if (result.requiresAuth) {
        setRedirectToAuth(true);
        return;
      }
      
      setIsFollowing(true);
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao tentar seguir este item');
    } finally {
      setIsLoading(false);
    }
  };

  // If not authenticated and tried to follow, redirect to login
  if (redirectToAuth) {
    return (
      <div className="follow-container">
        <p className="follow-redirect-message">
          Você precisa estar logado para seguir este {itemType === 'congress' ? 'congresso' : 'programa de residência'}.
        </p>
        <div className="follow-redirect-buttons">
          <Link to="/login" className="btn btn-primary btn-sm">
            Fazer Login
          </Link>
          <Link to="/register" className="btn btn-outline btn-sm">
            Criar Conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="follow-container">
      {error && <p className="follow-error">{error}</p>}
      
      {showSuccessMessage && (
        <div className="follow-success">
          <i className="fas fa-check-circle"></i> Você está seguindo este {itemType === 'congress' ? 'congresso' : 'programa de residência'}!
        </div>
      )}
      
      <button 
        className={`follow-button ${className} ${isFollowing ? 'following' : ''}`}
        onClick={handleFollow}
        disabled={isLoading || isFollowing}
      >
        {isLoading ? (
          <><i className="fas fa-spinner fa-pulse"></i> Aguarde...</>
        ) : isFollowing ? (
          <><i className="fas fa-bell"></i> Seguindo</>
        ) : (
          <><i className="fas fa-bell"></i> Seguir</>
        )}
      </button>
    </div>
  );
};

export default FollowButton; 