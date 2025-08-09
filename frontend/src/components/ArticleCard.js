import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/article-card.css';

/**
 * ArticleCard component
 * Displays a preview of an article with image, title, excerpt, etc.
 */
const ArticleCard = ({ article, onFlairClick }) => {
  // Handle null or undefined article
  if (!article) {
    console.error('ArticleCard received null or undefined article');
    return null;
  }

  // Log the article data to help debug
  console.log('ArticleCard rendering with data:', article);

  // Use formatted date if available, otherwise format it
  const formattedDate = article.published_at_formatted || 
    (article.published_at ? new Date(article.published_at).toLocaleDateString('pt-BR') : 'Data não disponível');
  
  // Use the slug for the link if available, otherwise use ID
  const articleLink = article.slug 
    ? `/portal/artigo/${article.slug}`
    : `/portal/artigo/${article.id}`;

  // Handle click on flair tag
  const handleFlairClick = (e) => {
    e.preventDefault();
    if (onFlairClick && article.flair) {
      onFlairClick(article.flair);
    }
  };

  // Function to get icon for flair
  const getFlairIcon = (flair) => {
    if (!flair) return 'fa-newspaper';
    
    // Map of flairs to icons
    const flairIcons = {
      'residência': 'fa-hospital',
      'revalida': 'fa-clipboard-check',
      'concursos': 'fa-file-signature',
      'casos clínicos': 'fa-stethoscope',
      'guias práticos': 'fa-book-medical',
      'atualização': 'fa-sync',
      'procedimentos': 'fa-procedures',
      'cardiologia': 'fa-heartbeat',
      'neurologia': 'fa-brain',
      'ortopedia': 'fa-bone',
      'pediatria': 'fa-baby',
      'oncologia': 'fa-ribbon',
      'psiquiatria': 'fa-user-md',
      'dermatologia': 'fa-allergies',
      'oftalmologia': 'fa-eye',
      'ginecologia': 'fa-venus',
      'urologia': 'fa-mars',
      'endocrinologia': 'fa-tint',
      'pneumologia': 'fa-lungs',
      'gastroenterologia': 'fa-stomach',
      'hipertensão': 'fa-heart',
      'diabetes': 'fa-syringe',
      'câncer': 'fa-disease',
      'alzheimer': 'fa-brain',
      'parkinson': 'fa-hand-tremor',
      'covid-19': 'fa-virus',
      'asma': 'fa-lungs-virus',
      'artrite': 'fa-bone',
      'cirurgia': 'fa-scalpel',
      'anestesia': 'fa-syringe',
      'intubação': 'fa-lungs',
      'sutura': 'fa-thread',
      'biópsia': 'fa-microscope',
      'punção lombar': 'fa-spine',
      'farmacologia': 'fa-pills',
      'antibióticos': 'fa-capsules',
      'analgésicos': 'fa-tablets',
      'eventos': 'fa-calendar-day',
      'congressos': 'fa-users'
    };
    
    // Return specific icon if exists, or default
    return flairIcons[flair.toLowerCase()] || 'fa-newspaper';
  };

  return (
    <div className="article-card">
      <Link to={articleLink} className="article-link">
        <div className="article-image">
          <img 
            src={article.image_url || 'https://via.placeholder.com/400x250?text=MedicinaHub'} 
            alt={article.title || 'Artigo médico'} 
          />
          
          {article.flair && (
            <div className="article-flair" onClick={handleFlairClick}>
              <i className={`fas ${getFlairIcon(article.flair)}`}></i>
              <span>{article.flair}</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="article-content">
        <Link to={articleLink}>
          <h2 className="article-title">
            {article.title || 'Título não disponível'}
          </h2>
        </Link>
        
        <div className="article-meta">
          <span className="article-date">
            <i className="far fa-calendar-alt"></i> {formattedDate}
          </span>
          
          {article.read_time && (
            <span className="article-read-time">
              <i className="far fa-clock"></i> {article.read_time}
            </span>
          )}
          
          {article.views !== null && article.views !== undefined && (
            <span className="article-views">
              <i className="far fa-eye"></i> {article.views} visualizações
            </span>
          )}
        </div>
        
        <p className="article-excerpt">
          {article.excerpt || 
           (article.content ? article.content.substring(0, 150) + '...' : 'Conteúdo não disponível')}
        </p>
        
        <Link to={articleLink} className="read-more">
          Ler mais <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard; 