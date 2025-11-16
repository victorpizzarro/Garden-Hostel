<?php
/*
    Endpoint pro Atendente/Admin fazer o check-in de uma reserva
    Método: POST
    Recebe: JSON { "reserva_id": X }
    Retorna: JSON { "status": "sucesso" } ou { "status": "erro", ... }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verificar se o usuário está logado (como Atendente ou Admin)
if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Você precisa ser um Atendente ou Admin.'
    ]);
    exit();
}

// 3. Pega os dados do JSON ($dadosRecebidos)
$reserva_id = $dadosRecebidos['reserva_id'];

// 4. Valida os dados
if (empty($reserva_id)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'ID da reserva não informado.'
    ]);
    exit();
}

// 5. Lógica de Negócio (Check-in)
// Pra fazer check-in, a reserva DEVE estar com status 'CONFIRMADA'

$sql_checkin = "UPDATE Reservas
                SET status_reserva = 'CHECKIN'
                WHERE id = $reserva_id AND status_reserva = 'CONFIRMADA'";

if ($conexao->query($sql_checkin)) {
    // Verifica se alguma linha foi alterada
    if ($conexao->affected_rows > 0) {
        http_response_code(200);
        echo json_encode([
            'status' => 'sucesso',
            'mensagem' => 'Check-in realizado com sucesso.'
        ]);
    } else {
        // Se 0 linhas foram afetadas, ou a reserva não existe
        // ou ela não estava com o status 'CONFIRMADA'
        http_response_code(400);
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Check-in falhou. A reserva não foi encontrada ou não está com o status "CONFIRMADA".'
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Erro ao processar o check-in: ' . $conexao->error
    ]);
}
?>