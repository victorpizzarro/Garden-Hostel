<?php
/**
 * Arquivo: api/admin/reserva_crud.php
 * Descrição: Endpoint para operações CRUD de reservas
 */

require_once '../config.php';

// Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

// Pega a ação
$acao = isset($_GET['acao']) ? $_GET['acao'] : '';

try {
    switch($acao) {
        case 'listar':
            listarReservas();
            break;
        default:
            throw new Exception('Ação não especificada. Use "listar".');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}

function listarReservas() {
    global $conexao;
    
    $status = isset($_GET['status']) ? $_GET['status'] : '';
    $cliente = isset($_GET['cliente']) ? $_GET['cliente'] : '';
    $checkin_min = isset($_GET['checkin_min']) ? $_GET['checkin_min'] : '';
    $checkout_max = isset($_GET['checkout_max']) ? $_GET['checkout_max'] : '';
    
    $sql = "SELECT r.id, r.data_checkin, r.data_checkout, r.valor_total_diarias as valor_total,
                   r.status_reserva as status, r.created_at as data_criacao,
                   u.nome_completo as nome_cliente, u.email as email_cliente,
                   u.documento_numero as documento_cliente,
                   q.nome as nome_quarto, v.nome_identificador as nome_vaga
            FROM Reservas r
            LEFT JOIN Usuarios u ON r.fk_cliente_id = u.id
            LEFT JOIN Reservas_Vagas rv ON r.id = rv.fk_reserva_id
            LEFT JOIN Vagas v ON rv.fk_vaga_id = v.id
            LEFT JOIN Quartos q ON v.fk_quarto_id = q.id
            WHERE 1=1";
    
    $params = [];
    $types = "";
    $conditions = [];
    
    // Filtros
    if (!empty($status)) {
        $conditions[] = "r.status_reserva = ?";
        $params[] = $status;
        $types .= "s";
    }
    
    if (!empty($cliente)) {
        $conditions[] = "(u.nome_completo LIKE ? OR u.email LIKE ? OR u.documento_numero LIKE ?)";
        $like_cliente = "%" . $cliente . "%";
        $params[] = $like_cliente;
        $params[] = $like_cliente;
        $params[] = $like_cliente;
        $types .= "sss";
    }
    
    if (!empty($checkin_min)) {
        $conditions[] = "DATE(r.data_checkin) >= ?";
        $params[] = $checkin_min;
        $types .= "s";
    }
    
    if (!empty($checkout_max)) {
        $conditions[] = "DATE(r.data_checkout) <= ?";
        $params[] = $checkout_max;
        $types .= "s";
    }
    
    if (count($conditions) > 0) {
        $sql .= " AND " . implode(" AND ", $conditions);
    }
    
    $sql .= " GROUP BY r.id ORDER BY r.created_at DESC";
    
    
    $stmt = $conexao->prepare($sql);
    
    if (count($params) > 0) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $reservas = [];
    
    while ($linha = $result->fetch_assoc()) {
        $reservas[] = $linha;
    }
    
    $stmt->close();
    
    echo json_encode($reservas);
}
?>