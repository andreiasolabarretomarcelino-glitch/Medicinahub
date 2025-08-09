import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthService from '../services/AuthService';
import ArticleService from '../services/ArticleService';
import ArticleCard from '../components/ArticleCard';
import '../styles/portal.css';

// Mock data for the Portal page - exported for use in ArticleDetail
export const mockFlairs = [
  // Carreira Médica
  { id: 1, name: 'residência', icon: 'fa-hospital' },
  { id: 2, name: 'revalida', icon: 'fa-clipboard-check' },
  { id: 3, name: 'concursos médicos', icon: 'fa-file-signature' },
  
  // Educação Médica
  { id: 4, name: 'casos clínicos', icon: 'fa-stethoscope' },
  { id: 5, name: 'guias práticos', icon: 'fa-book-medical' },
  { id: 6, name: 'atualização', icon: 'fa-sync' },
  { id: 7, name: 'procedimentos', icon: 'fa-procedures' },
  
  // Especialidades
  { id: 8, name: 'cardiologia', icon: 'fa-heartbeat' },
  { id: 9, name: 'neurologia', icon: 'fa-brain' },
  { id: 10, name: 'ortopedia', icon: 'fa-bone' },
  { id: 11, name: 'pediatria', icon: 'fa-baby' },
  { id: 12, name: 'oncologia', icon: 'fa-ribbon' },
  { id: 13, name: 'psiquiatria', icon: 'fa-user-md' },
  { id: 14, name: 'dermatologia', icon: 'fa-allergies' },
  { id: 15, name: 'oftalmologia', icon: 'fa-eye' },
  { id: 16, name: 'ginecologia', icon: 'fa-venus' },
  { id: 17, name: 'urologia', icon: 'fa-mars' },
  { id: 18, name: 'endocrinologia', icon: 'fa-tint' },
  { id: 19, name: 'pneumologia', icon: 'fa-lungs' },
  { id: 20, name: 'gastroenterologia', icon: 'fa-stomach' },
  
  // Doenças
  { id: 21, name: 'hipertensão', icon: 'fa-heart' },
  { id: 22, name: 'diabetes', icon: 'fa-syringe' },
  { id: 23, name: 'câncer', icon: 'fa-disease' },
  { id: 24, name: 'alzheimer', icon: 'fa-brain' },
  { id: 25, name: 'parkinson', icon: 'fa-hand-tremor' },
  { id: 26, name: 'covid-19', icon: 'fa-virus' },
  { id: 27, name: 'asma', icon: 'fa-lungs-virus' },
  { id: 28, name: 'artrite', icon: 'fa-bone' },
  
  // Procedimentos
  { id: 29, name: 'cirurgia', icon: 'fa-scalpel' },
  { id: 30, name: 'anestesia', icon: 'fa-syringe' },
  { id: 31, name: 'intubação', icon: 'fa-lungs' },
  { id: 32, name: 'sutura', icon: 'fa-thread' },
  { id: 33, name: 'biópsia', icon: 'fa-microscope' },
  { id: 34, name: 'punção lombar', icon: 'fa-spine' },
  
  // Farmacologia
  { id: 35, name: 'farmacologia', icon: 'fa-pills' },
  { id: 36, name: 'antibióticos', icon: 'fa-capsules' },
  { id: 37, name: 'analgésicos', icon: 'fa-tablets' },
  
  // Comunidade
  { id: 38, name: 'eventos', icon: 'fa-calendar-day' },
  { id: 39, name: 'congressos', icon: 'fa-users' }
];

// Group flairs by category for better organization
export const flairCategories = [
  {
    title: 'Carreira Médica',
    flairs: ['residência', 'revalida', 'concursos médicos']
  },
  {
    title: 'Educação Médica',
    flairs: ['casos clínicos', 'guias práticos', 'atualização', 'procedimentos']
  },
  {
    title: 'Especialidades',
    flairs: ['cardiologia', 'neurologia', 'ortopedia', 'pediatria', 'oncologia', 'psiquiatria', 'dermatologia', 'oftalmologia', 'ginecologia', 'urologia', 'endocrinologia', 'pneumologia', 'gastroenterologia']
  },
  {
    title: 'Doenças',
    flairs: ['hipertensão', 'diabetes', 'câncer', 'alzheimer', 'parkinson', 'covid-19', 'asma', 'artrite']
  },
  {
    title: 'Procedimentos',
    flairs: ['cirurgia', 'anestesia', 'intubação', 'sutura', 'biópsia', 'punção lombar']
  },
  {
    title: 'Farmacologia',
    flairs: ['farmacologia', 'antibióticos', 'analgésicos']
  },
  {
    title: 'Comunidade',
    flairs: ['eventos', 'congressos']
  }
];

export const mockPosts = [
  {
    id: 1,
    title: 'Guia Completo de Preparação para Residência Médica 2024',
    excerpt: 'Estratégias eficientes, recursos essenciais e um plano de estudos estruturado para maximizar suas chances de sucesso na prova de residência médica.',
    content: `
      <h2>Planejando sua jornada rumo à residência médica</h2>
      <p>A preparação para a residência médica representa uma das fases mais decisivas na carreira de um médico. Com a competitividade crescente, uma abordagem estratégica de estudos tornou-se indispensável para os candidatos que almejam conquistar uma vaga nas instituições mais prestigiadas do país.</p>
      
      <h2>Cronograma estratégico: a base do sucesso</h2>
      <p>Um planejamento eficaz começa pela análise do edital e distribuição inteligente do conteúdo ao longo do tempo disponível. Recomendamos a divisão do cronograma em três fases:</p>
      
      <h3>Fase 1: Revisão Conceitual (6-8 meses antes da prova)</h3>
      <ul>
        <li>Estudo abrangente das principais áreas da medicina</li>
        <li>Foco em entender conceitos fundamentais</li>
        <li>Utilização de livros-texto e materiais didáticos de referência</li>
      </ul>
      
      <h3>Fase 2: Resolução Intensiva de Questões (3-5 meses antes)</h3>
      <ul>
        <li>Priorização de provas anteriores da instituição alvo</li>
        <li>Identificação de padrões recorrentes de questões</li>
        <li>Revisão direcionada dos temas com maior incidência</li>
      </ul>
      
      <h3>Fase 3: Simulados e Revisão Final (últimos 2 meses)</h3>
      <ul>
        <li>Realização de simulados completos em condições similares à prova</li>
        <li>Revisão dos pontos de maior dificuldade</li>
        <li>Consolidação de conhecimentos através de mapas mentais e resumos</li>
      </ul>
      
      <h2>Recursos essenciais para sua preparação</h2>
      
      <h3>Materiais de estudo recomendados</h3>
      <p>A seleção criteriosa de materiais é fundamental para otimizar o tempo de estudo. Recomendamos:</p>
      <ul>
        <li><strong>Medicina Interna de Harrison</strong> - Referência para clínica médica</li>
        <li><strong>Sabiston: Tratado de Cirurgia</strong> - Essencial para área cirúrgica</li>
        <li><strong>Williams Obstetrícia</strong> - Referência em ginecologia e obstetrícia</li>
        <li><strong>Nelson: Tratado de Pediatria</strong> - Fundamental para pediatria</li>
        <li><strong>Kaplan & Sadock: Compêndio de Psiquiatria</strong> - Base para saúde mental</li>
      </ul>
      
      <h3>Plataformas digitais e aplicativos</h3>
      <p>Complemente seu estudo com recursos tecnológicos:</p>
      <ul>
        <li><strong>Aplicativos de questões</strong> - Permitem praticar em qualquer lugar</li>
        <li><strong>Plataformas de videoaulas</strong> - Úteis para revisão rápida</li>
        <li><strong>Grupos de estudo online</strong> - Promovem discussão de casos e troca de conhecimentos</li>
      </ul>
      
      <h2>Equilíbrio e bem-estar durante a preparação</h2>
      <p>Não subestime a importância de manter sua saúde física e mental durante o período de preparação:</p>
      <ul>
        <li>Estabeleça uma rotina que inclua pausas regulares e momentos de descompressão</li>
        <li>Pratique atividades físicas regularmente para reduzir o estresse</li>
        <li>Mantenha uma alimentação equilibrada e hidratação adequada</li>
        <li>Garanta um sono de qualidade, essencial para a consolidação da memória</li>
      </ul>
      
      <h2>Na véspera da prova</h2>
      <p>As últimas 48 horas antes do exame devem ser dedicadas a:</p>
      <ul>
        <li>Revisão leve de tópicos-chave através de resumos e fluxogramas</li>
        <li>Preparação de documentos e itens necessários para o dia da prova</li>
        <li>Visita prévia ao local da prova (se possível)</li>
        <li>Descanso adequado para garantir plena capacidade cognitiva</li>
      </ul>
      
      <h2>Conclusão</h2>
      <p>A aprovação na residência médica é resultado de uma preparação metódica e consistente. Ao seguir as recomendações deste guia e adaptá-las às suas necessidades individuais, você estará construindo uma base sólida para enfrentar esse desafio com confiança e determinação.</p>
      
      <p>Lembre-se: cada hora de estudo bem planejada representa um passo a mais em direção à sua especialização e ao futuro profissional que você almeja construir.</p>
    `,
    author: 'Dra. Camila Mendes',
    flair: 'residência',
    publishedAt: '2024-02-18T14:30:00',
    updatedAt: '2024-03-05T09:15:00',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=700',
    readTime: '12 min',
    views: 3240,
    featured: true
  },
  {
    id: 2,
    title: 'Caso Clínico: Abordagem Diagnóstica da Síndrome de Guillain-Barré em Apresentação Atípica',
    excerpt: 'Análise detalhada de um caso desafiador de Síndrome de Guillain-Barré com manifestações clínicas não convencionais e discussão da abordagem diagnóstica multidisciplinar.',
    content: `
      <h2>Apresentação do caso</h2>
      <p>Paciente do sexo masculino, 35 anos, engenheiro, previamente hígido, procurou atendimento médico com queixa de fraqueza progressiva nos membros inferiores iniciada há 5 dias. Relatava que os sintomas começaram com dificuldade para subir escadas e sensação de "peso nas pernas", progredindo para dificuldade de deambulação. Negava dor, alterações urinárias ou intestinais. Como antecedente relevante, havia apresentado um quadro de infecção de vias aéreas superiores duas semanas antes, tratado com sintomáticos, com resolução completa.</p>
      
      <h2>Exame físico</h2>
      <p>Ao exame neurológico inicial:</p>
      <ul>
        <li>Consciente, orientado e comunicativo</li>
        <li>Funções cognitivas preservadas</li>
        <li>Pares cranianos sem alterações</li>
        <li>Força muscular grau 3/5 em membros inferiores, simétrica</li>
        <li>Reflexos patelares e aquileus ausentes bilateralmente</li>
        <li>Reflexos cutâneo-abdominais presentes</li>
        <li>Sensibilidade tátil, dolorosa, vibratória e proprioceptiva preservadas</li>
        <li>Sinais de Lasègue e Kernig negativos</li>
        <li>Coordenação e marcha não testáveis devido à fraqueza</li>
        <li>Sinais vitais: PA 130/80 mmHg; FC 88 bpm; Temperatura 36,8°C</li>
      </ul>
      
      <h2>Hipótese diagnóstica inicial</h2>
      <p>Diante do quadro clínico de paraparesia flácida arreflexa ascendente precedida por quadro infeccioso, foram consideradas as seguintes hipóteses:</p>
      <ol>
        <li>Síndrome de Guillain-Barré (polirradiculoneuropatia desmielinizante inflamatória aguda)</li>
        <li>Mielite transversa</li>
        <li>Polineuropatia aguda tóxica ou metabólica</li>
        <li>Compressão medular aguda</li>
      </ol>
      
      <h2>Exames complementares</h2>
      <p>Foram solicitados:</p>
      
      <h3>Análise do líquor (D1 de internação)</h3>
      <table border="1" style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <th style="padding: 8px; text-align: left; background-color: #f2f2f2;">Parâmetro</th>
          <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">Resultado</th>
          <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">Valor de Referência</th>
        </tr>
        <tr>
          <td style="padding: 8px;">Aspecto</td>
          <td style="padding: 8px; text-align: center;">Límpido e incolor</td>
          <td style="padding: 8px; text-align: center;">Límpido e incolor</td>
        </tr>
        <tr>
          <td style="padding: 8px;">Proteínas</td>
          <td style="padding: 8px; text-align: center;">142 mg/dL</td>
          <td style="padding: 8px; text-align: center;">15-45 mg/dL</td>
        </tr>
        <tr>
          <td style="padding: 8px;">Glicose</td>
          <td style="padding: 8px; text-align: center;">68 mg/dL</td>
          <td style="padding: 8px; text-align: center;">50-80 mg/dL</td>
        </tr>
        <tr>
          <td style="padding: 8px;">Celularidade</td>
          <td style="padding: 8px; text-align: center;">2 células/mm³</td>
          <td style="padding: 8px; text-align: center;">0-5 células/mm³</td>
        </tr>
        <tr>
          <td style="padding: 8px;">Culturas</td>
          <td style="padding: 8px; text-align: center;">Negativas</td>
          <td style="padding: 8px; text-align: center;">Negativas</td>
        </tr>
      </table>
      
      <h3>Eletroneuromiografia (D2 de internação)</h3>
      <p>Evidenciou polineuropatia desmielinizante aguda, com:</p>
      <ul>
        <li>Redução das velocidades de condução motora e sensitiva</li>
        <li>Aumento das latências distais</li>
        <li>Bloqueios de condução parciais</li>
        <li>Dispersão temporal dos potenciais compostos de ação muscular</li>
        <li>Ausência de ondas F</li>
      </ul>
      
      <h3>Ressonância magnética (D1 de internação)</h3>
      <ul>
        <li>Cérebro: sem alterações</li>
        <li>Coluna cervical e torácica: sem evidência de compressão medular</li>
        <li>Achado: discreto realce pós-contraste das raízes da cauda equina e do cone medular</li>
      </ul>
      
      <h3>Sorologias (coletadas na admissão)</h3>
      <ul>
        <li>Campylobacter jejuni: IgM positivo</li>
        <li>Citomegalovírus, Epstein-Barr, HIV, Hepatites B e C: negativos</li>
        <li>VDRL: não reagente</li>
      </ul>
      
      <h2>Evolução clínica</h2>
      <p>Nas primeiras 24 horas após a admissão hospitalar, o paciente evoluiu com:</p>
      <ul>
        <li>Progressão ascendente da fraqueza, acometendo membros superiores (força grau 4/5)</li>
        <li>Dispneia leve aos esforços</li>
        <li>Disfagia leve</li>
        <li>Episódios de taquicardia (FC até 120 bpm) e sudorese profusa</li>
      </ul>
      
      <p>Considerando a rápida evolução e os sinais de disfunção autonômica, o paciente foi transferido para Unidade de Terapia Intensiva para monitorização e suporte ventilatório caso necessário.</p>
      
      <h2>Tratamento</h2>
      <p>Iniciado no D2 de internação:</p>
      <ul>
        <li>Imunoglobulina humana endovenosa na dose de 0,4g/kg/dia por 5 dias</li>
        <li>Monitorização contínua dos parâmetros ventilatórios</li>
        <li>Profilaxia para trombose venosa profunda</li>
        <li>Fisioterapia motora e respiratória</li>
      </ul>
      
      <h2>Evolução e desfecho</h2>
      <p>O paciente evoluiu com necessidade de ventilação mecânica no D3 de internação devido à insuficiência respiratória progressiva, com capacidade vital forçada inferior a 15 mL/kg. Permaneceu em ventilação mecânica por 10 dias, sendo extubado com sucesso após melhora dos parâmetros ventilatórios.</p>
      
      <p>A recuperação da força muscular foi gradativa, iniciando pelos membros superiores. Após 21 dias de internação, o paciente apresentava:</p>
      <ul>
        <li>Força grau 4/5 em membros superiores</li>
        <li>Força grau 3/5 em membros inferiores</li>
        <li>Reflexos tendinosos ainda abolidos</li>
        <li>Estabilidade hemodinâmica e parâmetros ventilatórios normais</li>
      </ul>
      
      <p>Recebeu alta hospitalar após 30 dias de internação, encaminhado para serviço de reabilitação ambulatorial, com melhora gradativa do quadro motor nas semanas subsequentes.</p>
      
      <h2>Discussão</h2>
      <p>Este caso ilustra uma apresentação de Síndrome de Guillain-Barré (SGB) com características atípicas que merecem destaque:</p>
      
      <h3>Progressão rápida da doença</h3>
      <p>A evolução de paraparesia para tetraparesia com insuficiência respiratória em menos de 72 horas é incomum e constitui fator de pior prognóstico. A literatura descreve que apenas 30% dos pacientes com SGB necessitam de ventilação mecânica, geralmente após períodos mais prolongados de progressão dos sintomas.</p>
      
      <h3>Disfunção autonômica significativa</h3>
      <p>A presença precoce de instabilidade hemodinâmica e disautonomia é um sinal de alerta para formas mais graves da doença. A monitorização intensiva desses pacientes é fundamental, pois arritmias cardíacas e flutuações pressóricas podem ocorrer de forma súbita e representar risco à vida.</p>
      
      <h3>Associação com infecção por Campylobacter jejuni</h3>
      <p>A identificação do agente desencadeante tem importância prognóstica. Casos associados a infecção prévia por Campylobacter jejuni têm maior probabilidade de apresentar a variante axonal da doença (AMAN - Neuropatia Axonal Motora Aguda), com recuperação potencialmente mais lenta e maiores taxas de sequelas permanentes.</p>
      
      <h2>Pontos-chave para a prática clínica</h2>
      <ol>
        <li><strong>Vigilância respiratória:</strong> A capacidade vital deve ser monitorada regularmente, sendo que valores inferiores a 20 mL/kg ou queda superior a 30% do valor predito indicam alto risco para insuficiência respiratória iminente.</li>
        <li><strong>Tratamento precoce:</strong> Tanto a imunoglobulina quanto a plasmaférese são eficazes quando iniciadas nos primeiros 14 dias de sintomas, com benefício progressivamente reduzido após esse período.</li>
        <li><strong>Abordagem multidisciplinar:</strong> O envolvimento de neurologistas, intensivistas, fisioterapeutas e reabilitadores desde o início é fundamental para otimizar o desfecho funcional.</li>
        <li><strong>Atenção aos sinais atípicos:</strong> Dor intensa, progressão muito rápida, envolvimento sensitivo desproporcional ou disfunção autonômica significativa podem indicar variantes da SGB ou diagnósticos alternativos.</li>
      </ol>
      
      <h2>Conclusão</h2>
      <p>A Síndrome de Guillain-Barré permanece um desafio diagnóstico, especialmente em suas apresentações atípicas. Este caso reforça a importância da vigilância clínica contínua, mesmo após o diagnóstico estabelecido, e da intervenção precoce frente a sinais de agravamento. A recuperação geralmente ocorre em sentido inverso à instalação dos sintomas, sendo a reabilitação precoce um componente essencial do tratamento.</p>
    `,
    author: 'Dr. Rafael Almeida',
    flair: 'casos clínicos',
    publishedAt: '2024-03-01T10:20:00',
    updatedAt: '2024-03-01T10:20:00',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=700',
    readTime: '15 min',
    views: 1856,
    featured: false
  }
];

/**
 * Portal page component
 * Displays medical articles and educational content
 */
const Portal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlair, setSelectedFlair] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Function to fetch articles based on filters
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Log the filters for debugging
      console.log('Fetching articles with filters:', { 
        search: searchTerm, 
        flair: selectedFlair,
        page: currentPage
      });
      
      // Call the ArticleService to fetch articles
      const response = await ArticleService.fetchArticles({
        search: searchTerm,
        flair: selectedFlair,
        page: currentPage
      });
      
      console.log('Articles response:', response);
      
      // Clear console group for clean logs
      console.groupEnd();
      console.group('Article data processing');
      
      // Check if response has articles and pagination data
      if (response && response.articles) {
        console.log(`Received ${response.articles.length} articles for page ${currentPage}`);
        
        if (response.articles.length === 0 && currentPage > 1) {
          console.warn('No articles found for this page, resetting to page 1');
          setCurrentPage(1);
          // Return early - we'll refetch with page 1
          setLoading(false);
          return;
        }
        
        setArticles(response.articles);
        setTotalPages(response.pagination?.totalPages || 1);
        
        console.log(`Total pages: ${response.pagination?.totalPages || 1}`);
      } else {
        console.error('Unexpected API response format:', response);
        setArticles([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Não foi possível carregar os artigos. Por favor, tente novamente mais tarde.');
      // Don't clear articles on error to prevent flash of empty state
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  }, [searchTerm, selectedFlair, currentPage]);
  
  useEffect(() => {
    // Get current user
    const currentUser = AuthService.getUser();
    setUser(currentUser);
    
    // Check URL params for flair filter, search, and page
    const searchParams = new URLSearchParams(location.search);
    const flairParam = searchParams.get('flair');
    const searchParam = searchParams.get('q');
    const pageParam = searchParams.get('page');
    const tagParam = searchParams.get('tag');
    
    // Set state from URL parameters
    if (flairParam) {
      setSelectedFlair(flairParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    if (tagParam) {
      // If tag parameter exists, set it as search term
      setSearchTerm(tagParam);
    }
    
    if (pageParam && !isNaN(parseInt(pageParam)) && parseInt(pageParam) > 0) {
      setCurrentPage(parseInt(pageParam));
    } else {
      setCurrentPage(1); // Reset to page 1 if no valid page parameter
    }
    
  }, [location.search]);
  
  // Separate effect to handle actual API call - prevents duplicate calls
  useEffect(() => {
    // Fetch articles based on current filters
    fetchArticles();
    
    // Scroll to top when page changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [fetchArticles]);

  // Handle flair selection
  const handleFlairClick = (flair) => {
    setSelectedFlair(flair === selectedFlair ? '' : flair);
    setCurrentPage(1); // Reset to page 1 when changing filters
    
    // Update URL with flair parameter for better SEO
    const searchParams = new URLSearchParams();
    if (flair && flair !== selectedFlair) {
      searchParams.set('flair', flair);
    }
    
    // Keep the search term if it exists
    if (searchTerm) {
      searchParams.set('q', searchTerm);
    }
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 when searching
    
    // Update URL with search parameter
    const searchParams = new URLSearchParams();
    if (searchTerm) {
      searchParams.set('q', searchTerm);
    }
    
    // Keep the flair if it exists
    if (selectedFlair) {
      searchParams.set('flair', selectedFlair);
    }
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setCurrentPage(newPage);
    
    // Update URL with page parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', newPage.toString());
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };

  // Find featured article if any
  const featuredArticle = articles.find(article => article.featured);
  
  // Generate meta description based on current view
  const getMetaDescription = () => {
    if (selectedFlair) {
      return `Artigos médicos sobre ${selectedFlair} no Portal MedicinaHub. Conteúdo especializado para profissionais e estudantes de medicina.`;
    } else if (searchTerm) {
      return `Resultados da busca por "${searchTerm}" no Portal MedicinaHub. Artigos médicos e conteúdo especializado.`;
    } else {
      return 'Portal MedicinaHub: artigos médicos, casos clínicos, atualizações e guias práticos para profissionais e estudantes de medicina.';
    }
  };

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>
          {selectedFlair 
            ? `${selectedFlair} | Portal MedicinaHub` 
            : searchTerm 
              ? `Busca: ${searchTerm} | Portal MedicinaHub` 
              : 'Portal MedicinaHub - Artigos Médicos e Conteúdo Especializado'}
        </title>
        <meta name="description" content={getMetaDescription()} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://medicinahub.com.br${location.pathname}${location.search}`} />
        
        {/* OpenGraph tags */}
        <meta property="og:title" content={selectedFlair ? `${selectedFlair} | Portal MedicinaHub` : 'Portal MedicinaHub'} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://medicinahub.com.br${location.pathname}${location.search}`} />
        <meta property="og:image" content="https://medicinahub.com.br/images/og-portal.jpg" />
        
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={selectedFlair ? `${selectedFlair} | Portal MedicinaHub` : 'Portal MedicinaHub'} />
        <meta name="twitter:description" content={getMetaDescription()} />
        <meta name="twitter:image" content="https://medicinahub.com.br/images/og-portal.jpg" />
        
        {/* Preconnect to required origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://via.placeholder.com" crossOrigin="anonymous" />
      </Helmet>
    
      <div className="portal-wrapper">
        <section className="portal-hero">
          <div className="container">
            <h1>Portal MedicinaHub</h1>
            <p>Conhecimento médico de qualidade para sua formação e atualização profissional</p>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Buscar artigos por título, conteúdo ou autor..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Buscar artigos"
                />
                <button type="submit" aria-label="Buscar">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
          </div>
        </section>
        
        <div className="container">
          <div className="portal-content">
            <aside className="portal-sidebar">
              <button className="sidebar-close" onClick={() => document.body.classList.remove('filters-active')}>
                <i className="fas fa-times"></i>
              </button>
              <button className="mobile-filters-toggle" onClick={() => document.body.classList.toggle('filters-active')}>
                <i className="fas fa-filter"></i>
              </button>
              <div className="sidebar-content">
                {flairCategories.map((category, index) => (
                  <div className="flair-category" key={index}>
                    <h3>{category.title}</h3>
                    <ul className="flair-list">
                      {mockFlairs
                        .filter(flair => category.flairs.includes(flair.name))
                        .map(flair => (
                          <li 
                            key={flair.id}
                            className={selectedFlair === flair.name ? 'active' : ''}
                            onClick={() => handleFlairClick(flair.name)}
                          >
                            <i className={`fas ${flair.icon}`}></i>
                            <span>{flair.name}</span>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                ))}
                
                {(selectedFlair || searchTerm) && (
                  <div className="flair-category">
                    <button 
                      className="clear-filters"
                      onClick={() => {
                        setSelectedFlair('');
                        setSearchTerm('');
                        navigate(location.pathname);
                      }}
                    >
                      <i className="fas fa-times-circle"></i> Limpar filtros
                    </button>
                  </div>
                )}
                
                {user?.role === 'admin' && (
                  <div className="admin-section">
                    <h3>Administração</h3>
                    <Link to="/admin/articles" className="btn btn-primary">
                      <i className="fas fa-newspaper"></i> Gerenciar Artigos
                    </Link>
                    <Link to="/admin/articles/new" className="btn btn-success">
                      <i className="fas fa-plus"></i> Criar Novo Artigo
                    </Link>
                  </div>
                )}
              </div>
            </aside>
            
            <main className="portal-main">
              {loading ? (
                <div className="loading-spinner">
                  <i className="fas fa-spinner fa-pulse"></i>
                  <p>Carregando artigos...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <h3>Erro ao carregar artigos</h3>
                  <p>{error}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => fetchArticles()}
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : articles.length > 0 ? (
                <>
                  <div className="portal-header">
                    <h2>
                      {selectedFlair ? `Artigos sobre ${selectedFlair}` : 'Artigos em Destaque'}
                      {searchTerm && ` relacionados a "${searchTerm}"`}
                    </h2>
                    <p className="results-count">{articles.length} artigo(s) encontrado(s)</p>
                    {totalPages > 1 && (
                      <p className="page-indicator">Página {currentPage} de {totalPages}</p>
                    )}
                  </div>
                  
                  {/* Featured article (if any) */}
                  {featuredArticle && !selectedFlair && !searchTerm && currentPage === 1 && (
                    <div className="featured-article">
                      <ArticleCard 
                        article={featuredArticle} 
                        onFlairClick={handleFlairClick}
                      />
                      <div className="featured-badge">
                        <i className="fas fa-star"></i> Em destaque
                      </div>
                    </div>
                  )}
                  
                  <div className="articles-grid">
                    {articles
                      .filter(article => !article.featured || selectedFlair || searchTerm || currentPage > 1)
                      .map(article => (
                        <ArticleCard 
                          key={article.id} 
                          article={article} 
                          onFlairClick={handleFlairClick}
                        />
                      ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        className="page-button prev"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-label="Página anterior"
                      >
                        <i className="fas fa-chevron-left"></i> Anterior
                      </button>
                      
                      <div className="page-numbers">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          // Show 5 page numbers centered around current page
                          let pageToShow;
                          if (totalPages <= 5) {
                            // If 5 or fewer total pages, show all pages
                            pageToShow = i + 1;
                          } else if (currentPage <= 3) {
                            // If near start, show first 5 pages
                            pageToShow = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            // If near end, show last 5 pages
                            pageToShow = totalPages - 4 + i;
                          } else {
                            // Otherwise show 2 before and 2 after current page
                            pageToShow = currentPage - 2 + i;
                          }
                          
                          return (
                            <button 
                              key={pageToShow}
                              className={`page-number ${currentPage === pageToShow ? 'active' : ''}`}
                              onClick={() => handlePageChange(pageToShow)}
                              aria-label={`Página ${pageToShow}`}
                              aria-current={currentPage === pageToShow ? 'page' : undefined}
                            >
                              {pageToShow}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button 
                        className="page-button next"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-label="Próxima página"
                      >
                        Próxima <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <h3>Nenhum artigo encontrado</h3>
                  <p>Tente uma busca diferente ou selecione outra categoria.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedFlair('');
                      navigate(location.pathname);
                    }}
                  >
                    Ver todos os artigos
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      
      {/* Add overlay div */}
      <div className="sidebar-overlay" onClick={() => document.body.classList.remove('filters-active')}></div>
    </>
  );
};

export default Portal;
