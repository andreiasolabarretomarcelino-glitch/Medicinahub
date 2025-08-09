import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import '../styles/residencia.css';
import FollowButton from '../components/FollowButton';

const Residencia = () => {
  // State management
  const [residencies, setResidencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [specialties, setSpecialties] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    specialty: '',
    status: ''
  });
  
  // Initial load of auxiliary data
  useEffect(() => {
    // Fetch specialties and status types when component mounts
    fetchSpecialties();
    fetchStatusTypes();
  }, []);
  
  // Initial load and when filters/page changes
  useEffect(() => {
    fetchResidencies();
  }, [currentPage, filters, fetchResidencies]); // Add fetchResidencies as dependency
  
  // Function to fetch specialties for filters
  const fetchSpecialties = async () => {
    try {
      const response = await fetch('/api/residencias/specialties.php');
      if (!response.ok) {
        throw new Error('Erro na rede ao buscar especialidades');
      }
      
      const data = await response.json();
      if (data.status) {
        setSpecialties(data.specialties);
      } else {
        console.error('Erro ao buscar especialidades:', data.message);
      }
    } catch (err) {
      console.error('Erro ao buscar especialidades:', err);
    }
  };
  
  // Function to fetch status types for filters
  const fetchStatusTypes = async () => {
    try {
      const response = await fetch('/api/residencias/statuses.php');
      if (!response.ok) {
        throw new Error('Erro na rede ao buscar tipos de status');
      }
      
      const data = await response.json();
      if (data.status) {
        setStatusTypes(data.statuses);
      } else {
        console.error('Erro ao buscar tipos de status:', data.message);
      }
    } catch (err) {
      console.error('Erro ao buscar tipos de status:', err);
    }
  };
  
  // Function to fetch residency data - needs to be wrapped in useCallback
  const fetchResidencies = React.useCallback(async () => {
    setLoading(true);
    
    try {
      // Build query string with filters
      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage);
      queryParams.append('limit', 9); // 9 items per page
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.state) queryParams.append('estado', filters.state);
      if (filters.specialty) queryParams.append('specialty', filters.specialty);
      if (filters.status) queryParams.append('status', filters.status);
      
      // Make API request
      const response = await fetch(`/api/residencias/list.php?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro na rede ao buscar residências');
      }
      
      const data = await response.json();
      
      if (data.status) {
        setResidencies(data.residencies);
        setTotalPages(data.total_pages);
      } else {
        setError(data.message || 'Erro ao buscar residências');
        setResidencies([]);
      }
    } catch (err) {
      setError('Erro ao carregar os programas de residência. Por favor, tente novamente mais tarde.');
      setResidencies([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]); // Add dependencies here
  
  // Function to apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when applying filters
  };
  
  // Function to reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      state: '',
      specialty: '',
      status: ''
    });
    setCurrentPage(1);
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Adjust iframe height for PowerBI
  const adjustIframeHeight = () => {
    const iframe = document.getElementById('powerBiFrame');
    if (iframe) {
      const width = iframe.offsetWidth;
      const height = width * 0.5625; // 16:9 aspect ratio
      iframe.style.height = `${height}px`;
    }
  };
  
  // Add event listener for window resize
  useEffect(() => {
    window.addEventListener('resize', adjustIframeHeight);
    adjustIframeHeight();
    
    return () => {
      window.removeEventListener('resize', adjustIframeHeight);
    };
  }, []);
  
  // Generate pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
          className="btn btn-outline pagination-btn"
        >
          <i className="fas fa-chevron-left"></i> Anterior
        </button>
        
        <span className="pagination-info">Página {currentPage} de {totalPages}</span>
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
          className="btn btn-outline pagination-btn"
        >
          Próxima <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };
  
  // Brazilian states for filter
  const brazilianStates = [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
  ];
  
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section residency-hero">
        <div className="container">
          <h2>Residência Médica</h2>
          <p>Todos os editais, datas e recursos para sua jornada na residência médica brasileira em um só lugar.</p>
        </div>
      </div>
      
      <div className="container">
        {/* Welcome Section - Centro de Residência Médica */}
        <section className="welcome-section">
          <h2>Centro de Residência Médica</h2>
          <p>Acompanhe todos os editais de residência médica no Brasil, com datas, locais e especialidades. Prepare-se para o próximo passo na sua carreira médica.</p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <h3>Editais Atualizados</h3>
              <p>Todos os editais de residência médica disponíveis no Brasil atualizados diariamente.</p>
              <button className="btn btn-outline" onClick={() => document.getElementById('residencyList').scrollIntoView({ behavior: 'smooth' })}>Ver Editais</button>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-calendar-day"></i>
              </div>
              <h3>Calendário do Processo</h3>
              <p>Organize-se com o calendário completo de inscrições, provas e resultados.</p>
              <button className="btn btn-outline" onClick={() => document.getElementById('calendar').scrollIntoView({ behavior: 'smooth' })}>Ver Calendário</button>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-question-circle"></i>
              </div>
              <h3>Banco de Exemplos</h3>
              <p>Acesse provas e questões de residências anteriores para estudo.</p>
              <a href="#materials" className="btn btn-outline">Ver Exemplos</a>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3>Materiais de Estudo</h3>
              <p>Acesse recursos e dicas para sua preparação para as provas de residência.</p>
              <a href="#materials" className="btn btn-outline">Ver Materiais</a>
            </div>
          </div>
        </section>
        
        {/* Search Section */}
        <section className="filter-section" id="buscar">
          <h2>Buscar Programas de Residência</h2>
          <form onSubmit={applyFilters} className="filter-controls">
            <div className="filter-row">
              <input 
                type="text" 
                id="search" 
                name="search" 
                placeholder="Pesquisar por nome ou instituição..." 
                value={filters.search}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="filter-row">
              <select 
                id="state" 
                name="state" 
                value={filters.state}
                onChange={handleInputChange}
              >
                <option value="">Todos os Estados</option>
                {brazilianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              
              <select 
                id="specialty" 
                name="specialty" 
                value={filters.specialty}
                onChange={handleInputChange}
              >
                <option value="">Todas as Especialidades</option>
                {specialties.map(specialty => (
                  <option key={specialty.id} value={specialty.name}>{specialty.name}</option>
                ))}
              </select>
              
              <select 
                id="status" 
                name="status" 
                value={filters.status}
                onChange={handleInputChange}
              >
                <option value="">Todos os Status</option>
                {statusTypes.map(status => (
                  <option key={status.id} value={status.code}>{status.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-actions">
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-search"></i> Buscar
              </button>
              <button type="button" className="btn btn-outline" onClick={resetFilters}>
                <i className="fas fa-undo"></i> Limpar Filtros
              </button>
            </div>
          </form>
        </section>
        
        {/* Residency Listings */}
        <section className="residency-listings" id="residencyList">
          <h2>Programas de Residência Médica</h2>
          <p>Acompanhe aqui todos os programas de residência médica por Brasil, datas, editais e documentos.</p>
          
          <div className="residency-grid">
            {loading ? (
              <div className="loading-indicator">
                <i className="fas fa-spinner fa-pulse"></i>
                <p>Carregando programas de residência...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p><i className="fas fa-exclamation-triangle"></i> {error}</p>
              </div>
            ) : residencies.length === 0 ? (
              <div className="no-results">
                <p><i className="fas fa-search"></i> Nenhum programa de residência encontrado com os filtros selecionados.</p>
              </div>
            ) : 
              residencies.map(residency => (
                <div className="residency-item" key={residency.id}>
                  <div className="residency-header">
                    <h3 className="residency-title">{residency.title}</h3>
                    <span className={`residency-status ${residency.status}`}>{residency.status_text}</span>
                  </div>
                  <div className="residency-body">
                    <div className="residency-info">
                      <p><i className="fas fa-hospital"></i> <span>{residency.institution}</span></p>
                      <p><i className="fas fa-map-marker-alt"></i> <span>{residency.location}</span></p>
                      <p><i className="fas fa-user-md"></i> <span>{residency.specialty}</span></p>
                      <p><i className="fas fa-calendar-alt"></i> <span>{residency.date_formatted}</span></p>
                      <p><i className="fas fa-users"></i> <span>{residency.vacancies}</span> vagas</p>
                    </div>
                    <div className="residency-actions">
                      <a href={residency.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Ver Detalhes</a>
                      <a href={residency.edital_link} className="btn btn-outline" target="_blank" rel="noopener noreferrer">Edital <i className="fas fa-file-pdf"></i></a>
                      <FollowButton 
                        itemType="residency" 
                        itemId={residency.id} 
                        className="btn btn-outline" 
                        initialIsFollowing={residency.is_following}
                      />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          
          {renderPagination()}
        </section>
        
        {/* Dashboard Section */}
        <section className="dashboard-section" id="dashboard">
          <h2>Dashboard de Residências Médicas</h2>
          <p>Visualize dados e estatísticas sobre as residências médicas no Brasil.</p>
          
          <div className="dashboard-container">
            <iframe 
              id="powerBiFrame"
              title="Estatísticas de Residência Médica" 
              src="https://app.powerbi.com/view?r=eyJrIjoiZjdhZjJmOWMtOTY4YS00YTUzLWJkMjgtNjc2ZmQ3YTQ1YzM1IiwidCI6IjJhMWEzMmI1LTBmZmQtNDc3NC04NWFjLTI5ODNmYTMwZjI5ZiJ9"
              allowFullScreen
            />
          </div>
        </section>
        
        {/* Resources Section */}
        <section className="resources-section" id="recursos">
          <h2>Recursos para Residência</h2>
          <p>Ferramentas e materiais para ajudar na sua preparação para as provas de residência.</p>
          
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3>Material de Estudo</h3>
              <p>Bibliografia recomendada e materiais de estudo para as principais especialidades.</p>
              <button className="btn btn-outline">Acessar Materiais</button>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3>Provas Anteriores</h3>
              <p>Acesse provas anteriores dos principais processos seletivos de residência médica.</p>
              <button className="btn btn-outline">Ver Provas</button>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Calendário de Provas</h3>
              <p>Calendário com as datas das principais provas de residência médica no Brasil.</p>
              <button className="btn btn-outline">Ver Calendário</button>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3>Cursos Preparatórios</h3>
              <p>Cursos recomendados para a preparação para as provas de residência médica.</p>
              <button className="btn btn-outline">Ver Cursos</button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Residencia;
