<?php
/*
    Endpoint pro Atendente/Admin atualizar dados de um cliente
    Método: POST
    Recebe: JSON { "cliente_id": X, "dados": { "nome_completo": "...", "email": "..." } }
    Retorna: JSON { "status": "sucesso" } ou { "status": "erro", ... }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verifica se o usuário está logado (como Atendente ou Admin)
if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Você precisa ser um Atendente ou Admin.'
    ]);
    exit();
}

// 3. Pega os dados do JSON ($dadosRecebidos)
$cliente_id = $dadosRecebidos['cliente_id'];
$dados = $dadosRecebidos['dados']; // Array com os campos para mudar

// 4. Valida os dados
if (empty($cliente_id) || empty($dados)) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID do cliente e dados são obrigatórios.']);
    exit();
}

// 5. Inicia a Transação (Obrigatório)
$conexao->begin_transaction();

try {
    $sql_update_usuario = "UPDATE Usuarios SET ";
    $campos_usuario = [];

    // Campos que o Admin pode mudar na tabela 'Usuarios'
    if (isset($dados['nome_completo'])) $campos_usuario[] = "nome_completo = '{$dados['nome_completo']}'";
    if (isset($dados['email'])) $campos_usuario[] = "email = '{$dados['email']}'";
    if (isset($dados['documento_numero'])) $campos_usuario[] = "documento_numero = '{$dados['documento_numero']}'";
    if (isset($dados['data_nascimento'])) $campos_usuario[] = "data_nascimento = '{$dados['data_nascimento']}'";
    if (isset($dados['telefone_celular'])) $campos_usuario[] = "telefone_celular = '{$dados['telefone_celular']}'";
    
    // Verifica se alguma linha foi alterada
    if (count($campos_usuario) > 0) {
        $sql_update_usuario .= implode(', ', $campos_usuario);
        $sql_update_usuario .= " WHERE id = $cliente_id AND tipo_usuario = 'CLIENTE'";
        
        if (!$conexao->query($sql_update_usuario)) {
            throw new Exception('Erro ao atualizar dados do usuário: ' . $conexao->error);
        }
    }

    // --- 6. Lógica de Atualização da Tabela 'Enderecos' ---
    if (isset($dados['endereco'])) {
        $end = $dados['endereco']; // Array de endereço

        $sql_update_endereco = "UPDATE Enderecos SET
                                    cep = '{$end['cep']}',
                                    logradouro = '{$end['logradouro']}',
                                    numero = '{$end['numero']}',
                                    complemento = '{$end['complemento']}',
                                    bairro = '{$end['bairro']}',
                                    cidade = '{$end['cidade']}',
                                    estado = '{$end['estado']}'
                                WHERE fk_usuario_id = $cliente_id";
        
        if (!$conexao->query($sql_update_endereco)) {
            throw new Exception('Erro ao atualizar endereço: ' . $conexao->error);
        }
    }

     // --- Sucesso: Efetiva a Transação ---
    $conexao->commit();
    
    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Dados do cliente atualizados.'
    ]);

} catch (Exception $e) {
    // --- Falha: Reverte a Transação ---
    $conexao->rollback();
    
    http_response_code(500);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => $e->getMessage()
    ]);
}
?>