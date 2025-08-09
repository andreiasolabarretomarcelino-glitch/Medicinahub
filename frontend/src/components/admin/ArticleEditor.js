import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArticleService from '../../services/ArticleService';
import AuthService from '../../services/AuthService';
import { mockFlairs } from '../../pages/Portal';
import '../../styles/admin/article-editor.css';

// Import React Quill for rich text editing
// Note: You'll need to install this package with: npm install react-quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * ArticleEditor Component
 * Used for creating new articles and editing existing ones
 */
const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [flair, setFlair] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState('draft');
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    const user = AuthService.getUser();
    if (!user || user.role !== 'admin') {
      navigate('/login', { state: { from: `/admin/articles/${isEditMode ? 'edit/' + id : 'new'}` } });
    }
  }, [navigate, id, isEditMode]);
  
  // Load article data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          const article = await ArticleService.fetchArticleById(id);
          
          if (!article) {
            throw new Error('Article not found');
          }
          
          // Populate form with article data
          setTitle(article.title || '');
          setSlug(article.slug || '');
          setExcerpt(article.excerpt || '');
          setContent(article.content || '');
          setFlair(article.flair || '');
          setTags(article.tags || []);
          setStatus(article.status || 'draft');
          setFeatured(article.featured || false);
          setImageUrl(article.image_url || '');
          setImagePreview(article.image_url || '');
          
          // Reset form changed state after loading
          setFormChanged(false);
        } catch (err) {
          console.error('Error loading article:', err);
          setError('Failed to load article. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchArticle();
    }
  }, [id, isEditMode]);
  
  // Track form changes
  useEffect(() => {
    if (!loading) {
      setFormChanged(true);
    }
  }, [title, excerpt, content, flair, tags, status, featured, imageFile, imageUrl, loading]);
  
  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formChanged) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formChanged]);
  
  // Generate slug from title
  const generateSlug = () => {
    if (!slugEdited && title) {
      const newSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove consecutive hyphens
        .trim();
      
      setSlug(newSlug);
    }
  };
  
  // Handle slug manual edit
  const handleSlugChange = (e) => {
    setSlugEdited(true);
    setSlug(e.target.value);
  };
  
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Formato de imagem inválido. Use JPEG, PNG, WebP ou GIF.');
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 2MB.');
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Clear any existing image URL
    setImageUrl('');
  };
  
  // Handle tag input
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  
  // Add tag to list
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  // Remove tag from list
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Save article
  const saveArticle = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title) {
      setError('O título é obrigatório.');
      return;
    }
    
    if (!slug) {
      setError('O slug é obrigatório.');
      return;
    }
    
    if (!content) {
      setError('O conteúdo é obrigatório.');
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      // Prepare article data
      const articleData = {
        title,
        slug,
        excerpt,
        content,
        flair,
        tags,
        status,
        featured,
        image_url: imageUrl
      };
      
      // If we have a new image file, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        // Upload image
        const uploadResponse = await fetch('/api/upload-image.php', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
        
        const uploadResult = await uploadResponse.json();
        articleData.image_url = uploadResult.image_url;
      }
      
      // Save article
      let response;
      if (isEditMode) {
        response = await ArticleService.updateArticle(id, articleData);
      } else {
        response = await ArticleService.createArticle(articleData);
      }
      
      // Handle success
      setSuccessMessage(isEditMode ? 'Artigo atualizado com sucesso!' : 'Artigo criado com sucesso!');
      setFormChanged(false);
      
      // Redirect to article list after a short delay
      setTimeout(() => {
        if (isEditMode) {
          navigate(`/admin/articles`);
        } else {
          // For new articles, redirect to edit mode of the new article
          navigate(`/admin/articles/edit/${response.id}`);
        }
      }, 1500);
    } catch (err) {
      console.error('Error saving article:', err);
      setError(`Falha ao ${isEditMode ? 'atualizar' : 'criar'} o artigo. Por favor, tente novamente.`);
    } finally {
      setSaving(false);
    }
  };
  
  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'blockquote', 'code-block',
    'color', 'background'
  ];
  
  // Handle cancel button
  const handleCancel = () => {
    if (formChanged) {
      setShowLeaveConfirm(true);
    } else {
      navigate('/admin/articles');
    }
  };
  
  if (loading) {
    return (
      <div className="article-editor-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-pulse"></i>
          <p>Carregando artigo...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="article-editor-container">
      <Helmet>
        <title>
          {isEditMode ? 'Editar Artigo' : 'Novo Artigo'} | MedicinaHub Admin
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <h1>{isEditMode ? 'Editar Artigo' : 'Criar Novo Artigo'}</h1>
      
      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i> {successMessage}
        </div>
      )}
      
      <form onSubmit={saveArticle} className="article-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugEdited) {
                  generateSlug();
                }
              }}
              onBlur={generateSlug}
              placeholder="Título do artigo"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="slug">Slug *</label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={handleSlugChange}
              placeholder="slug-do-artigo"
              required
            />
            <small>URL amigável do artigo (sem espaços ou caracteres especiais)</small>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="flair">Categoria</label>
            <select
              id="flair"
              value={flair}
              onChange={(e) => setFlair(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              {mockFlairs.map(flairOption => (
                <option key={flairOption.id} value={flairOption.name}>
                  {flairOption.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
          
          <div className="form-group featured-checkbox">
            <label>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Destacar na página inicial
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="excerpt">Resumo</label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Breve resumo do artigo (exibido nos cards e resultados de busca)"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Conteúdo *</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Conteúdo do artigo..."
          />
        </div>
        
        <div className="form-group">
          <label>Imagem de Destaque</label>
          <div className="image-upload-container">
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                    setImageUrl('');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <div className="image-upload-placeholder">
                <i className="fas fa-image"></i>
                <p>Selecione uma imagem</p>
              </div>
            )}
            
            <div className="image-upload-actions">
              <input
                type="file"
                id="image"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="fas fa-upload"></i> Selecionar Imagem
              </button>
              
              <div className="image-url-input">
                <label htmlFor="imageUrl">Ou use uma URL:</label>
                <input
                  type="url"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                    setImageFile(null);
                  }}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>
            
            <small>Tamanho recomendado: 1200x630px. Máximo: 2MB.</small>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <div className="tags-input-container">
            <div className="tags-list">
              {tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              ))}
            </div>
            
            <div className="tag-input-wrapper">
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onBlur={addTag}
                placeholder="Adicionar tag (pressione Enter)"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim()}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <small>Pressione Enter ou vírgula para adicionar uma tag</small>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Salvando...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> {isEditMode ? 'Atualizar Artigo' : 'Criar Artigo'}
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Leave confirmation modal */}
      {showLeaveConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Alterações não salvas</h2>
            <p>Você tem alterações não salvas. Deseja sair sem salvar?</p>
            
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowLeaveConfirm(false)}
              >
                Continuar editando
              </button>
              <button
                className="btn btn-danger"
                onClick={() => navigate('/admin/articles')}
              >
                Sair sem salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleEditor; 