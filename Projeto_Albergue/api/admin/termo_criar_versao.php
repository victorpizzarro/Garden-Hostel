<?php
/*
    Endpoint pro Admin Master criar uma nova versão dos Termos
    Método: POST
    Recebe: JSON { "titulo": "...", "conteudo_pt": "...", "conteudo_en": "..." }
    Retorna: JSON { "status": "sucesso", "nova_versao": X } ou { "status": "erro", ... }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verifica se o usuário é ADMIN_MASTER
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'ADMIN_MASTER') {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Apenas o Admin Master pode criar novos termos.'
    ]);
    exit();
}

// 3. Pega os dados do JSON ($dadosRecebidos)
$titulo = $dadosRecebidos['titulo'];
$conteudo_pt = $dadosRecebidos['conteudo_pt'];
$conteudo_en = $dadosRecebidos['conteudo_en'];

// 4. Valida os dados
if (empty($titulo) || empty($conteudo_pt) || empty($conteudo_en)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Todos os campos (título, pt, en) são obrigatórios.'
    ]);
    exit();
}

// 5. Inicia a Transação (pra pegar a versão mais recente e inserir)
$conexao->begin_transaction();

try {
    // --- Passo 1: Descobre qual será a nova versão ---
    // (Pega a versão mais alta que existe e soma 1)
    $sql_versao = "SELECT MAX(versao) AS ultima_versao FROM Termos_Regras";
    $result_versao = $conexao->query($sql_versao);
    
    $nova_versao = 1; // Padrão, se a tabela estiver vazia
    if ($result_versao->num_rows > 0) {
        $linha = $result_versao->fetch_assoc();
        if ($linha['ultima_versao'] !== null) {
            $nova_versao = (int)$linha['ultima_versao'] + 1;
        }
    }

    // --- Passo 2: Insere a nova versão ---
    $sql_insert = "INSERT INTO Termos_Regras (titulo, conteudo_pt, conteudo_en, versao)
                   VALUES ('$titulo', '$conteudo_pt', '$conteudo_en', $nova_versao)";

    if (!$conexao->query($sql_insert)) {
        // Erro caso tente criar com uma versão que já existe
        if ($conexao->errno == 1062) { // Chave duplicada
            throw new Exception('Erro: Conflito de versão detectado.');
        } else {
            throw new Exception('Erro ao inserir novo termo: ' . $conexao->error);
        }
    }

    // --- Sucesso: Efetiva a Transação ---
    $conexao->commit();
    
    http_response_code(201); // Created
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Nova versão dos termos criada com sucesso.',
        'nova_versao' => $nova_versao,
        'id' => $conexao->insert_id
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