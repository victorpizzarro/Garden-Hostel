<?php
/*
    Endpoint para listar todas as reservas de um cliente logado
    Método: GET
    Recebe: Nada (usa a sessão)
    Retorna: JSON [ { ...reserva1... }, { ...reserva2... } ]
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'CLIENTE') {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Você precisa estar logado como cliente.'
    ]);
    exit();
}

// 3. Pega o ID do cliente da sessão
$cliente_id = $_SESSION['usuario_id'];

// 4. Lógica de Busca
// Esse SQL busca todas as reservas do cliente
// e ordena da mais nova (check-in mais distante) para a mais antiga
$sql = "SELECT 
            r.id AS reserva_id,
            r.data_checkin,
            r.data_checkout,
            r.valor_total_diarias,
            r.status_reserva,
            r.origem,
            r.created_at,
            
            -- (NOVO) Pega o ID da avaliação, se existir
            a.id AS avaliacao_id 
        FROM 
            Reservas AS r
        LEFT JOIN 
            Avaliacoes AS a ON r.id = a.fk_reserva_id
        WHERE 
            r.fk_cliente_id = $cliente_id
        ORDER BY 
            r.id DESC";

$resultado = $conexao->query($sql);
$reservas = [];

if ($resultado->num_rows > 0) {
    while ($linha = $resultado->fetch_assoc()) {
        $reservas[] = $linha;
    }
}

// 5. Retorna a lista de reservas (pode ser vazia)
http_response_code(200);
echo json_encode($reservas);
?>