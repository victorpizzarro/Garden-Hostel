<?php

require_once '../config.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

$status = isset($_GET['status']) ? $_GET['status'] : ''; $cliente = isset($_GET['cliente']) ? $_GET['cliente'] : '';
$checkin_min = isset($_GET['checkin_min']) ? $_GET['checkin_min'] : ''; $checkout_max = isset($_GET['checkout_max']) ? $_GET['checkout_max'] : '';
$reservas = []; 
try {
    $sql = "SELECT r.id, r.fk_cliente_id, r.data_checkin, r.data_checkout, r.valor_total_diarias, r.status_reserva, r.origem, r.created_at,
            COALESCE(u.nome_completo, '(Cliente Inválido/Excluído)') AS cliente_nome,
            COALESCE(u.email, 'N/A') AS cliente_email,
            COALESCE(u.documento_numero, 'N/A') AS cliente_documento,
            COUNT(rv.fk_vaga_id) AS vagas_count
            FROM Reservas AS r
            LEFT JOIN Usuarios AS u ON r.fk_cliente_id = u.id
            LEFT JOIN Reservas_Vagas AS rv ON r.id = rv.fk_reserva_id
            WHERE 1=1";
    $params = []; $types = ""; $conditions = [];
    if (!empty($status)) { $conditions[] = "r.status_reserva = ?"; $params[] = $status; $types .= "s"; }
    if (!empty($cliente)) {
        $conditions[] = "(u.nome_completo LIKE ? OR u.email LIKE ? OR u.documento_numero LIKE ?)";
        $like_cliente = "%" . $cliente . "%"; $params[] = $like_cliente; $params[] = $like_cliente; $params[] = $like_cliente; $types .= "sss";
    }
    if (!empty($checkin_min)) { $conditions[] = "DATE(r.data_checkin) >= ?"; $params[] = $checkin_min; $types .= "s"; }
    if (!empty($checkout_max)) { $conditions[] = "DATE(r.data_checkout) <= ?"; $params[] = $checkout_max; $types .= "s"; }
    if (count($conditions) > 0) { $sql .= " AND " . implode(" AND ", $conditions); }
    $sql .= " GROUP BY r.id ORDER BY r.created_at DESC";
    $stmt = $conexao->prepare($sql);
    if ($stmt === false) { throw new Exception('Erro ao preparar a consulta: ' . $conexao->error); }
    if (count($params) > 0) { $stmt->bind_param($types, ...$params); }
    if ($stmt->execute() === false) { throw new Exception('Erro ao executar a consulta: ' . $stmt->error); }
    $resultado = $stmt->get_result();
    if ($resultado === false) { throw new Exception('Erro ao buscar os resultados: ' . $stmt->error); }
    while ($linha = $resultado->fetch_assoc()) { $reservas[] = $linha; }
    $stmt->close(); $conexao->close();
    echo json_encode($reservas);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
    if (isset($stmt) && $stmt) $stmt->close();
    if (isset($conexao) && $conexao) $conexao->close();
}
?>