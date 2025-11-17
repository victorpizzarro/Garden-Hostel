-- Cria o banco de dados 'albergue_db'
CREATE DATABASE IF NOT EXISTS `albergue_db`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Define o banco de dados 'albergue_db' como o padrão para as próximas queries
USE `albergue_db`;

--
-- Estrutura da tabela `Usuarios`
--
CREATE TABLE IF NOT EXISTS `Usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome_completo` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `senha` VARCHAR(255) NOT NULL,
  `documento_tipo` ENUM('CPF', 'PASSAPORTE', 'IDENTIDADE') NOT NULL,
  `documento_numero` VARCHAR(100) NOT NULL UNIQUE,
  `data_nascimento` DATE NOT NULL,
  `telefone_celular` VARCHAR(20) NOT NULL,
  `tipo_usuario` ENUM('CLIENTE', 'ATENDENTE', 'ADMIN_MASTER') NOT NULL DEFAULT 'CLIENTE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Enderecos`
--
CREATE TABLE IF NOT EXISTS `Enderecos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_usuario_id` INT NOT NULL,
  `cep` VARCHAR(10) NULL,
  `logradouro` VARCHAR(255) NULL,
  `numero` VARCHAR(20) NULL,
  `complemento` VARCHAR(100) NULL,
  `bairro` VARCHAR(100) NULL,
  `cidade` VARCHAR(100) NULL,
  `estado` VARCHAR(2) NULL,
  FOREIGN KEY (`fk_usuario_id`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Quartos` (VERSÃO CORRIGIDA)
--
CREATE TABLE IF NOT EXISTS `Quartos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `descricao_pt` TEXT NULL,
  `descricao_en` TEXT NULL,
  `tipo` ENUM('MISTO', 'FEMININO', 'MASCULINO') NOT NULL DEFAULT 'MISTO',
  `capacidade` INT NOT NULL,
  `tem_banheiro` BOOLEAN NOT NULL DEFAULT FALSE,
  `preco_diaria` DECIMAL(10, 2) NOT NULL,
  `data_entrada` DATE NULL DEFAULT NULL,
  `data_saida` DATE NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Vagas`
--
CREATE TABLE IF NOT EXISTS `Vagas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_quarto_id` INT NOT NULL,
  `nome_identificador` VARCHAR(50) NOT NULL,
  `descricao_peculiaridades_pt` TEXT NULL,
  `descricao_peculiaridades_en` TEXT NULL,
  UNIQUE KEY `idx_quarto_identificador` (`fk_quarto_id`, `nome_identificador`),
  FOREIGN KEY (`fk_quarto_id`) REFERENCES `Quartos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Reservas`
--
CREATE TABLE IF NOT EXISTS `Reservas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_cliente_id` INT NOT NULL,
  `fk_atendente_id` INT NULL,
  `data_checkin` DATETIME NOT NULL,
  `data_checkout` DATETIME NOT NULL,
  `valor_total_diarias` DECIMAL(10, 2) NOT NULL,
  `status_reserva` ENUM('PENDENTE', 'CONFIRMADA', 'CHECKIN', 'FINALIZADA', 'CANCELADA') NOT NULL,
  `origem` ENUM('ONLINE', 'BALCAO') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`fk_cliente_id`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`fk_atendente_id`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Reservas_Vagas`
--
CREATE TABLE IF NOT EXISTS `Reservas_Vagas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_reserva_id` INT NOT NULL,
  `fk_vaga_id` INT NOT NULL,
  UNIQUE KEY `idx_reserva_vaga_unica` (`fk_reserva_id`, `fk_vaga_id`),
  FOREIGN KEY (`fk_reserva_id`) REFERENCES `Reservas`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`fk_vaga_id`) REFERENCES `Vagas`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Pagamentos`
--
CREATE TABLE IF NOT EXISTS `Pagamentos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_reserva_id` INT NOT NULL,
  `valor` DECIMAL(10, 2) NOT NULL,
  `tipo` ENUM('DIARIA', 'EXTRA') NOT NULL,
  `metodo` ENUM('CARTAO_ONLINE', 'CARTAO_MAQUININHA', 'DINHEIRO') NOT NULL,
  `codigo_autorizacao` VARCHAR(100) NULL,
  `status_pagamento` ENUM('APROVADO', 'REPROVADO', 'ESTORNADO', 'PENDENTE') NOT NULL DEFAULT 'PENDENTE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`fk_reserva_id`) REFERENCES `Reservas`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Consumo_Extras`
--
CREATE TABLE IF NOT EXISTS `Consumo_Extras` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_reserva_id` INT NOT NULL,
  `fk_atendente_id` INT NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `valor` DECIMAL(10, 2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`fk_reserva_id`) REFERENCES `Reservas`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`fk_atendente_id`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Avaliacoes`
--
CREATE TABLE IF NOT EXISTS `Avaliacoes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_reserva_id` INT NOT NULL,
  `fk_cliente_id` INT NOT NULL,
  `nota` INT NOT NULL,
  `comentario` TEXT NULL,
  `status_moderacao` ENUM('PENDENTE', 'APROVADO', 'REPROVADO') NOT NULL DEFAULT 'PENDENTE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_reserva_unica` (`fk_reserva_id`),
  FOREIGN KEY (`fk_reserva_id`) REFERENCES `Reservas`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`fk_cliente_id`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Termos_Regras`
--
CREATE TABLE IF NOT EXISTS `Termos_Regras` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(255) NOT NULL,
  `conteudo_pt` TEXT NOT NULL,
  `conteudo_en` TEXT NOT NULL,
  `versao` INT NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Termos_Aceites`
--
CREATE TABLE IF NOT EXISTS `Termos_Aceites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_usuario_id` INT NOT NULL,
  `fk_termo_id` INT NOT NULL,
  `ip_aceite` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`fk_usuario_id`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`fk_termo_id`) REFERENCES `Termos_Regras`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- DADOS INICIAIS (SETUP)
--

-- 1. Insere os usuários de sistema (Admin e Atendente)
INSERT INTO `Usuarios` 
(`nome_completo`, `email`, `senha`, `documento_tipo`, `documento_numero`, `data_nascimento`, `telefone_celular`, `tipo_usuario`) 
VALUES 
('Admin Master', 'admin@albergue.com', 'admin_master', 'CPF', '00000000000', '2000-01-01', '21999999999', 'ADMIN_MASTER'),
('Atendente Padrão', 'atendente@albergue.com', 'atendente', 'CPF', '11111111111', '2000-01-02', '21888888888', 'ATENDENTE');

-- 2. Insere a Versão 1 dos Termos de Uso
INSERT INTO `Termos_Regras` 
(`titulo`, `conteudo_pt`, `conteudo_en`, `versao`)
VALUES
(
  'Regras de Convivência - v1', 
  '1. Respeite o silêncio após as 22h. 2. Não é permitido fumar nas áreas internas. 3. Mantenha a cozinha limpa.', 
  '1. Respect the silence after 10 PM. 2. Smoking is not allowed indoors. 3. Keep the kitchen clean.', 
  1
);

-- 3. Insere 5 usuários com avaliações aprovadas que serão exibidas no index.html
-- (O comentário '---' foi corrigido para '--')
USE `albergue_db`;

-- INSERÇÃO 1
INSERT INTO `Usuarios` (nome_completo, email, senha, documento_tipo, documento_numero, data_nascimento, telefone_celular, tipo_usuario)
VALUES ('Ana Clara', 'ana.clara@email.com', '123', 'CPF', '10010010001', '1990-01-01', '21910000001', 'CLIENTE');
SET @cliente_id = LAST_INSERT_ID();

INSERT INTO `Reservas` (fk_cliente_id, data_checkin, data_checkout, valor_total_diarias, status_reserva, origem)
VALUES (@cliente_id, '2025-01-05 12:00:00', '2025-01-10 12:00:00', 750.00, 'FINALIZADA', 'ONLINE');
SET @reserva_id = LAST_INSERT_ID();

INSERT INTO `Avaliacoes` (fk_reserva_id, fk_cliente_id, nota, comentario, status_moderacao)
VALUES (@reserva_id, @cliente_id, 5, 'Incrível! O lounge é muito confortável e o Wi-Fi é rápido.', 'APROVADO');

-- INSERÇÃO 2
INSERT INTO `Usuarios` (nome_completo, email, senha, documento_tipo, documento_numero, data_nascimento, telefone_celular, tipo_usuario)
VALUES ('Lucas Mendes', 'lucas.mendes@email.com', '123', 'CPF', '10010010002', '1992-02-02', '21910000002', 'CLIENTE');
SET @cliente_id = LAST_INSERT_ID();

INSERT INTO `Reservas` (fk_cliente_id, data_checkin, data_checkout, valor_total_diarias, status_reserva, origem)
VALUES (@cliente_id, '2025-02-10 12:00:00', '2025-02-12 12:00:00', 300.00, 'FINALIZADA', 'ONLINE');
SET @reserva_id = LAST_INSERT_ID();

INSERT INTO `Avaliacoes` (fk_reserva_id, fk_cliente_id, nota, comentario, status_moderacao)
VALUES (@reserva_id, @cliente_id, 4, 'Muito bom! Perto de tudo em Santa Teresa. O quarto de 8 camas é barulhento, mas o preço compensa.', 'APROVADO');

-- INSERÇÃO 3
INSERT INTO `Usuarios` (nome_completo, email, senha, documento_tipo, documento_numero, data_nascimento, telefone_celular, tipo_usuario)
VALUES ('Beatriz Lima', 'beatriz.lima@email.com', '123', 'CPF', '10010010003', '1994-03-03', '21910000003', 'CLIENTE');
SET @cliente_id = LAST_INSERT_ID();

INSERT INTO `Reservas` (fk_cliente_id, data_checkin, data_checkout, valor_total_diarias, status_reserva, origem)
VALUES (@cliente_id, '2025-03-15 12:00:00', '2025-03-20 12:00:00', 800.00, 'FINALIZADA', 'ONLINE');
SET @reserva_id = LAST_INSERT_ID();

INSERT INTO `Avaliacoes` (fk_reserva_id, fk_cliente_id, nota, comentario, status_moderacao)
VALUES (@reserva_id, @cliente_id, 5, 'Perfeito. O quarto privativo de 4 camas é muito confortável e o banheiro é ótimo.', 'APROVADO');

-- INSERÇÃO 4
INSERT INTO `Usuarios` (nome_completo, email, senha, documento_tipo, documento_numero, data_nascimento, telefone_celular, tipo_usuario)
VALUES ('Rafael Costa', 'rafael.costa@email.com', '123', 'CPF', '10010010004', '1996-04-04', '21910000004', 'CLIENTE');
SET @cliente_id = LAST_INSERT_ID();

INSERT INTO `Reservas` (fk_cliente_id, data_checkin, data_checkout, valor_total_diarias, status_reserva, origem)
VALUES (@cliente_id, '2025-04-01 12:00:00', '2025-04-03 12:00:00', 320.00, 'FINALIZADA', 'ONLINE');
SET @reserva_id = LAST_INSERT_ID();

INSERT INTO `Avaliacoes` (fk_reserva_id, fk_cliente_id, nota, comentario, status_moderacao)
VALUES (@reserva_id, @cliente_id, 4, 'A equipe da recepção foi fantástica e me ajudou com tudo. Recomendo.', 'APROVADO');

-- INSERÇÃO 5
INSERT INTO `Usuarios` (nome_completo, email, senha, documento_tipo, documento_numero, data_nascimento, telefone_celular, tipo_usuario)
VALUES ('Juliana Alves', 'juliana.alves@email.com', '123', 'CPF', '10010010005', '1998-05-05', '21910000005', 'CLIENTE');
SET @cliente_id = LAST_INSERT_ID();

INSERT INTO `Reservas` (fk_cliente_id, data_checkin, data_checkout, valor_total_diarias, status_reserva, origem)
VALUES (@cliente_id, '2025-05-10 12:00:00', '2025-05-17 12:00:00', 1050.00, 'FINALIZADA', 'ONLINE');
SET @reserva_id = LAST_INSERT_ID();

INSERT INTO `Avaliacoes` (fk_reserva_id, fk_cliente_id, nota, comentario, status_moderacao)
VALUES (@reserva_id, @cliente_id, 5, 'Amei a área da churrasqueira e o coworking. Conheci muitas pessoas legais. Voltarei em breve!', 'APROVADO');