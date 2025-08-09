-- Create residencias database schema

-- Residências (Programs)
CREATE TABLE IF NOT EXISTS `residencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `institution` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `specialty` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(50) NOT NULL,
  `status_text` varchar(100) NOT NULL,
  `vacancies` int(11) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `edital_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `specialty` (`specialty`),
  KEY `location` (`location`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Especialidades (Specialties)
CREATE TABLE IF NOT EXISTS `especialidades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Status Types
CREATE TABLE IF NOT EXISTS `status_tipos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial data for status types
INSERT INTO `status_tipos` (`code`, `name`) VALUES 
('inscricoes_abertas', 'Inscrições Abertas'),
('inscricoes_encerradas', 'Inscrições Encerradas'),
('provas_agendadas', 'Provas Agendadas'),
('resultados_publicados', 'Resultados Publicados');

-- Initial data for specialties
INSERT INTO `especialidades` (`name`) VALUES 
('Anestesiologia'),
('Cardiologia'),
('Cirurgia Geral'),
('Clínica Médica'),
('Dermatologia'),
('Endocrinologia'),
('Gastroenterologia'),
('Geriatria'),
('Ginecologia e Obstetrícia'),
('Infectologia'),
('Medicina de Família e Comunidade'),
('Medicina Intensiva'),
('Nefrologia'),
('Neurologia'),
('Oftalmologia'),
('Oncologia'),
('Ortopedia e Traumatologia'),
('Otorrinolaringologia'),
('Pediatria'),
('Pneumologia'),
('Psiquiatria'),
('Radiologia'),
('Reumatologia'),
('Urologia'); 