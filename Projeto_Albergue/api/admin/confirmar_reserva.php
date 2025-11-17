<?php
require_once '../config.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}


$json = file_get_contents('php://input');
$dadosRecebidos = json_decode($json, true);
$reserva_id = $dadosRecebidos['reserva_id'] ?? 0;

if (empty($reserva_id)) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da reserva não informado.']);
    exit();
}

try {
    $sql_confirmar = "UPDATE Reservas SET status_reserva = 'CONFIRMADA' WHERE id = ? AND status_reserva = 'PENDENTE'";
    $stmt = $conexao->prepare($sql_confirmar);
    $stmt->bind_param("i", $reserva_id);
   
    if ($stmt->execute() === false) {
        throw new Exception('Erro ao executar a atualização: ' . $stmt->error);
    }

    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'sucesso', 'mensagem' => 'Reserva confirmada com sucesso.']);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'erro', 'mensagem' => 'Reserva não encontrada ou não está com o status "PENDENTE".']);
    }

    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}
?>