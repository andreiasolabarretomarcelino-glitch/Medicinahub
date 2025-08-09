import React from 'react';
import '../styles/style.css';
import '../styles/about.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const About = () => {
  return (
    <div className="page-container">
      <Helmet>
        <title>Sobre o MedicinaHub | Conectando médicos ao conhecimento</title>
        <meta name="description" content="Conheça a história, missão e valores do MedicinaHub - a plataforma que conecta estudantes e profissionais de medicina a recursos educacionais de qualidade." />
        <meta name="keywords" content="sobre medicinahub, quem somos, missão medicinahub, plataforma médica, educação médica" />
      </Helmet>
      
      <div className="container">
        <div className="about-content">
          <h1>Sobre o MedicinaHub</h1>
          
          <div className="about-section">
            <h2>Nossa Missão</h2>
            <p>
              O MedicinaHub nasceu com a missão de conectar estudantes e profissionais de medicina 
              a recursos educacionais de qualidade, eventos científicos e oportunidades de desenvolvimento 
              profissional. Buscamos democratizar o acesso à informação médica e promover a excelência 
              na educação médica no Brasil.
            </p>
          </div>
          
          <div className="about-section">
            <h2>Quem Somos</h2>
            <p>
              Somos uma equipe de médicos, educadores e desenvolvedores apaixonados por inovação na 
              educação médica. O MedicinaHub foi criado por médicos para médicos, com o entendimento 
              profundo das necessidades e desafios únicos da comunidade médica brasileira.
            </p>
            <p>
              Nossa plataforma reúne conteúdo educacional, informações sobre congressos e eventos, 
              artigos científicos e recursos para o desenvolvimento da carreira médica, tudo em um 
              único lugar acessível e organizado.
            </p>
          </div>
          
          <div className="about-section">
            <h2>O Que Oferecemos</h2>
            <div className="feature-list">
              <div className="feature-item">
                <i className="fas fa-calendar-alt"></i>
                <h3>Congressos e Eventos</h3>
                <p>Informações atualizadas sobre os principais congressos, jornadas e eventos científicos em medicina.</p>
              </div>
              
              <div className="feature-item">
                <i className="fas fa-book-medical"></i>
                <h3>Portal de Artigos</h3>
                <p>Artigos e conteúdos educacionais sobre temas relevantes para estudantes e profissionais de medicina.</p>
              </div>
              
              <div className="feature-item">
                <i className="fas fa-flask"></i>
                <h3>PesquisaHub</h3>
                <p>Conectando pesquisadores e estudantes interessados em iniciação científica e pesquisa médica.</p>
              </div>
              
              <div className="feature-item">
                <i className="fas fa-user-md"></i>
                <h3>Desenvolvimento de Carreira</h3>
                <p>Recursos e orientações para residência médica, especializações e trajetória profissional.</p>
              </div>
            </div>
          </div>
          
          <div className="about-section">
            <h2>Nossos Valores</h2>
            <ul className="values-list">
              <li><strong>Excelência:</strong> Comprometimento com o mais alto padrão de qualidade em todo o conteúdo.</li>
              <li><strong>Acessibilidade:</strong> Democratização do conhecimento médico para todos.</li>
              <li><strong>Inovação:</strong> Busca constante por novas formas de melhorar a educação médica.</li>
              <li><strong>Colaboração:</strong> Trabalho conjunto com instituições, profissionais e estudantes.</li>
              <li><strong>Ética:</strong> Compromisso com os princípios éticos da medicina e da educação.</li>
            </ul>
          </div>
          
          <div className="about-section">
            <h2>Nossa Visão</h2>
            <p>
              Aspiramos ser a principal plataforma digital para educação médica e desenvolvimento profissional 
              no Brasil, tornando o conhecimento médico de qualidade acessível a todos os profissionais e 
              estudantes, independentemente de sua localização geográfica.
            </p>
          </div>
          
          <div className="contact-section">
            <h2>Entre em Contato</h2>
            <p>Estamos sempre abertos a feedback, parcerias e sugestões.</p>
            <ul className="contact-info">
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:contato@medicinahub.com.br">contato@medicinahub.com.br</a>
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>São Paulo, SP - Brasil</span>
              </li>
            </ul>
            
            <div className="social-links">
              <a href="https://instagram.com/medicinahub" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://facebook.com/medicinahub" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://linkedin.com/company/medicinahub" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://twitter.com/medicinahub" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          <div className="about-section">
            <h2>Políticas e Termos</h2>
            <p>
              Saiba mais sobre como utilizamos seus dados e nossas políticas de privacidade:
            </p>
            <div className="policy-links">
              <Link to="/privacidade">Política de Privacidade</Link>
              <Link to="/cookies">Política de Cookies</Link>
              <Link to="/termos">Termos de Uso</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 