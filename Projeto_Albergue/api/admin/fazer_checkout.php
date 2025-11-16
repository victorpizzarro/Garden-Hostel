<?php
/*
    Endpoint pro Atendente/Admin finalizar a estadia (check-out)
    Método: POST
    Recebe: JSON { "reserva_id": X }
    Retorna: JSON { "status": "sucesso" } ou { "status": "erro", ... }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verifica se o usuário está logado (como Atendente ou Admin)
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

// 5. Lógica de Negócio (Check-out)
// Pra fazer check-out, a reserva deve estar com status 'CHECKIN'.
$sql_checkout = "UPDATE Reservas
                 SET status_reserva = 'FINALIZADA'
                 WHERE id = $reserva_id AND status_reserva = 'CHECKIN'";

if ($conexao->query($sql_checkout)) {
    // Verifica se alguma linha foi alterada
    if ($conexao->affected_rows > 0) {
        http_response_code(200);
        echo json_encode([
            'status' => 'sucesso',
            'mensagem' => 'Check-out realizado com sucesso. A reserva foi finalizada.'
        ]);
    } else {
        // Se 0 linhas foram afetadas, ou a reserva não existe
        // ou ela não estava com o status 'CHECKIN'
        http_response_code(400);
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Check-out falhou. A reserva não foi encontrada ou não estava com o status "CHECKIN".'
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Erro ao processar o check-out: ' . $conexao->error
    ]);
}
?>