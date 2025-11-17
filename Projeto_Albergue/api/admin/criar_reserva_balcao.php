<?php
require_once '../config.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

$atendente_id = $_SESSION['usuario_id'];


$json = file_get_contents('php://input');
$dadosRecebidos = json_decode($json, true);

$cliente_id = $dadosRecebidos['fk_cliente_id'] ?? '';
$vagas_ids = $dadosRecebidos['vagas_ids'] ?? [];
$checkin_str = $dadosRecebidos['checkin'] ?? '';
$checkout_str = $dadosRecebidos['checkout'] ?? '';
$valor_total = $dadosRecebidos['valor_total'] ?? 0;

if (empty($cliente_id) || empty($vagas_ids) || empty($checkin_str) || empty($checkout_str)) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Dados da reserva incompletos.']);
    exit();
}

$data_checkin = $checkin_str . ' 12:00:00';
$data_checkout = $checkout_str . ' 12:00:00';

$conexao->begin_transaction();

try {
   
    $sql_reserva = "INSERT INTO Reservas (fk_cliente_id, fk_atendente_id, data_checkin, data_checkout, valor_total_diarias, status_reserva, origem) VALUES (?, ?, ?, ?, ?, 'PENDENTE', 'BALCAO')";
    $stmt_reserva = $conexao->prepare($sql_reserva);
    $stmt_reserva->bind_param("iissd", $cliente_id, $atendente_id, $data_checkin, $data_checkout, $valor_total);
    
    if (!$stmt_reserva->execute()) {
        throw new Exception('Erro ao criar a reserva: ' . $stmt_reserva->error);
    }

    $nova_reserva_id = $conexao->insert_id;
    $stmt_reserva->close();

    // Insere vagas
    $sql_vagas = "INSERT INTO Reservas_Vagas (fk_reserva_id, fk_vaga_id) VALUES (?, ?)";
    $stmt_vagas = $conexao->prepare($sql_vagas);
   
    foreach ($vagas_ids as $vaga_id) {
        $stmt_vagas->bind_param("ii", $nova_reserva_id, $vaga_id);
        if (!$stmt_vagas->execute()) {
            throw new Exception('Erro ao associar vaga à reserva: ' . $stmt_vagas->error);
        }
    }
    $stmt_vagas->close();

    $conexao->commit();
    echo json_encode(['status' => 'sucesso', 'mensagem' => 'Reserva de balcão criada com status PENDENTE.', 'reserva_id' => $nova_reserva_id]);

} catch (Exception $e) {
    $conexao->rollback();
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}
?>