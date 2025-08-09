import React from 'react';
import '../styles/policy.css';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <Helmet>
        <title>Política de Privacidade | MedicinaHub</title>
        <meta name="description" content="Política de Privacidade do MedicinaHub - Como protegemos seus dados e respeitamos sua privacidade" />
      </Helmet>

      <div className="policy-header">
        <h1>Política de Privacidade</h1>
        <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="policy-content">
        <section>
          <h2>1. Introdução</h2>
          <p>
            Bem-vindo à Política de Privacidade do MedicinaHub. Esta política descreve como coletamos, usamos, 
            processamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços.
          </p>
          <p>
            A MedicinaHub valoriza sua privacidade e está comprometida em proteger seus dados pessoais. 
            Recomendamos que você leia esta política cuidadosamente para entender nossas práticas em relação 
            aos seus dados pessoais e como os trataremos.
          </p>
        </section>

        <section>
          <h2>2. Informações que Coletamos</h2>
          <p>Podemos coletar os seguintes tipos de informações:</p>
          <ul>
            <li>
              <strong>Informações de Registro:</strong> Nome, endereço de e-mail, senha, especialidade médica, 
              instituição, localização e outras informações fornecidas durante o cadastro.
            </li>
            <li>
              <strong>Informações de Perfil:</strong> Foto, biografia, interesses profissionais e outras 
              informações que você optar por compartilhar em seu perfil.
            </li>
            <li>
              <strong>Informações de Uso:</strong> Como você interage com nosso site, incluindo páginas visitadas, 
              conteúdos acessados, tempo gasto no site e outras estatísticas.
            </li>
            <li>
              <strong>Informações de Dispositivo:</strong> Endereço IP, tipo de navegador, provedor de serviços 
              de internet, sistema operacional e outras informações técnicas.
            </li>
            <li>
              <strong>Informações de Cookies e Tecnologias Semelhantes:</strong> Conforme detalhado em nossa 
              <a href="/cookies"> Política de Cookies</a>.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Como Usamos Suas Informações</h2>
          <p>Utilizamos suas informações para:</p>
          <ul>
            <li>Fornecer, manter e melhorar nossos serviços;</li>
            <li>Personalizar sua experiência com conteúdo relevante;</li>
            <li>Enviar notificações sobre congressos, residências e artigos de seu interesse;</li>
            <li>Processar suas transações e gerenciar sua conta;</li>
            <li>Comunicar-se com você sobre atualizações, suporte técnico e outras questões;</li>
            <li>Analisar tendências de uso e melhorar a eficácia do nosso site;</li>
            <li>Detectar, prevenir e resolver problemas técnicos e de segurança;</li>
            <li>Cumprir obrigações legais.</li>
          </ul>
        </section>

        <section>
          <h2>4. Compartilhamento de Informações</h2>
          <p>Podemos compartilhar suas informações nas seguintes circunstâncias:</p>
          <ul>
            <li>
              <strong>Parceiros e Fornecedores:</strong> Com terceiros que prestam serviços em nosso nome, 
              como processamento de pagamentos, análise de dados e suporte técnico.
            </li>
            <li>
              <strong>Cumprimento Legal:</strong> Para cumprir obrigações legais, proteger direitos ou 
              responder a processos legais.
            </li>
            <li>
              <strong>Consentimento:</strong> Quando você tiver consentido com o compartilhamento.
            </li>
            <li>
              <strong>Transferência de Negócios:</strong> Em conexão com uma fusão, aquisição ou venda de 
              ativos, onde suas informações podem ser transferidas como parte dos ativos do negócio.
            </li>
          </ul>
          <p>
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing 
            sem o seu consentimento.
          </p>
        </section>

        <section>
          <h2>5. Seus Direitos e Escolhas</h2>
          <p>Você tem certos direitos em relação aos seus dados pessoais, incluindo:</p>
          <ul>
            <li>Acessar e receber uma cópia dos seus dados pessoais;</li>
            <li>Retificar dados incorretos ou incompletos;</li>
            <li>Solicitar a exclusão de seus dados pessoais;</li>
            <li>Objetar ou restringir o processamento de seus dados;</li>
            <li>Retirar seu consentimento a qualquer momento;</li>
            <li>Solicitar a portabilidade de seus dados.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, entre em contato conosco através dos canais 
            indicados na seção "Contato" abaixo.
          </p>
        </section>

        <section>
          <h2>6. Segurança de Dados</h2>
          <p>
            Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações 
            pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, 
            nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro, 
            e não podemos garantir segurança absoluta.
          </p>
        </section>

        <section>
          <h2>7. Retenção de Dados</h2>
          <p>
            Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos para 
            os quais foram coletadas, incluindo para satisfazer requisitos legais, contábeis ou de relatórios.
          </p>
        </section>

        <section>
          <h2>8. Menores</h2>
          <p>
            Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente 
            informações pessoais de menores. Se soubermos que coletamos informações pessoais de um menor, 
            tomaremos medidas para excluir essas informações.
          </p>
        </section>

        <section>
          <h2>9. Mudanças nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas 
            práticas de informação. Encorajamos você a revisar esta política regularmente para manter-se 
            informado sobre como estamos protegendo suas informações.
          </p>
        </section>

        <section>
          <h2>10. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade ou desejar exercer seus direitos, 
            entre em contato conosco através do e-mail: <a href="mailto:contato@medicinahub.com.br">contato@medicinahub.com.br</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 