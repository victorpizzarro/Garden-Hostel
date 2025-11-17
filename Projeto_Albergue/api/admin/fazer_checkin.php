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

$sql_checkin = "UPDATE Reservas SET status_reserva = 'CHECKIN' WHERE id = ? AND status_reserva = 'CONFIRMADA'";
$stmt = $conexao->prepare($sql_checkin);
$stmt->bind_param("i", $reserva_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'sucesso', 'mensagem' => 'Check-in realizado com sucesso.']);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'erro', 'mensagem' => 'Check-in falhou. Reserva não encontrada ou não está "CONFIRMADA".']);
    }
} else {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao processar check-in: ' . $stmt->error]);
}

$stmt->close();
?>