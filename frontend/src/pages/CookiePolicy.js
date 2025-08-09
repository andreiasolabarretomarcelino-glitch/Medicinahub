import React from 'react';
import '../styles/style.css';

const CookiePolicy = () => {
  return (
    <div className="page-container">
      <div className="container">
        <div className="policy-content">
          <h1>Política de Cookies</h1>
          <div className="policy-section">
            <h2>O que são cookies?</h2>
            <p>
              Cookies são pequenos arquivos de texto que são armazenados no seu computador ou dispositivo móvel
              quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de
              maneira mais eficiente e fornecer informações aos proprietários do site.
            </p>
          </div>

          <div className="policy-section">
            <h2>Como utilizamos cookies</h2>
            <p>
              O MedicinaHub utiliza cookies para melhorar sua experiência em nosso site, personalizar conteúdo
              e anúncios, fornecer recursos de mídia social e analisar nosso tráfego. Também compartilhamos
              informações sobre o uso do nosso site com nossos parceiros de mídia social, publicidade e análise.
            </p>
          </div>

          <div className="policy-section">
            <h2>Tipos de cookies que utilizamos</h2>
            <ul>
              <li>
                <strong>Cookies essenciais:</strong> Necessários para o funcionamento básico do site, permitindo
                recursos como login e acesso a áreas seguras.
              </li>
              <li>
                <strong>Cookies de desempenho:</strong> Coletam informações anônimas sobre como os usuários navegam
                pelo site, ajudando-nos a melhorar seu funcionamento.
              </li>
              <li>
                <strong>Cookies de funcionalidade:</strong> Permitem que o site lembre de escolhas que você faz
                para fornecer uma experiência mais personalizada.
              </li>
              <li>
                <strong>Cookies de publicidade:</strong> Usados para entregar anúncios mais relevantes para você
                e seus interesses.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>Como gerenciar cookies</h2>
            <p>
              A maioria dos navegadores permite que você controle cookies através das configurações. Você pode
              configurar seu navegador para recusar todos os cookies, aceitar apenas cookies de determinados sites,
              ou alertá-lo quando um site está tentando colocar um cookie.
            </p>
            <p>
              No entanto, observe que a desativação de cookies pode afetar a funcionalidade deste e de muitos outros
              sites que você visita. Desabilitar cookies geralmente resultará na desativação de certas funcionalidades
              e recursos deste site.
            </p>
          </div>

          <div className="policy-section">
            <h2>Cookies de terceiros</h2>
            <p>
              Em alguns casos especiais, também utilizamos cookies fornecidos por terceiros confiáveis. A seção a
              seguir detalha quais cookies de terceiros você pode encontrar através deste site.
            </p>
            <ul>
              <li>
                Este site utiliza o Google Analytics, uma das soluções de análise mais difundidas e confiáveis da
                web, para nos ajudar a entender como você usa o site e como podemos melhorar sua experiência.
                Esses cookies podem rastrear itens como quanto tempo você gasta no site e as páginas visitadas,
                para que possamos continuar produzindo conteúdo atraente.
              </li>
              <li>
                Também podemos utilizar cookies de mídia social para que você possa compartilhar nosso conteúdo
                em redes sociais como Facebook e Twitter. Esses cookies podem rastrear seu navegador em outros sites
                e criar um perfil de seus interesses, o que pode influenciar o conteúdo e as mensagens que você vê
                em outros sites que visita.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>Atualizações na nossa política de cookies</h2>
            <p>
              Podemos atualizar nossa política de cookies de tempos em tempos. Recomendamos que você verifique esta
              página regularmente para se manter informado sobre quaisquer alterações.
            </p>
            <p>
              Esta política foi atualizada pela última vez em 14 de março de 2024.
            </p>
          </div>

          <div className="policy-section">
            <h2>Contato</h2>
            <p>
              Se você tiver dúvidas sobre como utilizamos cookies, por favor entre em contato conosco através do email:
              <a href="mailto:contato@medicinahub.com.br"> contato@medicinahub.com.br</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy; 