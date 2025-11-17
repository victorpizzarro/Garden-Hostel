<?php

require_once '../config.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

$sql = "SELECT r.id, r.fk_cliente_id, r.data_checkin, r.data_checkout, r.valor_total_diarias, r.status_reserva, r.origem,
        COALESCE(u.nome_completo, '(Cliente Inválido/Excluído)') AS cliente_nome,
        COUNT(rv.fk_vaga_id) AS vagas_count
        FROM Reservas AS r
        LEFT JOIN Usuarios AS u ON r.fk_cliente_id = u.id
        LEFT JOIN Reservas_Vagas AS rv ON r.id = rv.fk_reserva_id
        WHERE r.status_reserva IN ('CONFIRMADA', 'CHECKIN')
        GROUP BY r.id ORDER BY r.data_checkin ASC";
$resultado = $conexao->query($sql);
$reservas = [];
if ($resultado === false) {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao consultar o banco de dados: ' . $conexao->error]);
    exit();
}
while ($linha = $resultado->fetch_assoc()) { $reservas[] = $linha; }
echo json_encode($reservas);
$conexao->close();
?>