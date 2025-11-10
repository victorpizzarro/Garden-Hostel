--
-- Banco de dados: `garden_db`
--

CREATE DATABASE IF NOT EXISTS `garden_db`
CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `garden_db`;

-- --------------------------------------------------------
-- Tabela: usuario
-- --------------------------------------------------------
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('cliente','admin') NOT NULL DEFAULT 'cliente',
  `documento` varchar(20) DEFAULT NULL,
  `tipo_documento` enum('CPF','RG','Passaporte') DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabela: quarto
-- --------------------------------------------------------
CREATE TABLE `quarto` (
  `id_quarto` int(11) NOT NULL AUTO_INCREMENT,
  `numero` varchar(10) DEFAULT NULL,
  `tipo` enum('Individual','Casal','Coletivo') DEFAULT NULL,
  `preco_diaria` decimal(10,2) NOT NULL,
  `descricao` text DEFAULT NULL,
  `status` enum('Disponível','Ocupado','Manutenção') NOT NULL DEFAULT 'Disponível',
  PRIMARY KEY (`id_quarto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabela: reserva
-- --------------------------------------------------------
CREATE TABLE `reserva` (
  `id_reserva` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_quarto` int(11) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `valor_total` decimal(10,2) DEFAULT NULL,
  `status` enum('Ativa','Cancelada','Finalizada') NOT NULL DEFAULT 'Ativa',
  `data_reserva` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_reserva`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_quarto` (`id_quarto`),
  CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reserva_quarto` FOREIGN KEY (`id_quarto`) REFERENCES `quarto` (`id_quarto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabela: servico_adicional
-- --------------------------------------------------------
CREATE TABLE `servico_adicional` (
  `id_servico` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_servico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabela: avaliacao
-- --------------------------------------------------------
CREATE TABLE `avaliacao` (
  `id_avaliacao` int(11) NOT NULL AUTO_INCREMENT,
  `id_reserva` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nota` int(11) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `data_avaliacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_avaliacao`),
  KEY `id_reserva` (`id_reserva`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `fk_avaliacao_reserva` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_avaliacao_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
