import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArticleService from '../../services/ArticleService';
import AuthService from '../../services/AuthService';
import '../../styles/admin/admin-articles.css';

/**
 * AdminArticleList Component
 * Displays a list of all articles with management options for admin users
 */
const AdminArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const user = AuthService.getUser();
    if (!user || user.role !== 'admin') {
      navigate('/login', { state: { from: '/admin/articles' } });
    }
  }, [navigate]);

  // Fetch articles from the API
  const fetchArticles = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await ArticleService.fetchArticles({
        page,
        search,
        limit: 20, // More articles per page for admin view
      });

      if (response && response.articles) {
        setArticles(response.articles);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        throw new Error('Failed to fetch articles');
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load articles on component mount and when page/search changes
  useEffect(() => {
    fetchArticles(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchArticles(1, searchTerm);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Show delete confirmation modal
  const confirmDelete = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  // Handle article deletion
  const deleteArticle = async () => {
    if (!articleToDelete) return;
    
    try {
      await ArticleService.deleteArticle(articleToDelete.id);
      setArticles(articles.filter(a => a.id !== articleToDelete.id));
      setShowDeleteModal(false);
      setArticleToDelete(null);
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('Failed to delete article. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="admin-articles-container">
      <Helmet>
        <title>Gerenciar Artigos | MedicinaHub Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <h1>Gerenciar Artigos</h1>
      
      <div className="admin-actions">
        <Link to="/admin/articles/new" className="btn btn-success">
          <i className="fas fa-plus"></i> Criar Novo Artigo
        </Link>
        
        <form className="admin-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-pulse"></i>
          <p>Carregando artigos...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={() => fetchArticles(currentPage, searchTerm)}>
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          {articles.length === 0 ? (
            <div className="no-articles">
              <i className="fas fa-newspaper"></i>
              <p>Nenhum artigo encontrado</p>
              {searchTerm && (
                <button onClick={() => {
                  setSearchTerm('');
                  fetchArticles(1, '');
                }}>
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="article-count">
                Mostrando {articles.length} artigo(s) de {totalPages} página(s)
              </div>
              
              <div className="articles-table-container">
                <table className="articles-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Autor</th>
                      <th>Categoria</th>
                      <th>Status</th>
                      <th>Data de Publicação</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map(article => (
                      <tr key={article.id} className={article.featured ? 'featured-row' : ''}>
                        <td>{article.id}</td>
                        <td>
                          <div className="article-title-cell">
                            {article.title}
                            {article.featured && (
                              <span className="featured-badge">
                                <i className="fas fa-star"></i>
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{article.author?.name || 'N/A'}</td>
                        <td>{article.flair || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${article.status}`}>
                            {article.status === 'published' ? 'Publicado' : 
                             article.status === 'draft' ? 'Rascunho' : 
                             article.status === 'archived' ? 'Arquivado' : 'N/A'}
                          </span>
                        </td>
                        <td>{formatDate(article.published_at || article.created_at)}</td>
                        <td>
                          <div className="article-actions">
                            <Link 
                              to={`/portal/artigo/${article.slug}`} 
                              className="action-button view" 
                              title="Visualizar"
                              target="_blank"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>
                            <Link 
                              to={`/admin/articles/edit/${article.id}`} 
                              className="action-button edit" 
                              title="Editar"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button 
                              className="action-button delete" 
                              title="Excluir"
                              onClick={() => confirmDelete(article)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="admin-pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <i className="fas fa-chevron-left"></i> Anterior
                  </button>
                  
                  <div className="page-numbers">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          className={currentPage === pageNum ? 'active' : ''}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Próxima <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar exclusão</h2>
            <p>
              Tem certeza que deseja excluir o artigo 
              <strong> "{articleToDelete?.title}"</strong>?
            </p>
            <p className="warning">Esta ação não pode ser desfeita.</p>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setArticleToDelete(null);
                }}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger" 
                onClick={deleteArticle}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticleList; 