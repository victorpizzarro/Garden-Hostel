<?php
/*
    Endpoint pra cadastrar um novo usuário (CLIENTE).
    Método: POST
    Recebe: JSON { "nome_completo": "...", "email": "...", "senha": "...", ... }
    Retorna: JSON { "status": "sucesso", "id_usuario": "..." } ou { "status": "erro", ... }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Pega os dados do JSON ($dadosRecebidos)
// Dados obrigatórios da tabela 'Usuarios'
$nome = $dadosRecebidos['nome_completo'];
$email = $dadosRecebidos['email'];
$senha = $dadosRecebidos['senha'];
$doc_tipo = $dadosRecebidos['documento_tipo'];
$doc_num = $dadosRecebidos['documento_numero'];
$data_nasc = $dadosRecebidos['data_nascimento'];
$celular = $dadosRecebidos['telefone_celular'];
// O tipo_usuario é sempre 'CLIENTE' no cadastro público
$tipo_usuario = 'CLIENTE';

// Dados opcionais da tabela 'Enderecos'
// Usado 'isset' pra checar se os dados de endereço foram enviados
$cep = isset($dadosRecebidos['cep']) ? $dadosRecebidos['cep'] : null;
$logradouro = isset($dadosRecebidos['logradouro']) ? $dadosRecebidos['logradouro'] : null;
$numero = isset($dadosRecebidos['numero']) ? $dadosRecebidos['numero'] : null;
$complemento = isset($dadosRecebidos['complemento']) ? $dadosRecebidos['complemento'] : null;
$bairro = isset($dadosRecebidos['bairro']) ? $dadosRecebidos['bairro'] : null;
$cidade = isset($dadosRecebidos['cidade']) ? $dadosRecebidos['cidade'] : null;
$estado = isset($dadosRecebidos['estado']) ? $dadosRecebidos['estado'] : null;

// 3. Valida os dados
if (empty($nome) || empty($email) || empty($senha)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Nome, email e senha são obrigatórios.'
    ]);
    exit();
}

// 4. Inicia a Transação (Obrigatório, pois são 2 tabelas)
$conexao->begin_transaction();

try {
    // --- Passo 1: Inserir na tabela 'Usuarios' ---
    $sql_usuario = "INSERT INTO Usuarios 
                        (nome_completo, email, senha, documento_tipo, documento_numero, data_nascimento, telefone_celular, tipo_usuario)
                    VALUES 
                        ('$nome', '$email', '$senha', '$doc_tipo', '$doc_num', '$data_nasc', '$celular', '$tipo_usuario')";

    if (!$conexao->query($sql_usuario)) {
        // Se a query falhar (ex: email duplicado), lança uma exceção
        throw new Exception('Erro ao cadastrar usuário: ' . $conexao->error);
    }

    // Pega o ID do usuário que foi criado
    $novo_usuario_id = $conexao->insert_id;

    // --- Passo 2: Inserir na tabela 'Enderecos' ---
    // (Mesmo que os dados sejam nulos, o registro é criado)
    $sql_endereco = "INSERT INTO Enderecos 
                        (fk_usuario_id, cep, logradouro, numero, complemento, bairro, cidade, estado)
                     VALUES 
                        ($novo_usuario_id, '$cep', '$logradouro', '$numero', '$complemento', '$bairro', '$cidade', '$estado')";
    
    if (!$conexao->query($sql_endereco)) {
        // Se a query falhar, lança uma exceção
        throw new Exception('Erro ao cadastrar endereço: ' . $conexao->error);
    }

    // --- Sucesso: Efetiva a Transação ---
    $conexao->commit();
    
    http_response_code(201); // 201 Created
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Usuário cadastrado com sucesso.',
        'id_usuario' => $novo_usuario_id
    ]);

} catch (Exception $e) {
    // --- Falha: Reverte a Transação ---
    $conexao->rollback();
    
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'erro',
        'mensagem' => $e->getMessage()
    ]);
}
?>