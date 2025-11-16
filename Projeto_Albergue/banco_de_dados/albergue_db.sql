-- Cria o banco de dados 'albergue_db'
CREATE DATABASE IF NOT EXISTS `albergue_db`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Define o banco de dados 'albergue_db' como o padrão para as próximas queries
USE `albergue_db`;

--
-- Estrutura da tabela `Usuarios`
-- (Armazena clientes, atendentes e administradores)
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
-- (Armazena endereços opcionais dos usuários)
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
-- Estrutura da tabela `Quartos`
-- (Define os quartos, capacidade e preços)
--
CREATE TABLE IF NOT EXISTS `Quartos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `descricao_pt` TEXT NULL,
  `descricao_en` TEXT NULL,
  `capacidade` INT NOT NULL,
  `tem_banheiro` BOOLEAN NOT NULL DEFAULT FALSE,
  `preco_diaria` DECIMAL(10, 2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Vagas`
-- (Define as vagas individuais dentro de cada quarto)
--
CREATE TABLE IF NOT EXISTS `Vagas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_quarto_id` INT NOT NULL,
  `nome_identificador` VARCHAR(50) NOT NULL,
  `descricao_peculiaridades_pt` TEXT NULL,
  `descricao_peculiaridades_en` TEXT NULL,
  -- Garante que o nome da vaga (ex: "Cama 1A") é único por quarto
  UNIQUE KEY `idx_quarto_identificador` (`fk_quarto_id`, `nome_identificador`),
  FOREIGN KEY (`fk_quarto_id`) REFERENCES `Quartos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Reservas`
-- (Tabela principal, registra o período da estadia e status)
--
CREATE TABLE IF NOT EXISTS `Reservas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_cliente_id` INT NOT NULL,
  `fk_atendente_id` INT NULL, -- Nulo se a reserva for feita online
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
-- (Tabela associativa N-para-N que liga quais vagas foram reservadas)
--
CREATE TABLE IF NOT EXISTS `Reservas_Vagas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_reserva_id` INT NOT NULL,
  `fk_vaga_id` INT NOT NULL,
  -- Garante que uma vaga não pode ser adicionada duas vezes na mesma reserva
  UNIQUE KEY `idx_reserva_vaga_unica` (`fk_reserva_id`, `fk_vaga_id`),
  FOREIGN KEY (`fk_reserva_id`) REFERENCES `Reservas`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`fk_vaga_id`) REFERENCES `Vagas`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Pagamentos`
-- (Registra todas as transações financeiras da reserva)
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
-- (Registra itens de consumo extra, como toalhas ou restaurante)
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
-- (Armazena as avaliações dos clientes e o status de moderação)
--
CREATE TABLE IF NOT EXISTS `Avaliacoes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_reserva_id` INT NOT NULL,
  `fk_cliente_id` INT NOT NULL,
  `nota` INT NOT NULL,
  `comentario` TEXT NULL,
  `status_moderacao` ENUM('PENDENTE', 'APROVADO', 'REPROVADO') NOT NULL DEFAULT 'PENDENTE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Garante que cada reserva só pode ser avaliada uma vez
  UNIQUE KEY `idx_reserva_unica` (`fk_reserva_id`),
  FOREIGN KEY (`fk_reserva_id`) REFERENCES `Reservas`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`fk_cliente_id`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `Termos_Regras`
-- (Armazena as versões das regras de convivência)
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
-- (Registra o aceite dos termos por parte do usuário)
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