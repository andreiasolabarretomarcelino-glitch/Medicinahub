// src/components/CongressCard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getDaysDifference } from '../utils/dateUtils';
import { isFollowingCongress, followCongress, unfollowCongress } from '../services/CongressService';
import AuthService from '../services/AuthService';

const CongressCard = ({ congress }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState(null);
  const [followSuccess, setFollowSuccess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Handle possible different property names (name vs title)
  const congressName = congress.name || congress.title || 'Congresso';
  const eventDate = formatDate(congress.event_date);
  const daysToEvent = getDaysDifference(congress.event_date);
  
  // Get registration status if available
  const registrationStart = congress.registration_start ? formatDate(congress.registration_start) : null;
  const registrationEnd = congress.registration_end ? formatDate(congress.registration_end) : null;
  const daysToRegStart = congress.registration_start ? getDaysDifference(congress.registration_start) : null;
  const daysToRegEnd = congress.registration_end ? getDaysDifference(congress.registration_end) : null;

  // Calculate registration status (commented out for future use)
  // const now = new Date();
  // const regStartDate = congress.registration_start ? new Date(congress.registration_start) : null;
  // const regEndDate = congress.registration_end ? new Date(congress.registration_end) : null;
  
  // Registration status variables for future UI improvements
  // let registrationStatusMessage = 'Não informado';
  // let registrationStatusClass = '';
  
  // if (regStartDate && regEndDate) {
  //   if (now < regStartDate) {
  //     registrationStatusMessage = 'Inscrições em breve';
  //     registrationStatusClass = 'reg-future';
  //   } else if (now >= regStartDate && now <= regEndDate) {
  //     registrationStatusMessage = 'Inscrições abertas';
  //     registrationStatusClass = 'reg-open';
  //   } else {
  //     registrationStatusMessage = 'Inscrições encerradas';
  //     registrationStatusClass = 'reg-closed';
  //   }
  // }

  // Check if user is logged in and if they're following the congress
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await AuthService.isAuthenticated();
      setIsAuthenticated(auth);
      
      if (auth) {
        try {
          const following = await isFollowingCongress(congress.id);
          setIsFollowing(following);
        } catch (error) {
          console.error('Error checking follow status:', error);
        }
      }
    };
    
    checkAuth();
  }, [congress.id]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    setFollowLoading(true);
    setFollowError(null);
    setFollowSuccess(null);
    
    try {
      if (isFollowing) {
        await unfollowCongress(congress.id);
        setIsFollowing(false);
        setFollowSuccess('Você deixou de seguir este congresso.');
      } else {
        await followCongress(congress.id);
        setIsFollowing(true);
        setFollowSuccess('Você está seguindo este congresso!');
      }
    } catch (error) {
      setFollowError('Erro ao atualizar o status de seguir. Tente novamente.');
      console.error('Follow error:', error);
    } finally {
      setFollowLoading(false);
      
      // Clear success/error messages after 3 seconds
      setTimeout(() => {
        setFollowSuccess(null);
        setFollowError(null);
      }, 3000);
    }
  };

  return (
    <div className="congress-card">
      <h3>{congressName}</h3>
      
      <div className="congress-details">
        <p><i className="fas fa-map-marker-alt"></i> <strong>Estado:</strong> {congress.state}</p>
        <p><i className="fas fa-stethoscope"></i> <strong>Especialidade:</strong> {congress.specialty}</p>
        <p><i className="fas fa-calendar-day"></i> <strong>Data do Evento:</strong> {eventDate}</p>
        
        {registrationStart && (
          <p><i className="fas fa-calendar-plus"></i> <strong>Início das Inscrições:</strong> {registrationStart}</p>
        )}
        
        {registrationEnd && (
          <p><i className="fas fa-calendar-minus"></i> <strong>Término das Inscrições:</strong> {registrationEnd}</p>
        )}
      </div>
      
      <div className="congress-status">
        <div className="countdown">
          <i className="fas fa-clock"></i> <strong>Evento em:</strong> {daysToEvent}
        </div>
        
        {daysToRegStart && daysToRegStart !== "Encerrado" && daysToRegStart !== "Data inválida" && (
          <div className="reg-status reg-start">
            <i className="fas fa-ticket-alt"></i> Inscrições começam em: {daysToRegStart}
          </div>
        )}
        
        {daysToRegEnd && daysToRegEnd !== "Encerrado" && daysToRegEnd !== "Data inválida" && (
          <div className="reg-status reg-end">
            <i className="fas fa-exclamation-circle"></i> Inscrições terminam em: {daysToRegEnd}
          </div>
        )}
        
        {/* Registration status will be displayed here in the future */}
      </div>
      
      <div className="congress-actions">
        {congress.website && (
          <a 
            href={congress.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <i className="fas fa-external-link-alt"></i> Saiba Mais
          </a>
        )}
        
        <button 
          onClick={handleFollowToggle}
          disabled={followLoading}
          className={`btn ${isFollowing ? 'btn-secondary' : 'btn-outline'}`}
        >
          {followLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : isFollowing ? (
            <>
              <i className="fas fa-heart"></i> Seguindo
            </>
          ) : (
            <>
              <i className="far fa-heart"></i> Seguir
            </>
          )}
        </button>
      </div>
      
      {/* Success/Error Messages */}
      {followSuccess && (
        <div className="alert alert-success">
          {followSuccess}
        </div>
      )}
      
      {followError && (
        <div className="alert alert-error">
          {followError}
        </div>
      )}
      
      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="login-prompt">
          <p>Faça login para seguir congressos</p>
          <Link to="/login" className="btn btn-primary">
            Fazer Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default CongressCard;
