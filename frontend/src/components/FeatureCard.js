const FeatureCard = ({ icon, title, text }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
};

const CongressCard = ({ data }) => {
    const formatDate = (dateString) => {
      if (!dateString) return "Data não informada";
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };
  
    const getDaysDifference = (targetDate) => {
      const today = new Date();
      const target = new Date(targetDate);
      const diffTime = target - today;
      const days = Math.ceil(diffTime / (1000 * 3600 * 24));
      
      if (days < 0) return "Encerrado";
      if (days === 0) return "Hoje";
      return `${days} dia${days > 1 ? 's' : ''}`;
    };
  
    return (
      <div className="congress-item">
        <h3>{data.name}</h3>
        <div className="meta">
          <p>📅 {formatDate(data.event_date)}</p>
          <p>📍 {data.state}</p>
          <p>🏥 {data.specialty}</p>
        </div>
        <div className="countdown">
          {getDaysDifference(data.event_date)}
        </div>
        <a href={data.website} className="btn">
          Saiba Mais
        </a>
      </div>
    );
  };

export default FeatureCard;