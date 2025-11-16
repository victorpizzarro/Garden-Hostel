<?php
/*
    Endpoint pra "pagar" uma reserva e confirmá-la.
    Método: POST
    Recebe: JSON { "reserva_id": X, "dados_cartao": { ... } }
    Retorna: JSON { "status": "sucesso" } ou { "status": "erro", ... }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Você precisa estar logado.'
    ]);
    exit();
}

// 3. Pega os dados do JSON ($dadosRecebidos)
$reserva_id = $dadosRecebidos['reserva_id'];

// 4. Valida os dados
if (empty($reserva_id)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'ID da reserva não informado.'
    ]);
    exit();
}

// 5. Inicia a Transação (Obrigatório, pois são 2 tabelas)
// (Vai atualizar 2 tabelas: Pagamentos e Reservas)
$conexao->begin_transaction();

try {
    // --- Passo 1: Busca o valor da reserva ---
    // (Precisa saber o valor pra pagar)
    $sql_valor = "SELECT valor_total_diarias, status_reserva FROM Reservas WHERE id = $reserva_id";
    $result_valor = $conexao->query($sql_valor);

    if ($result_valor->num_rows == 0) {
        throw new Exception('Reserva não encontrada.');
    }

    $reserva = $result_valor->fetch_assoc();
    $valor_a_pagar = $reserva['valor_total_diarias'];
    $status_atual = $reserva['status_reserva'];

    // Verificação: Só é possível pagar uma reserva PENDENTE
    if ($status_atual != 'PENDENTE') {
        throw new Exception('Esta reserva não está pendente de pagamento.');
    }

    // --- Passo 2: Inserir o registro de Pagamento ---
    // Aqui é simulado um pagamento de 'DIARIA' feito com 'CARTAO_ONLINE'
    $sql_pagamento = "INSERT INTO Pagamentos 
                        (fk_reserva_id, valor, tipo, metodo, status_pagamento)
                      VALUES 
                        ($reserva_id, $valor_a_pagar, 'DIARIA', 'CARTAO_ONLINE', 'APROVADO')";

    if (!$conexao->query($sql_pagamento)) {
        throw new Exception('Erro ao registrar o pagamento: ' . $conexao->error);
    }

    // --- Passo 3: Atualiza o status da Reserva ---
    // Agora que o pagamento foi APROVADO, a reserva fica CONFIRMADA
    $sql_update_reserva = "UPDATE Reservas 
                           SET status_reserva = 'CONFIRMADA' 
                           WHERE id = $reserva_id AND status_reserva = 'PENDENTE'";

    if (!$conexao->query($sql_update_reserva)) {
        throw new Exception('Erro ao confirmar a reserva: ' . $conexao->error);
    }

    // --- Sucesso: Efetiva a Transação ---
    $conexao->commit();

    // Retorna uma resposta de sucesso para o JavaScript
    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Pagamento aprovado e reserva confirmada.'
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