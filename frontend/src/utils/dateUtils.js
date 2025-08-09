/**
 * Date utility functions for the application
 */

/**
 * Format a date string to a readable format in Portuguese (BR)
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Data não informada";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida";
  
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  
  return date.toLocaleDateString('pt-BR', options);
};

/**
 * Calculate the number of days between today and a target date
 * @param {string} targetDate - Target date in YYYY-MM-DD format
 * @returns {string} Days difference as a string
 */
export const getDaysDifference = (targetDate) => {
  if (!targetDate || typeof targetDate !== 'string') {
    return "Data não informada";
  }

  const today = new Date();
  const target = new Date(targetDate.replace(/-/g, '/')); // Fix format for cross-browser compatibility
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  if (isNaN(target.getTime())) {
    return "Data inválida";
  }

  const diffTime = target - today;
  const days = Math.ceil(diffTime / (1000 * 3600 * 24));

  if (days < 0) return "Encerrado";
  if (days === 0) return "Hoje";
  return `${days} dia${days > 1 ? 's' : ''}`;
};
