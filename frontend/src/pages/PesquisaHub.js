import React from 'react';
import '../styles/style.css';
import '../styles/pesquisahub.css';
import { Helmet } from 'react-helmet-async';

const PesquisaHub = () => {
  return (
    <div className="page-container">
      <Helmet>
        <title>PesquisaHub | Plataforma de Pesquisa Científica Médica - Em breve</title>
        <meta name="description" content="PesquisaHub - Conectando estudantes e profissionais de medicina a oportunidades de pesquisa científica, iniciação científica e produção acadêmica." />
        <meta name="keywords" content="pesquisa médica, iniciação científica, produção acadêmica, pesquisa científica, metodologia científica" />
      </Helmet>
      
      <div className="container">
        <div className="coming-soon-content">
          <div className="coming-soon-icon">
            <i className="fas fa-flask"></i>
          </div>
          <h1>PesquisaHub</h1>
          <h2>Em breve</h2>
          <p className="coming-soon-description">
            Estamos desenvolvendo uma plataforma dedicada à pesquisa científica médica, onde estudantes e 
            profissionais poderão encontrar oportunidades de iniciação científica, projetos de pesquisa e 
            recursos para a produção acadêmica.
          </p>
          
          <div className="coming-soon-features">
            <div className="feature-box">
              <div className="feature-icon">
                <i className="fas fa-microscope"></i>
              </div>
              <h3>Iniciação Científica</h3>
              <p>Conectamos estudantes a laboratórios e grupos de pesquisa em busca de novos talentos.</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">
                <i className="fas fa-book-medical"></i>
              </div>
              <h3>Publicações</h3>
              <p>Recursos e guias para a produção de artigos científicos e publicações em periódicos.</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Colaboração</h3>
              <p>Ferramentas para conectar pesquisadores e facilitar colaborações interdisciplinares.</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Educação Científica</h3>
              <p>Cursos e materiais sobre metodologia científica, bioestatística e ética em pesquisa.</p>
            </div>
          </div>
          
          <div className="coming-soon-cta">
            <h3>Quer ser notificado quando lançarmos?</h3>
            <form className="notify-form">
              <div className="form-group">
                <input type="email" placeholder="Seu e-mail" required aria-label="Seu e-mail" />
                <button type="submit" className="btn btn-primary">Quero ser avisado</button>
              </div>
              <p className="form-note">Prometemos não enviar spam. Você poderá cancelar a qualquer momento.</p>
            </form>
          </div>
          
          <div className="coming-soon-timeline">
            <div className="timeline-item">
              <div className="timeline-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="timeline-content">
                <h4>Fase de Planejamento</h4>
                <p>Concluída</p>
              </div>
            </div>
            
            <div className="timeline-item active">
              <div className="timeline-icon">
                <i className="fas fa-code"></i>
              </div>
              <div className="timeline-content">
                <h4>Desenvolvimento</h4>
                <p>Em andamento</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-icon">
                <i className="fas fa-vial"></i>
              </div>
              <div className="timeline-content">
                <h4>Testes</h4>
                <p>Em breve</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <div className="timeline-content">
                <h4>Lançamento</h4>
                <p>Previsão: 2º semestre/2024</p>
              </div>
            </div>
          </div>
          
          <div className="coming-soon-faq">
            <h3>Perguntas Frequentes</h3>
            
            <div className="faq-item">
              <h4>O que é o PesquisaHub?</h4>
              <p>
                O PesquisaHub é uma plataforma dedicada à pesquisa científica médica, que visa conectar 
                estudantes, pesquisadores e instituições, facilitando a colaboração e o desenvolvimento 
                de projetos científicos na área da saúde.
              </p>
            </div>
            
            <div className="faq-item">
              <h4>Quando será lançado?</h4>
              <p>
                Estamos trabalhando arduamente para lançar o PesquisaHub no segundo semestre de 2024. 
                Cadastre seu e-mail acima para ser notificado assim que estivermos no ar!
              </p>
            </div>
            
            <div className="faq-item">
              <h4>Como posso participar como instituição ou laboratório?</h4>
              <p>
                Instituições e laboratórios interessados em fazer parte do PesquisaHub podem entrar em 
                contato conosco através do e-mail <a href="mailto:pesquisa@medicinahub.com.br">pesquisa@medicinahub.com.br</a> 
                para mais informações sobre parcerias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PesquisaHub;
