// src/pages/Congressos.js
import React, { useState, useEffect, useCallback } from 'react';
import CongressCard from '../components/CongressCard';
import { fetchCongresses } from '../services/CongressService';
import '../styles/style.css';

const Congressos = () => {
  const [congresses, setCongresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    specialty: '',
    month: ''
  });

  // Generate month options for the filter
  const getMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Generate options for the next 24 months
    for (let i = 0; i < 24; i++) {
      const monthDate = new Date(currentYear, currentDate.getMonth() + i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth() + 1;
      const monthStr = month < 10 ? `0${month}` : month;
      const value = `${year}-${monthStr}`;
      
      // Format the month name in Portuguese
      const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'long' });
      const label = `${monthName} ${year}`;
      
      months.push({ value, label });
    }
    
    return months;
  };

  // Fetch congresses with the current filters
  const loadCongresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchCongresses(filters);
      setCongresses(data);
    } catch (err) {
      console.error('Error loading congresses:', err);
      setError('Falha ao carregar congressos. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load congresses on component mount and when filters change
  useEffect(() => {
    loadCongresses();
  }, [loadCongresses]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      state: '',
      specialty: '',
      month: ''
    });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h2>Congressos Médicos</h2>
          <p>Encontre os principais congressos e eventos médicos do Brasil.</p>
        </div>
      </div>
      
      <div className="container">
        {/* Filter Section */}
        <section className="filter-section">
          <h2>Filtrar Congressos</h2>
          <div className="filter-controls">
            <div className="filter-row">
              <div className="filter-item">
                <label htmlFor="search">Buscar por nome ou descrição</label>
                <input 
                  type="text" 
                  id="search" 
                  name="search" 
                  placeholder="Ex: Cardiologia, USP, Simpósio..." 
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            
            <div className="filter-row">
              <div className="filter-item">
                <label htmlFor="stateFilter">Estado</label>
                <select 
                  id="stateFilter" 
                  name="state" 
                  value={filters.state}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos os Estados</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
              
              <div className="filter-item">
                <label htmlFor="specialtyFilter">Especialidade</label>
                <select 
                  id="specialtyFilter" 
                  name="specialty" 
                  value={filters.specialty}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas as Especialidades</option>
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Cirurgia Geral">Cirurgia Geral</option>
                  <option value="Clínica Médica">Clínica Médica</option>
                  <option value="Dermatologia">Dermatologia</option>
                  <option value="Endocrinologia">Endocrinologia</option>
                  <option value="Gastroenterologia">Gastroenterologia</option>
                  <option value="Geriatria">Geriatria</option>
                  <option value="Ginecologia e Obstetrícia">Ginecologia e Obstetrícia</option>
                  <option value="Neurologia">Neurologia</option>
                  <option value="Oftalmologia">Oftalmologia</option>
                  <option value="Oncologia">Oncologia</option>
                  <option value="Ortopedia">Ortopedia</option>
                  <option value="Pediatria">Pediatria</option>
                  <option value="Pneumologia">Pneumologia</option>
                  <option value="Psiquiatria">Psiquiatria</option>
                  <option value="Radiologia">Radiologia</option>
                  <option value="Reumatologia">Reumatologia</option>
                  <option value="Urologia">Urologia</option>
                </select>
              </div>
              
              <div className="filter-item">
                <label htmlFor="monthFilter">Mês do Evento</label>
                <select 
                  id="monthFilter" 
                  name="month" 
                  value={filters.month}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos os Meses</option>
                  {getMonthOptions().map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="filter-actions">
              <button 
                className="btn btn-primary" 
                onClick={loadCongresses}
              >
                <i className="fas fa-search"></i> Buscar Congressos
              </button>
              <button 
                className="btn btn-outline" 
                onClick={resetFilters}
              >
                <i className="fas fa-times"></i> Limpar Filtros
              </button>
            </div>
          </div>
        </section>

        {/* Congress Listings */}
        <section className="congress-section">
          <h2>Congressos Encontrados</h2>
          {loading && (
            <div className="loading-indicator">
              <i className="fas fa-spinner fa-pulse"></i>
              <p>Carregando congressos...</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
            </div>
          )}
          
          {!loading && !error && congresses.length === 0 && (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <p>Nenhum congresso encontrado com os filtros selecionados.</p>
            </div>
          )}
          
          {!loading && !error && congresses.length > 0 && (
            <div className="congress-grid" id="congressList">
              {congresses.map((congress) => (
                <CongressCard key={congress.id} congress={congress} />
              ))}
            </div>
          )}
        </section>
        
        {/* Additional Resources Section */}
        <section className="resources-section">
          <h2>Recursos para Congressos</h2>
          <p className="subheading">Ferramentas e materiais para ajudar na sua participação em congressos</p>
          
          <div className="resource-grid">
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <h3>Dicas para Submissão</h3>
              <p>Guias e dicas para submissão de trabalhos científicos em congressos médicos.</p>
              <button className="btn btn-outline">Acessar</button>
            </div>
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-plane"></i>
              </div>
              <h3>Planejamento de Viagem</h3>
              <p>Informações sobre hotéis, transporte e hospedagem para congressos.</p>
              <button className="btn btn-outline">Acessar</button>
            </div>
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h3>Certificados</h3>
              <p>Como gerenciar e validar certificados de participação em congressos.</p>
              <button className="btn btn-outline">Acessar</button>
            </div>
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Calendário Anual</h3>
              <p>Calendário anual dos principais congressos médicos no Brasil.</p>
              <button className="btn btn-outline">Acessar</button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Congressos;
