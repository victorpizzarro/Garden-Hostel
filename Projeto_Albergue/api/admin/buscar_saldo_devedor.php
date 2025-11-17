<?php

require_once '../config.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

$reserva_id = isset($_GET['reserva_id']) ? intval($_GET['reserva_id']) : 0;
if ($reserva_id == 0) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da reserva inválido.']);
    exit();
}
try {
    $total_consumido = 0; $total_pago_extra = 0;
    $sql_consumo = "SELECT SUM(valor) AS total FROM Consumo_Extras WHERE fk_reserva_id = ?";
    $stmt_consumo = $conexao->prepare($sql_consumo); $stmt_consumo->bind_param("i", $reserva_id); $stmt_consumo->execute();
    $total_consumido = $stmt_consumo->get_result()->fetch_assoc()['total'] ?: 0;
    $stmt_consumo->close();
    $sql_pago = "SELECT SUM(valor) AS total FROM Pagamentos WHERE fk_reserva_id = ? AND tipo = 'EXTRA' AND status_pagamento = 'APROVADO'";
    $stmt_pago = $conexao->prepare($sql_pago); $stmt_pago->bind_param("i", $reserva_id); $stmt_pago->execute();
    $total_pago_extra = $stmt_pago->get_result()->fetch_assoc()['total'] ?: 0;
    $stmt_pago->close();
    $saldo_devedor = $total_consumido - $total_pago_extra;
    echo json_encode(['status' => 'sucesso', 'saldo_devedor' => (float)$saldo_devedor, 'total_consumido' => (float)$total_consumido, 'total_pago_extra' => (float)$total_pago_extra]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}
$conexao->close();
?>