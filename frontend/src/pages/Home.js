// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCongresses } from '../services/CongressService';
import { formatDate, getDaysDifference } from '../utils/dateUtils';

const Home = () => {
  const [featuredCongresses, setFeaturedCongresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedCongresses = async () => {
      try {
        // Fetch data from the API
        const data = await fetchCongresses();
        
        // Filter and sort congresses by date (closest to today first)
        const validCongresses = data
          .filter(congress => congress.event_date)
          .sort((a, b) => {
            const dateA = new Date(a.event_date.replace(/-/g, '/'));
            const dateB = new Date(b.event_date.replace(/-/g, '/'));
            return dateA - dateB;
          });
        
        // Get first 5 congresses
        setFeaturedCongresses(validCongresses.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError('Falha ao carregar congressos em destaque');
        setLoading(false);
        console.error(err);
      }
    };

    fetchFeaturedCongresses();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h2>Sua jornada médica começa aqui</h2>
          <p>O MedicinaHub foi criado para atender todas as necessidades da comunidade médica brasileira em um só lugar.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Cadastre-se Agora</Link>
            <Link to="/congressos" className="btn btn-outline">Explorar Congressos</Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <div className="container">
        <section className="welcome-section">
          <h2>Recursos Educacionais</h2>
          <p>Materiais de estudo, resumos e conteúdos exclusivos para médicos e estudantes.</p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <i className="fas fa-users"></i>
              <h3>Networking</h3>
              <p>Conecte-se com profissionais e pesquisadores em toda comunidade médica brasileira.</p>
              <Link to="/register" className="btn btn-outline">Comece a Conectar</Link>
            </div>
            
            <div className="feature-card">
              <i className="fas fa-calendar-alt"></i>
              <h3>Eventos Científicos</h3>
              <p>Mantenha-se atualizado com os principais congressos e simpósios médicos.</p>
              <Link to="/congressos" className="btn btn-outline">Ver Eventos</Link>
            </div>
            
            <div className="feature-card">
              <i className="fas fa-microscope"></i>
              <h3>PesquisaHub</h3>
              <p>Conecte-se com pesquisadores e encontre oportunidades para publicações científicas.</p>
              <Link to="/pesquisahub" className="btn btn-outline">Explorar Pesquisas</Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <i className="fas fa-user-md"></i>
              <h3>5000+</h3>
              <p>Médicos Cadastrados</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-calendar-check"></i>
              <h3>500+</h3>
              <p>Eventos Médicos</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-globe-americas"></i>
              <h3>27</h3>
              <p>Estados Brasileiros</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-file-medical-alt"></i>
              <h3>1200+</h3>
              <p>Artigos Científicos</p>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="upcoming-events">
          <h2>Congressos em Destaque</h2>
          
          <div id="featuredCongresses">
            {loading && <p>Carregando congressos...</p>}
            {error && <p>{error}</p>}
            
            {!loading && !error && featuredCongresses.length === 0 && (
              <p>Nenhum congresso em destaque no momento.</p>
            )}
            
            {!loading && !error && featuredCongresses.map((congress) => (
              <div className="congress-card" key={congress.id}>
                <h3>{congress.name || congress.title}</h3>
                <p><strong>Estado:</strong> {congress.state}</p>
                <p><strong>Especialidade:</strong> {congress.specialty}</p>
                <p><strong>Data do Evento:</strong> {formatDate(congress.event_date)}</p>
                <div className="countdown"><strong>Faltam:</strong> {getDaysDifference(congress.event_date)}</div>
                <div className="congress-actions">
                  <Link to={`/congressos/${congress.id}`} className="btn btn-primary">Mais Detalhes</Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="view-all">
            <Link to="/congressos" className="btn btn-outline">Ver Todos os Congressos</Link>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2>O que dizem os usuários</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"O MedicinaHub foi essencial para me manter atualizado com os principais congressos da minha especialidade. Excelente recurso!"</p>
              </div>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Dr. Rafael Soares" />
                <div>
                  <h4>Dr. Rafael Soares</h4>
                  <p>Cardiologista</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Como estudante de medicina, o portal de residência me ajudou muito na preparação para as provas. Os materiais são completos e atualizados."</p>
              </div>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Dra. Fernanda Lima" />
                <div>
                  <h4>Dra. Fernanda Lima</h4>
                  <p>Residente de Pediatria</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Através do PesquisaHub consegui encontrar colaboradores para meu projeto de pesquisa e isso resultou em uma publicação internacional."</p>
              </div>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Dr. André Martins" />
                <div>
                  <h4>Dr. André Martins</h4>
                  <p>Pesquisador em Neurologia</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Junte-se à Comunidade MedicinaHub</h2>
          <p>Faça parte da maior comunidade médica do Brasil e tenha acesso a recursos educacionais, eventos científicos e conecte-se com outros profissionais.</p>
          <Link to="/register" className="btn btn-outline">Criar Conta Gratuita</Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
