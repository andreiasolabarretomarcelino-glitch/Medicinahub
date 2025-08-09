import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/adminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    congresses: 0,
    residencies: 0,
    notifications: 0
  });
  const [users, setUsers] = useState([]);
  const [congresses, setCongresses] = useState([]);
  const [residencies, setResidencies] = useState([]);
  const [notificationForm, setNotificationForm] = useState({
    type: 'congress',
    id: '',
    updateType: 'update',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const user = AuthService.getUser();
        
        if (!user) {
          navigate('/login', { state: { from: '/admin' } });
          return;
        }
        
        // Check if user is admin
        const response = await fetch('/api/admin/check-admin.php', {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        });
        
        const data = await response.json();
        
        if (!data.status || !data.is_admin) {
          navigate('/');
          return;
        }
        
        // Fetch admin dashboard data
        fetchDashboardData();
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };
    
    checkAdmin();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard.php', {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      const data = await response.json();
      
      if (data.status) {
        setStats(data.stats);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users.php', {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      const data = await response.json();
      
      if (data.status) {
        setUsers(data.users);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const fetchCongresses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/congresses.php', {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      const data = await response.json();
      
      if (data.status) {
        setCongresses(data.congresses);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching congresses:', error);
      setLoading(false);
    }
  };

  const fetchResidencies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/residencies.php', {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      const data = await response.json();
      
      if (data.status) {
        setResidencies(data.residencies);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching residencies:', error);
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Clear any form messages
    setFormErrors({});
    setFormSuccess('');
    
    // Fetch data based on tab
    switch (tab) {
      case 'users':
        fetchUsers();
        break;
      case 'congresses':
        fetchCongresses();
        break;
      case 'residencies':
        fetchResidencies();
        break;
      default:
        break;
    }
  };

  const handleNotificationInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationForm({
      ...notificationForm,
      [name]: value
    });
    
    // Clear specific error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Clear success message when user changes input
    if (formSuccess) {
      setFormSuccess('');
    }
  };

  const validateNotificationForm = () => {
    const errors = {};
    
    if (!notificationForm.id) {
      errors.id = `Selecione um ${notificationForm.type === 'congress' ? 'congresso' : 'residência'}`;
    }
    
    if (notificationForm.updateType === 'custom' && !notificationForm.message.trim()) {
      errors.message = 'Mensagem personalizada é obrigatória';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    
    if (!validateNotificationForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/send_notification.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        body: JSON.stringify({
          type: notificationForm.type,
          id: notificationForm.id,
          update_type: notificationForm.updateType,
          message: notificationForm.message
        })
      });
      
      const data = await response.json();
      
      if (data.status) {
        setFormSuccess('Notificação enviada com sucesso!');
        // Reset form
        setNotificationForm({
          ...notificationForm,
          message: ''
        });
      } else {
        setFormErrors({ general: data.message || 'Erro ao enviar notificação' });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setFormErrors({ general: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="admin-container">
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Painel de Administração</h1>
        <p>Gerencie usuários, conteúdo e notificações</p>
      </div>
      
      <div className="admin-content">
        <div className="admin-sidebar">
          <ul className="admin-nav">
            <li 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => handleTabChange('dashboard')}
            >
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </li>
            <li 
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => handleTabChange('users')}
            >
              <i className="fas fa-users"></i> Usuários
            </li>
            <li 
              className={activeTab === 'congresses' ? 'active' : ''}
              onClick={() => handleTabChange('congresses')}
            >
              <i className="fas fa-calendar-day"></i> Congressos
            </li>
            <li 
              className={activeTab === 'residencies' ? 'active' : ''}
              onClick={() => handleTabChange('residencies')}
            >
              <i className="fas fa-hospital"></i> Residências
            </li>
            <li 
              className={activeTab === 'notifications' ? 'active' : ''}
              onClick={() => handleTabChange('notifications')}
            >
              <i className="fas fa-bell"></i> Notificações
            </li>
          </ul>
        </div>
        
        <div className="admin-main">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="admin-dashboard">
              <h2>Dashboard</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-content">
                    <h3>Usuários</h3>
                    <p className="stat-value">{stats.users}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-calendar-day"></i>
                  </div>
                  <div className="stat-content">
                    <h3>Congressos</h3>
                    <p className="stat-value">{stats.congresses}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-hospital"></i>
                  </div>
                  <div className="stat-content">
                    <h3>Residências</h3>
                    <p className="stat-value">{stats.residencies}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-bell"></i>
                  </div>
                  <div className="stat-content">
                    <h3>Notificações</h3>
                    <p className="stat-value">{stats.notifications}</p>
                  </div>
                </div>
              </div>
              
              <div className="quick-actions">
                <h3>Ações Rápidas</h3>
                <div className="action-buttons">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleTabChange('users')}
                  >
                    <i className="fas fa-user-plus"></i> Gerenciar Usuários
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleTabChange('congresses')}
                  >
                    <i className="fas fa-plus-circle"></i> Adicionar Congresso
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleTabChange('residencies')}
                  >
                    <i className="fas fa-plus-circle"></i> Adicionar Residência
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleTabChange('notifications')}
                  >
                    <i className="fas fa-paper-plane"></i> Enviar Notificação
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="admin-users">
              <div className="section-header">
                <h2>Gerenciar Usuários</h2>
                <button className="btn btn-primary">
                  <i className="fas fa-user-plus"></i> Adicionar Usuário
                </button>
              </div>
              
              {loading ? (
                <div className="loading-spinner">Carregando usuários...</div>
              ) : (
                <>
                  <div className="search-filter">
                    <input 
                      type="text" 
                      placeholder="Buscar usuários..." 
                      className="search-input"
                    />
                    <select className="filter-select">
                      <option value="">Todos os status</option>
                      <option value="active">Ativos</option>
                      <option value="pending">Pendentes</option>
                      <option value="blocked">Bloqueados</option>
                    </select>
                  </div>
                  
                  {users.length > 0 ? (
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Especialidade</th>
                            <th>Status</th>
                            <th>Data de Registro</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id}>
                              <td>{user.id}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.specialty || '-'}</td>
                              <td>
                                <span className={`status-badge ${user.status}`}>
                                  {user.status === 'active' ? 'Ativo' : 
                                   user.status === 'pending' ? 'Pendente' : 'Bloqueado'}
                                </span>
                              </td>
                              <td>{user.created_at}</td>
                              <td className="actions-cell">
                                <button className="action-btn edit-btn" title="Editar">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="action-btn delete-btn" title="Excluir">
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                                {user.status === 'active' ? (
                                  <button className="action-btn block-btn" title="Bloquear">
                                    <i className="fas fa-ban"></i>
                                  </button>
                                ) : (
                                  <button className="action-btn activate-btn" title="Ativar">
                                    <i className="fas fa-check-circle"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-users"></i>
                      <p>Nenhum usuário encontrado</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Congresses Tab */}
          {activeTab === 'congresses' && (
            <div className="admin-congresses">
              <div className="section-header">
                <h2>Gerenciar Congressos</h2>
                <button className="btn btn-primary">
                  <i className="fas fa-plus-circle"></i> Adicionar Congresso
                </button>
              </div>
              
              {loading ? (
                <div className="loading-spinner">Carregando congressos...</div>
              ) : (
                <>
                  <div className="search-filter">
                    <input 
                      type="text" 
                      placeholder="Buscar congressos..." 
                      className="search-input"
                    />
                    <select className="filter-select">
                      <option value="">Todos os status</option>
                      <option value="upcoming">Próximos</option>
                      <option value="ongoing">Em andamento</option>
                      <option value="past">Passados</option>
                    </select>
                  </div>
                  
                  {congresses.length > 0 ? (
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Local</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Seguidores</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {congresses.map(congress => (
                            <tr key={congress.id}>
                              <td>{congress.id}</td>
                              <td>{congress.title}</td>
                              <td>{congress.location}</td>
                              <td>{congress.date}</td>
                              <td>
                                <span className={`status-badge ${congress.status}`}>
                                  {congress.status === 'upcoming' ? 'Próximo' : 
                                   congress.status === 'ongoing' ? 'Em andamento' : 'Passado'}
                                </span>
                              </td>
                              <td>{congress.followers}</td>
                              <td className="actions-cell">
                                <button className="action-btn edit-btn" title="Editar">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="action-btn delete-btn" title="Excluir">
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                                <button className="action-btn notify-btn" title="Notificar seguidores">
                                  <i className="fas fa-bell"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-calendar-day"></i>
                      <p>Nenhum congresso encontrado</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Residencies Tab */}
          {activeTab === 'residencies' && (
            <div className="admin-residencies">
              <div className="section-header">
                <h2>Gerenciar Residências</h2>
                <button className="btn btn-primary">
                  <i className="fas fa-plus-circle"></i> Adicionar Residência
                </button>
              </div>
              
              {loading ? (
                <div className="loading-spinner">Carregando residências...</div>
              ) : (
                <>
                  <div className="search-filter">
                    <input 
                      type="text" 
                      placeholder="Buscar residências..." 
                      className="search-input"
                    />
                    <select className="filter-select">
                      <option value="">Todas as especialidades</option>
                      <option value="clinica">Clínica Médica</option>
                      <option value="cirurgia">Cirurgia Geral</option>
                      <option value="pediatria">Pediatria</option>
                      <option value="ginecologia">Ginecologia e Obstetrícia</option>
                    </select>
                  </div>
                  
                  {residencies.length > 0 ? (
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Instituição</th>
                            <th>Especialidade</th>
                            <th>Localização</th>
                            <th>Seguidores</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {residencies.map(residency => (
                            <tr key={residency.id}>
                              <td>{residency.id}</td>
                              <td>{residency.title}</td>
                              <td>{residency.institution}</td>
                              <td>{residency.specialty}</td>
                              <td>{residency.location}</td>
                              <td>{residency.followers}</td>
                              <td className="actions-cell">
                                <button className="action-btn edit-btn" title="Editar">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="action-btn delete-btn" title="Excluir">
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                                <button className="action-btn notify-btn" title="Notificar seguidores">
                                  <i className="fas fa-bell"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-hospital"></i>
                      <p>Nenhuma residência encontrada</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="admin-notifications">
              <h2>Enviar Notificações</h2>
              <p>Envie notificações para usuários que seguem congressos ou residências</p>
              
              {formErrors.general && (
                <div className="alert alert-danger">
                  {formErrors.general}
                </div>
              )}
              
              {formSuccess && (
                <div className="alert alert-success">
                  {formSuccess}
                </div>
              )}
              
              <form onSubmit={handleSendNotification} className="notification-form">
                <div className="form-group">
                  <label>Tipo de Item</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="type"
                        value="congress"
                        checked={notificationForm.type === 'congress'}
                        onChange={handleNotificationInputChange}
                      />
                      Congresso
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="type"
                        value="residency"
                        checked={notificationForm.type === 'residency'}
                        onChange={handleNotificationInputChange}
                      />
                      Residência
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="id">
                    {notificationForm.type === 'congress' ? 'Congresso' : 'Residência'}
                  </label>
                  <select
                    id="id"
                    name="id"
                    className={`form-control ${formErrors.id ? 'is-invalid' : ''}`}
                    value={notificationForm.id}
                    onChange={handleNotificationInputChange}
                  >
                    <option value="">
                      Selecione um {notificationForm.type === 'congress' ? 'congresso' : 'residência'}
                    </option>
                    {notificationForm.type === 'congress' ? (
                      congresses.map(congress => (
                        <option key={congress.id} value={congress.id}>
                          {congress.title}
                        </option>
                      ))
                    ) : (
                      residencies.map(residency => (
                        <option key={residency.id} value={residency.id}>
                          {residency.title}
                        </option>
                      ))
                    )}
                  </select>
                  {formErrors.id && <div className="invalid-feedback">{formErrors.id}</div>}
                </div>
                
                <div className="form-group">
                  <label>Tipo de Atualização</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="updateType"
                        value="update"
                        checked={notificationForm.updateType === 'update'}
                        onChange={handleNotificationInputChange}
                      />
                      Atualização Geral
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="updateType"
                        value="reminder"
                        checked={notificationForm.updateType === 'reminder'}
                        onChange={handleNotificationInputChange}
                      />
                      Lembrete
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="updateType"
                        value="custom"
                        checked={notificationForm.updateType === 'custom'}
                        onChange={handleNotificationInputChange}
                      />
                      Mensagem Personalizada
                    </label>
                  </div>
                </div>
                
                {notificationForm.updateType === 'custom' && (
                  <div className="form-group">
                    <label htmlFor="message">Mensagem Personalizada</label>
                    <textarea
                      id="message"
                      name="message"
                      className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}
                      value={notificationForm.message}
                      onChange={handleNotificationInputChange}
                      rows="4"
                      placeholder="Digite sua mensagem personalizada..."
                    ></textarea>
                    {formErrors.message && <div className="invalid-feedback">{formErrors.message}</div>}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Notificação'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 