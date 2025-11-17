<?php
/*
    Endpoint pra "pagar" uma reserva e confirmá-la automaticamente
    Método: POST
    Recebe: JSON { "reserva_id": X }
    Retorna: JSON { "status": "sucesso" } ou { "status": "erro", ... }
*/


require_once '../config.php';


if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Você precisa estar logado.'
    ]);
    exit();
}


$json = file_get_contents('php://input');
$dadosRecebidos = json_decode($json, true);
$reserva_id = $dadosRecebidos['reserva_id'] ?? '';


if (empty($reserva_id)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'ID da reserva não informado.'
    ]);
    exit();
}


$conexao->begin_transaction();

try {
    
    $sql_valor = "SELECT valor_total_diarias, status_reserva FROM Reservas WHERE id = ?";
    $stmt_valor = $conexao->prepare($sql_valor);
    $stmt_valor->bind_param("i", $reserva_id);
    $stmt_valor->execute();
    $result_valor = $stmt_valor->get_result();

    if ($result_valor->num_rows == 0) {
        throw new Exception('Reserva não encontrada.');
    }

    $reserva = $result_valor->fetch_assoc();
    $valor_a_pagar = $reserva['valor_total_diarias'];
    $status_atual = $reserva['status_reserva'];
    $stmt_valor->close();

   
    if ($status_atual != 'PENDENTE') {
        throw new Exception('Esta reserva não está pendente de pagamento.');
    }

   
    $sql_pagamento = "INSERT INTO Pagamentos 
                        (fk_reserva_id, valor, tipo, metodo, status_pagamento)
                      VALUES 
                        (?, ?, 'DIARIA', 'CARTAO_ONLINE', 'APROVADO')";

    $stmt_pagamento = $conexao->prepare($sql_pagamento);
    $stmt_pagamento->bind_param("id", $reserva_id, $valor_a_pagar);

    if (!$stmt_pagamento->execute()) {
        throw new Exception('Erro ao registrar o pagamento: ' . $stmt_pagamento->error);
    }
    $stmt_pagamento->close();

    
    $sql_update_reserva = "UPDATE Reservas 
                           SET status_reserva = 'CONFIRMADA' 
                           WHERE id = ?";

    $stmt_update = $conexao->prepare($sql_update_reserva);
    $stmt_update->bind_param("i", $reserva_id);

    if (!$stmt_update->execute()) {
        throw new Exception('Erro ao confirmar a reserva: ' . $stmt_update->error);
    }
    $stmt_update->close();

   
    $conexao->commit();

    
    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Pagamento aprovado e reserva confirmada com sucesso!'
    ]);

} catch (Exception $e) {
    
    $conexao->rollback();

    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'erro',
        'mensagem' => $e->getMessage()
    ]);
}
?>