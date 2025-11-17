<?php
require_once '../config.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

$reserva_id = $_GET['reserva_id'] ?? '';
if (empty($reserva_id)) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da reserva não fornecido.']);
    exit();
}

$sql = "SELECT r.id AS reserva_num, r.data_checkin, r.data_checkout,
               u.nome_completo, u.documento_tipo, u.documento_numero, u.data_nascimento,
               u.telefone_celular, u.email, e.logradouro, e.numero, e.bairro, e.cidade, e.estado, e.cep
        FROM Reservas AS r
        JOIN Usuarios AS u ON r.fk_cliente_id = u.id
        LEFT JOIN Enderecos AS e ON u.id = e.fk_usuario_id
        WHERE r.id = ?";

$stmt = $conexao->prepare($sql);
$stmt->bind_param("i", $reserva_id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows == 0) {
    http_response_code(404);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Reserva não encontrada.']);
    exit();
}

$dados = $resultado->fetch_assoc();
echo json_encode($dados);

$stmt->close();
?>