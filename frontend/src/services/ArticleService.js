/**
 * ArticleService.js
 * Service for handling article-related API calls
 */

// For development testing/fallback
const MOCK_MODE = process.env.NODE_ENV === 'development';

/**
 * Fetch articles based on filters
 * @param {Object} filters - Filter options (search, flair, page, limit)
 * @returns {Promise<Object>} - Articles and pagination data
 */
export const fetchArticles = async (filters = {}) => {
  try {
    console.log('Fetching articles with filters:', filters);
    
    // Build the query string
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    if (filters.flair) {
      params.append('flair', filters.flair);
    }
    
    if (filters.page && !isNaN(parseInt(filters.page))) {
      params.append('page', filters.page);
    } else {
      params.append('page', '1');
    }
    
    if (filters.limit && !isNaN(parseInt(filters.limit))) {
      params.append('limit', filters.limit);
    } else {
      params.append('limit', '9'); // Default limit
    }
    
    const apiUrl = `/api/articles.php?${params.toString()}`;
    console.log('Fetching articles from:', apiUrl);
    
    // Fetch articles from API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', response.status, errorData);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    
    // Return the processed data
    return {
      articles: data.articles || [],
      pagination: data.pagination || {
        currentPage: parseInt(filters.page) || 1,
        totalPages: 1,
        totalItems: data.articles?.length || 0
      }
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    
    if (MOCK_MODE) {
      console.warn('Using mock articles data due to API error');
      return {
        articles: getMockArticles(),
        pagination: {
          currentPage: parseInt(filters.page) || 1,
          totalPages: 3,
          totalItems: 27
        }
      };
    }
    
    return {
      articles: [],
      pagination: {
        currentPage: parseInt(filters.page) || 1,
        totalPages: 1,
        totalItems: 0
      }
    };
  }
};

/**
 * Fetch article by ID
 * @param {number|string} id - Article ID
 * @returns {Promise<Object>} - Article data
 */
export const fetchArticleById = async (id) => {
  try {
    console.log('Fetching article with ID:', id);
    const apiUrl = `/api/article.php?id=${id}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching article with ID ${id}:`, error);
    
    if (MOCK_MODE) {
      console.warn('Using mock article data due to API error');
      return getMockArticles()[0];
    }
    
    throw error;
  }
};

/**
 * Fetch article by slug
 * @param {string} slug - Article slug
 * @returns {Promise<Object>} - Article data
 */
export const fetchArticleBySlug = async (slug) => {
  try {
    console.log('Fetching article with slug:', slug);
    const apiUrl = `/api/article.php?slug=${slug}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    
    if (MOCK_MODE) {
      console.warn('Using mock article data due to API error');
      // Find article with matching slug or return first mock article
      const mockArticles = getMockArticles();
      return mockArticles.find(a => a.slug === slug) || mockArticles[0];
    }
    
    throw error;
  }
};

/**
 * Fetch related articles for a given article
 * @param {number|string} articleId - Article ID
 * @param {number} limit - Maximum number of related articles to fetch
 * @returns {Promise<Array>} - Related articles
 */
export const fetchRelatedArticles = async (articleId, limit = 3) => {
  try {
    console.log(`Fetching related articles for article ID ${articleId}`);
    const apiUrl = `/api/related-articles.php?id=${articleId}&limit=${limit}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error(`Error fetching related articles for article ID ${articleId}:`, error);
    
    if (MOCK_MODE) {
      console.warn('Using mock related articles due to API error');
      // Return a subset of mock articles as related
      return getMockArticles().slice(1, limit + 1);
    }
    
    return [];
  }
};

/**
 * Fetch flairs (categories) for articles
 * @returns {Promise<Array>} - List of flairs
 */
export const fetchFlairs = async () => {
  try {
    const response = await fetch('/api/flairs.php');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.flairs || [];
  } catch (error) {
    console.error('Error fetching flairs:', error);
    
    if (MOCK_MODE) {
      return [
        'residência', 'revalida', 'concursos médicos', 'casos clínicos',
        'guias práticos', 'atualização', 'procedimentos', 'cardiologia',
        'neurologia', 'ortopedia', 'pediatria', 'oncologia', 'psiquiatria',
        'diabetes', 'hipertensão', 'covid-19'
      ];
    }
    
    return [];
  }
};

/**
 * Create a new article
 * @param {Object} articleData - Article data
 * @returns {Promise<Object>} - Created article
 */
export const createArticle = async (articleData) => {
  try {
    console.log('Creating new article:', articleData);
    
    const response = await fetch('/api/article-create.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
      credentials: 'include', // Include cookies for authentication
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', response.status, errorData);
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    
    if (MOCK_MODE) {
      console.warn('Using mock response for article creation');
      return {
        ...articleData,
        id: Math.floor(Math.random() * 1000) + 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    
    throw error;
  }
};

/**
 * Update an existing article
 * @param {number|string} id - Article ID
 * @param {Object} articleData - Updated article data
 * @returns {Promise<Object>} - Updated article
 */
export const updateArticle = async (id, articleData) => {
  try {
    console.log(`Updating article ID ${id}:`, articleData);
    
    const response = await fetch(`/api/article-update.php?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
      credentials: 'include', // Include cookies for authentication
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', response.status, errorData);
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating article ID ${id}:`, error);
    
    if (MOCK_MODE) {
      console.warn('Using mock response for article update');
      return {
        ...articleData,
        id: parseInt(id),
        updated_at: new Date().toISOString(),
      };
    }
    
    throw error;
  }
};

/**
 * Delete an article
 * @param {number|string} id - Article ID
 * @returns {Promise<Object>} - Response data
 */
export const deleteArticle = async (id) => {
  try {
    console.log(`Deleting article ID ${id}`);
    
    const response = await fetch(`/api/article-delete.php?id=${id}`, {
      method: 'DELETE',
      credentials: 'include', // Include cookies for authentication
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', response.status, errorData);
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting article ID ${id}:`, error);
    
    if (MOCK_MODE) {
      console.warn('Using mock response for article deletion');
      return { success: true, message: 'Article deleted successfully' };
    }
    
    throw error;
  }
};

/**
 * Toggle article featured status
 * @param {number|string} id - Article ID
 * @param {boolean} featured - Featured status
 * @returns {Promise<Object>} - Updated article
 */
export const toggleFeatured = async (id, featured) => {
  try {
    console.log(`Toggling featured status for article ID ${id} to ${featured}`);
    
    const response = await fetch(`/api/article-featured.php?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ featured }),
      credentials: 'include', // Include cookies for authentication
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', response.status, errorData);
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error toggling featured status for article ID ${id}:`, error);
    
    if (MOCK_MODE) {
      console.warn('Using mock response for featured status toggle');
      return { 
        id: parseInt(id), 
        featured, 
        updated_at: new Date().toISOString() 
      };
    }
    
    throw error;
  }
};

/**
 * Get mock articles for development/testing
 * @returns {Array} - Mock articles
 */
function getMockArticles() {
  return [
    {
      id: 1,
      title: 'Como se preparar para a residência médica em 2023',
      slug: 'como-se-preparar-para-residencia-medica-2023',
      image_url: 'https://picsum.photos/800/500',
      excerpt: 'Dicas e estratégias para médicos recém-formados que desejam se preparar para as provas de residência médica no Brasil.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nisl nisl ultricies nisl, nec ultricies nisl nisl nec ultricies ultricies nisl.',
      flair: 'residência',
      author: 'Dr. Ricardo Martins',
      published_at: '2023-08-15T14:30:00',
      published_at_formatted: '15/08/2023',
      read_time: '8 min de leitura',
      views: 1240,
      featured: true,
      tags: ['residência', 'carreira', 'educação médica']
    },
    {
      id: 2,
      title: 'Atualização sobre tratamentos para hipertensão arterial',
      slug: 'atualizacao-tratamentos-hipertensao-arterial',
      image_url: 'https://picsum.photos/800/501',
      excerpt: 'As mais recentes diretrizes e recomendações para o tratamento da hipertensão arterial, incluindo novas classes de medicamentos.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nisl nisl ultricies nisl, nec ultricies nisl nisl nec ultricies ultricies nisl.',
      flair: 'atualização',
      author: 'Dra. Carla Mendes',
      published_at: '2023-07-28T10:15:00',
      published_at_formatted: '28/07/2023',
      read_time: '15 min de leitura',
      views: 859,
      featured: false,
      tags: ['hipertensão', 'cardiologia', 'tratamento']
    },
    {
      id: 3,
      title: 'Diagnóstico diferencial das cefaleias na emergência',
      slug: 'diagnostico-diferencial-cefaleias-emergencia',
      image_url: 'https://picsum.photos/800/502',
      excerpt: 'Um guia prático para o diagnóstico diferencial das cefaleias no contexto da emergência médica.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nisl nisl ultricies nisl, nec ultricies nisl nisl nec ultricies ultricies nisl.',
      flair: 'guias práticos',
      author: 'Dr. Paulo Rodrigues',
      published_at: '2023-08-05T09:45:00',
      published_at_formatted: '05/08/2023',
      read_time: '12 min de leitura',
      views: 732,
      featured: false,
      tags: ['neurologia', 'emergência', 'cefaleia']
    },
    {
      id: 4,
      title: 'Caso clínico: Púrpura trombocitopênica trombótica',
      slug: 'caso-clinico-purpura-trombocitopenica-trombotica',
      image_url: 'https://picsum.photos/800/503',
      excerpt: 'Discussão de um caso clínico de púrpura trombocitopênica trombótica, incluindo abordagem diagnóstica e terapêutica.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nisl nisl ultricies nisl, nec ultricies nisl nisl nec ultricies ultricies nisl.',
      flair: 'casos clínicos',
      author: 'Dra. Luciana Araújo',
      published_at: '2023-08-10T16:20:00',
      published_at_formatted: '10/08/2023',
      read_time: '10 min de leitura',
      views: 542,
      featured: false,
      tags: ['hematologia', 'caso clínico', 'diagnóstico']
    },
    {
      id: 5,
      title: 'Avanços no tratamento do diabetes tipo 2',
      slug: 'avancos-tratamento-diabetes-tipo-2',
      image_url: 'https://picsum.photos/800/504',
      excerpt: 'Os mais recentes avanços no tratamento do diabetes tipo 2, com foco em novas classes de medicamentos e abordagens terapêuticas.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nisl nisl ultricies nisl, nec ultricies nisl nisl nec ultricies ultricies nisl.',
      flair: 'atualização',
      author: 'Dr. Fernando Costa',
      published_at: '2023-07-20T11:30:00',
      published_at_formatted: '20/07/2023',
      read_time: '14 min de leitura',
      views: 925,
      featured: false,
      tags: ['diabetes', 'endocrinologia', 'tratamento']
    }
  ];
}

// Export as default object for easier imports
const ArticleService = {
  fetchArticles,
  fetchArticleById,
  fetchArticleBySlug,
  fetchRelatedArticles,
  fetchFlairs,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleFeatured
};

export default ArticleService; 