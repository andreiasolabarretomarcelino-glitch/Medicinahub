import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/portal.css';

// Import mock data - in a real app, you would fetch this from an API
import { mockPosts, mockFlairs } from './Portal';

/**
 * ArticleDetail component
 * Displays a single article with its full content
 */
const ArticleDetail = () => {
  const { articleId, slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API fetch with a short delay
    setLoading(true);
    
    const fetchArticle = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        const foundArticle = mockPosts.find(post => post.id === parseInt(articleId));
        
        if (foundArticle) {
          setArticle(foundArticle);
          
          // Find related articles with the same flair
          const related = mockPosts
            .filter(post => post.flair === foundArticle.flair && post.id !== foundArticle.id)
            .slice(0, 2);
            
          setRelatedArticles(related);
        }
        
        setLoading(false);
      }, 500);
    };
    
    fetchArticle();
  }, [articleId, slug]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  // Generate URL slug for an article
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="article-detail-container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-pulse"></i>
            <p>Carregando artigo...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="container">
        <div className="article-detail-container">
          <div className="article-not-found">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Artigo não encontrado</h2>
            <p>O artigo que você está procurando não existe ou foi removido.</p>
            <Link to="/portal" className="btn btn-primary">Voltar para o Portal</Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if the URL slug matches the article title slug
  const correctSlug = generateSlug(article.title);
  if (slug !== correctSlug) {
    // Redirect to the correct URL for SEO purposes
    navigate(`/portal/artigo/${articleId}/${correctSlug}`, { replace: true });
    return null;
  }

  return (
    <div className="container">
      <div className="article-detail-container">
        <div className="article-breadcrumbs">
          <Link to="/">Home</Link> {' > '}
          <Link to="/portal">Portal</Link> {' > '}
          <span className="breadcrumb-flair">
            <Link to={`/portal?flair=${article.flair}`}>{article.flair}</Link> {' > '}
          </span>
          <span className="current-page">{article.title}</span>
        </div>
        
        <article className="article-detail">
          <header className="article-header">
            <div className="article-meta">
              <span className="article-flair">{article.flair}</span>
              <span className="article-date">
                <i className="fas fa-calendar-alt"></i>
                {formatDate(article.publishedAt)}
              </span>
            </div>
            
            <h1 className="article-title">{article.title}</h1>
            
            <div className="article-author">
              <i className="fas fa-user-md"></i>
              <span>{article.author}</span>
            </div>
          </header>
          
          {article.imageUrl && (
            <div className="article-featured-image">
              <img src={article.imageUrl} alt={article.title} />
            </div>
          )}
          
          <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }}></div>
          
          <div className="article-tags">
            <span className="tag-label"><i className="fas fa-tags"></i> Tags:</span>
            <span className="tag-item">
              <Link to={`/portal?flair=${article.flair}`}>{article.flair}</Link>
            </span>
            <span className="tag-item">
              <Link to="/portal?flair=medicina">medicina</Link>
            </span>
          </div>
          
          <div className="article-share">
            <span className="share-label">Compartilhar:</span>
            <a href="#" className="share-button" title="Compartilhar no Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="share-button" title="Compartilhar no Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="share-button" title="Compartilhar no WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="#" className="share-button" title="Compartilhar no LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </article>
        
        {relatedArticles.length > 0 && (
          <div className="related-articles">
            <h3><i className="fas fa-bookmark"></i> Artigos Relacionados</h3>
            <div className="related-articles-grid">
              {relatedArticles.map(relatedArticle => (
                <Link
                  key={relatedArticle.id}
                  to={`/portal/artigo/${relatedArticle.id}/${generateSlug(relatedArticle.title)}`}
                  className="related-article-card"
                >
                  {relatedArticle.imageUrl && (
                    <div className="related-article-image">
                      <img src={relatedArticle.imageUrl} alt={relatedArticle.title} />
                    </div>
                  )}
                  <div className="related-article-content">
                    <h4>{relatedArticle.title}</h4>
                    <p className="article-meta">
                      <span className="article-date">
                        <i className="fas fa-calendar-alt"></i>
                        {formatDate(relatedArticle.publishedAt)}
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className="article-navigation">
          <Link to="/portal" className="btn btn-outline">
            <i className="fas fa-arrow-left"></i> Voltar para o Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail; 