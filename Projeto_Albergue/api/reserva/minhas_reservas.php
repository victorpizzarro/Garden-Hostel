<?php
/*
  Endpoint para listar todas as reservas de um cliente logado
  Versão 2.0 - Segura (com Prepared Statements)
*/


require_once '../config.php';


if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'CLIENTE') {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}


$cliente_id = $_SESSION['usuario_id'];
$reservas = [];

try {
    
    $sql = "SELECT 
                r.id AS reserva_id,
                r.data_checkin,
                r.data_checkout,
                r.valor_total_diarias,
                r.status_reserva,
                r.origem,
                r.created_at,
                a.id AS avaliacao_id 
            FROM 
                Reservas AS r
            LEFT JOIN 
                Avaliacoes AS a ON r.id = a.fk_reserva_id
            WHERE 
                r.fk_cliente_id = ?
            ORDER BY 
                r.id DESC";
    
    $stmt = $conexao->prepare($sql);
    if ($stmt === false) {
        throw new Exception('Erro ao preparar a consulta: ' . $conexao->error);
    }
    
    // "i" = integer
    $stmt->bind_param("i", $cliente_id);

    if ($stmt->execute() === false) {
        throw new Exception('Erro ao executar a consulta: ' . $stmt->error);
    }

    $resultado = $stmt->get_result();
    while ($linha = $resultado->fetch_assoc()) {
        $reservas[] = $linha;
    }

    $stmt->close();
    $conexao->close();

    
    http_response_code(200);
    echo json_encode($reservas);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
    if (isset($stmt) && $stmt) $stmt->close();
    if (isset($conexao) && $conexao) $conexao->close();
}
?>