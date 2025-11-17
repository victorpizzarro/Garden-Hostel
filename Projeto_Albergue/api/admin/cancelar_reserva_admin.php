<?php
require_once '../config.php';


if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}


$json = file_get_contents('php://input');
$dadosRecebidos = json_decode($json, true);
$reserva_id = $dadosRecebidos['reserva_id'] ?? '';


if (empty($reserva_id)) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da reserva não informado.']);
    exit();
}

$conexao->begin_transaction();

try {
    // Busca reserva
    $sql_busca = "SELECT status_reserva FROM Reservas WHERE id = ?";
    $stmt_busca = $conexao->prepare($sql_busca);
    $stmt_busca->bind_param("i", $reserva_id);
    $stmt_busca->execute();
    $result_busca = $stmt_busca->get_result();

    if ($result_busca->num_rows == 0) {
        throw new Exception('Reserva não encontrada.');
    }

    $reserva = $result_busca->fetch_assoc();
    $status_atual = $reserva['status_reserva'];

    // Verifica se pode cancelar
    if ($status_atual == 'CANCELADA' || $status_atual == 'FINALIZADA') {
        throw new Exception('Esta reserva não pode mais ser cancelada.');
    }

    // Atualiza reserva
    $sql_update = "UPDATE Reservas SET status_reserva = 'CANCELADA' WHERE id = ?";
    $stmt_update = $conexao->prepare($sql_update);
    $stmt_update->bind_param("i", $reserva_id);
    
    if (!$stmt_update->execute()) {
        throw new Exception('Erro ao cancelar a reserva.');
    }

    // Estorno se necessário
    if ($status_atual == 'CONFIRMADA') {
        $sql_estorno = "UPDATE Pagamentos SET status_pagamento = 'ESTORNADO' WHERE fk_reserva_id = ? AND tipo = 'DIARIA'";
        $stmt_estorno = $conexao->prepare($sql_estorno);
        $stmt_estorno->bind_param("i", $reserva_id);
        
        if (!$stmt_estorno->execute()) {
            throw new Exception('Erro ao processar o estorno do pagamento.');
        }
        $stmt_estorno->close();
    }

    $conexao->commit();
    echo json_encode(['status' => 'sucesso', 'mensagem' => 'Reserva cancelada com sucesso.']);

} catch (Exception $e) {
    $conexao->rollback();
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}
?>