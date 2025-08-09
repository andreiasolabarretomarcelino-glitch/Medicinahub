import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';
import '../styles/userProfile.css';

/**
 * UserProfile component - Displays and allows editing of user profile information
 */
const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    specialty: '',
    institution: '',
    bio: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Following states
  const [followedCongresses, setFollowedCongresses] = useState([]);
  const [followedResidencies, setFollowedResidencies] = useState([]);
  const [loadingFollowed, setLoadingFollowed] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get user data
    const userData = authService.getUser();
    if (userData) {
      setUser(userData);
      setProfileForm({
        name: userData.name || '',
        email: userData.email || '',
        specialty: userData.specialty || '',
        institution: userData.institution || '',
        bio: userData.bio || ''
      });
      setLoading(false);
    }

    // Fetch followed items
    fetchFollowedItems();
  }, [navigate]);

  const fetchFollowedItems = async () => {
    setLoadingFollowed(true);
    try {
      // In a real app, these would be API calls
      // For now, we'll use mock data
      setTimeout(() => {
        setFollowedCongresses([
          { id: 1, title: 'Congresso Brasileiro de Cardiologia 2023', date: '2023-10-15', location: 'São Paulo, SP' },
          { id: 2, title: 'Simpósio Internacional de Neurologia', date: '2023-11-20', location: 'Rio de Janeiro, RJ' }
        ]);
        
        setFollowedResidencies([
          { id: 1, title: 'Residência em Clínica Médica - Hospital das Clínicas', institution: 'USP', deadline: '2023-12-01' },
          { id: 2, title: 'Programa de Residência em Pediatria', institution: 'UNIFESP', deadline: '2023-11-15' }
        ]);
        
        setLoadingFollowed(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching followed items:', error);
      setLoadingFollowed(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // In a real app, this would call the API
      await authService.updateProfile(profileForm);
      
      setMessage({
        type: 'success',
        text: 'Perfil atualizado com sucesso!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao atualizar perfil. Tente novamente.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'As senhas não coincidem.'
      });
      return;
    }
    
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // In a real app, this would call the API
      await authService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage({
        type: 'success',
        text: 'Senha alterada com sucesso!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao alterar senha. Verifique sua senha atual e tente novamente.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUnfollow = async (type, id) => {
    try {
      // In a real app, this would call the API
      // For now, we'll just update the state
      if (type === 'congress') {
        setFollowedCongresses(prev => 
          prev.filter(congress => congress.id !== id)
        );
      } else if (type === 'residency') {
        setFollowedResidencies(prev => 
          prev.filter(residency => residency.id !== id)
        );
      }
    } catch (error) {
      console.error(`Error unfollowing ${type}:`, error);
    }
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="loading-spinner">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <h1>{user.name || 'Usuário'}</h1>
        <p>{user.email}</p>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Perfil
        </button>
        <button 
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Alterar Senha
        </button>
        <button 
          className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Seguindo
        </button>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}

      <div className="profile-content">
        {activeTab === 'profile' && (
          <form className="profile-form" onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                required
                disabled
              />
              <small>O email não pode ser alterado.</small>
            </div>

            <div className="form-group">
              <label htmlFor="specialty">Especialidade</label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={profileForm.specialty}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="institution">Instituição</label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={profileForm.institution}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Biografia</label>
              <textarea
                id="bio"
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                rows="4"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        )}

        {activeTab === 'password' && (
          <form className="password-form" onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Senha Atual</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nova Senha</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="8"
              />
              <small>A senha deve ter pelo menos 8 caracteres.</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="8"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </form>
        )}

        {activeTab === 'following' && (
          <div className="following-content">
            {loadingFollowed ? (
              <div className="loading-spinner">Carregando itens seguidos...</div>
            ) : (
              <>
                <div className="followed-section">
                  <h3>Congressos Seguidos</h3>
                  {followedCongresses.length === 0 ? (
                    <p className="no-items">Você não está seguindo nenhum congresso.</p>
                  ) : (
                    <div className="followed-items">
                      {followedCongresses.map(congress => (
                        <div className="followed-item" key={congress.id}>
                          <div className="item-info">
                            <h4>
                              <Link to={`/congressos/${congress.id}`}>{congress.title}</Link>
                            </h4>
                            <p>
                              <span className="item-date">{congress.date}</span> • 
                              <span className="item-location">{congress.location}</span>
                            </p>
                          </div>
                          <button 
                            className="unfollow-btn"
                            onClick={() => handleUnfollow('congress', congress.id)}
                          >
                            Deixar de seguir
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="followed-section">
                  <h3>Residências Seguidas</h3>
                  {followedResidencies.length === 0 ? (
                    <p className="no-items">Você não está seguindo nenhuma residência.</p>
                  ) : (
                    <div className="followed-items">
                      {followedResidencies.map(residency => (
                        <div className="followed-item" key={residency.id}>
                          <div className="item-info">
                            <h4>
                              <Link to={`/residencias/${residency.id}`}>{residency.title}</Link>
                            </h4>
                            <p>
                              <span className="item-institution">{residency.institution}</span> • 
                              <span className="item-deadline">Prazo: {residency.deadline}</span>
                            </p>
                          </div>
                          <button 
                            className="unfollow-btn"
                            onClick={() => handleUnfollow('residency', residency.id)}
                          >
                            Deixar de seguir
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 