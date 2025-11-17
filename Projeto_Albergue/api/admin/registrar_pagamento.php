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
$valor = $dadosRecebidos['valor'] ?? '';
$tipo = $dadosRecebidos['tipo'] ?? '';
$metodo = $dadosRecebidos['metodo'] ?? '';

if (empty($reserva_id) || empty($valor) || empty($tipo) || empty($metodo)) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Todos os campos são obrigatórios.']);
    exit();
}

$conexao->begin_transaction();

try {
    // Insere pagamento
    $sql_pagamento = "INSERT INTO Pagamentos (fk_reserva_id, valor, tipo, metodo, status_pagamento) VALUES (?, ?, ?, ?, 'APROVADO')";
    $stmt_pagamento = $conexao->prepare($sql_pagamento);
    $stmt_pagamento->bind_param("idss", $reserva_id, $valor, $tipo, $metodo);

    if (!$stmt_pagamento->execute()) {
        throw new Exception('Erro ao registrar o pagamento: ' . $stmt_pagamento->error);
    }
    $stmt_pagamento->close();

    // Confirma reserva se for diária
    if ($tipo == 'DIARIA') {
        $sql_update = "UPDATE Reservas SET status_reserva = 'CONFIRMADA' WHERE id = ? AND status_reserva = 'PENDENTE'";
        $stmt_update = $conexao->prepare($sql_update);
        $stmt_update->bind_param("i", $reserva_id);
       
        if (!$stmt_update->execute()) {
            throw new Exception('Erro ao confirmar a reserva: ' . $stmt_update->error);
        }
        $stmt_update->close();
    }

    $conexao->commit();
    echo json_encode(['status' => 'sucesso', 'mensagem' => 'Pagamento registrado com sucesso.']);

} catch (Exception $e) {
    $conexao->rollback();
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}
?>