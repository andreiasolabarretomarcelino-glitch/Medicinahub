import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArticleService from '../services/ArticleService';
import ArticleCard from './ArticleCard';
import '../styles/article-detail.css';

/**
 * ArticleDetail component
 * Displays the full content of an article
 */
const ArticleDetail = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let articleData;
        
        // Try to fetch by slug first (preferred), fall back to ID
        if (slug) {
          console.log('Fetching article by slug:', slug);
          articleData = await ArticleService.fetchArticleBySlug(slug);
        } else if (id) {
          console.log('Fetching article by ID:', id);
          articleData = await ArticleService.fetchArticleById(id);
        } else {
          throw new Error('No article identifier provided');
        }
        
        console.log('Article data:', articleData);
        setArticle(articleData);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Não foi possível carregar o artigo. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [slug, id]);
  
  // Handle date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  // Handle content rendering with proper HTML
  const renderContent = (content) => {
    return { __html: content };
  };
  
  // Generate structured data for SEO
  const generateStructuredData = () => {
    if (!article) return null;
    
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      image: article.image_url,
      datePublished: article.published_at,
      dateModified: article.updated_at || article.published_at,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'MedicinaHub',
        logo: {
          '@type': 'ImageObject',
          url: 'https://medicinahub.com.br/logo.png'
        }
      },
      description: article.excerpt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://medicinahub.com.br/portal/artigo/${article.slug || article.id}`
      }
    };
    
    return JSON.stringify(data);
  };
  
  if (loading) {
    return (
      <div className="article-detail-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-pulse"></i>
          <p>Carregando artigo...</p>
        </div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="article-detail-container">
        <div className="article-not-found">
          <i className="fas fa-exclamation-circle"></i>
          <h2>Artigo não encontrado</h2>
          <p>{error || 'Não foi possível encontrar o artigo solicitado.'}</p>
          <Link to="/portal" className="btn btn-primary">
            <i className="fas fa-arrow-left"></i> Voltar para o Portal
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>{article.title} | MedicinaHub</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image_url} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={article.image_url} />
        {article.tags && article.tags.length > 0 && (
          <meta name="keywords" content={article.tags.join(', ')} />
        )}
        <script type="application/ld+json">
          {generateStructuredData()}
        </script>
        {/* Preconnect to required origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://via.placeholder.com" crossOrigin="anonymous" />
      </Helmet>
      
      <div className="article-detail-container">
        <div className="container">
          {/* Breadcrumbs */}
          <div className="article-breadcrumbs">
            <Link to="/">Home</Link> <i className="fas fa-chevron-right"></i>
            <Link to="/portal">Portal</Link> <i className="fas fa-chevron-right"></i>
            {article.flair && (
              <>
                <Link to={`/portal?flair=${article.flair}`}>{article.flair}</Link>
                <i className="fas fa-chevron-right"></i>
              </>
            )}
            <span className="current-page">{article.title}</span>
          </div>
          
          <div className="article-detail">
            <header className="article-header">
              <div className="article-meta">
                {article.flair && (
                  <Link to={`/portal?flair=${article.flair}`} className="article-category">
                    <i className={`fas ${article.flair_icon || 'fa-tag'}`}></i> {article.flair}
                  </Link>
                )}
                
                <div className="article-author">
                  <i className="fas fa-user-md"></i> {article.author || 'Autor Desconhecido'}
                </div>
                
                <div className="article-date">
                  <i className="far fa-calendar-alt"></i> Publicado em {article.published_at_formatted || formatDate(article.published_at)}
                </div>
                
                {article.updated_at && article.updated_at !== article.published_at && (
                  <div className="article-date">
                    <i className="fas fa-calendar-alt"></i> Atualizado em {article.updated_at_formatted || formatDate(article.updated_at)}
                  </div>
                )}
                
                {article.read_time && (
                  <div className="article-read-time">
                    <i className="far fa-clock"></i> {article.read_time}
                  </div>
                )}
                
                {article.views !== null && article.views !== undefined && (
                  <div className="article-views">
                    <i className="far fa-eye"></i> {article.views} visualizações
                  </div>
                )}
              </div>
              
              <h1 className="article-title">{article.title}</h1>
              
              {article.excerpt && (
                <p className="article-excerpt">{article.excerpt}</p>
              )}
            </header>
            
            {article.image_url && (
              <div className="article-featured-image">
                <img 
                  src={article.image_url} 
                  alt={article.title} 
                  loading="lazy"
                />
              </div>
            )}
            
            <div 
              className="article-content"
              dangerouslySetInnerHTML={renderContent(article.content)}
            />
            
            {/* Article Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="article-tags">
                <span className="tag-label">
                  <i className="fas fa-tags"></i> Tags:
                </span>
                {article.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    <Link to={`/portal?tag=${tag}`}>{tag}</Link>
                  </span>
                ))}
              </div>
            )}
            
            {/* Share Buttons */}
            <div className="article-share">
              <span className="share-label">Compartilhar:</span>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button"
                aria-label="Compartilhar no Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button"
                aria-label="Compartilhar no Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button"
                aria-label="Compartilhar no WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button"
                aria-label="Compartilhar no LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a 
                href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent('Confira este artigo da MedicinaHub: ' + window.location.href)}`}
                className="share-button"
                aria-label="Compartilhar por Email"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </div>
            
            {/* Related Articles */}
            {article.related_articles && article.related_articles.length > 0 && (
              <div className="related-articles">
                <h3>
                  <i className="fas fa-newspaper"></i> Artigos Relacionados
                </h3>
                <div className="related-articles-grid">
                  {article.related_articles.map((related) => (
                    <ArticleCard 
                      key={related.id} 
                      article={related} 
                      onFlairClick={(flair) => navigate(`/portal?flair=${flair}`)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Navigation */}
            <div className="article-navigation">
              <Link to="/portal" className="btn btn-outline">
                <i className="fas fa-arrow-left"></i> Voltar para o Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail; 