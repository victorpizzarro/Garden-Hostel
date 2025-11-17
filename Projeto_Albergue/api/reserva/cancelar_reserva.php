<?php
/*
    Endpoint para o cliente cancelar uma reserva
    Método: POST
    Recebe: JSON { "reserva_id": X }
    Retorna: JSON { "status": "sucesso" } ou { "status": "erro", ... }
*/


require_once '../config.php';


if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'CLIENTE') {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Você precisa estar logado como cliente.'
    ]);
    exit();
}


$reserva_id = $dadosRecebidos['reserva_id'];
$cliente_id = $_SESSION['usuario_id'];


if (empty($reserva_id)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'ID da reserva não informado.'
    ]);
    exit();
}


$conexao->begin_transaction();

try {
   
    $sql_busca = "SELECT data_checkin, status_reserva, fk_cliente_id 
                  FROM Reservas 
                  WHERE id = $reserva_id";
    
    $result_busca = $conexao->query($sql_busca);

    if ($result_busca->num_rows == 0) {
        throw new Exception('Reserva não encontrada.');
    }

    $reserva = $result_busca->fetch_assoc();
    $status_atual = $reserva['status_reserva'];
    $data_checkin = $reserva['data_checkin']; 

    if ($reserva['fk_cliente_id'] != $cliente_id) {
        throw new Exception('Você não tem permissão para cancelar esta reserva.');
    }

    
    if ($status_atual == 'CANCELADA' || $status_atual == 'FINALIZADA') {
        throw new Exception('Esta reserva não pode mais ser cancelada.');
    }

  
    $checkin_timestamp = strtotime($data_checkin);
    
    $agora_timestamp = time();

    
    $horas_restantes = ($checkin_timestamp - $agora_timestamp) / 3600; 

    
    if ($horas_restantes <= 72) {
        throw new Exception('Cancelamento não permitido. O prazo é de até 3 dias (72 horas) antes do check-in.');
    }

    
    $sql_update_reserva = "UPDATE Reservas 
                           SET status_reserva = 'CANCELADA' 
                           WHERE id = $reserva_id";

    if (!$conexao->query($sql_update_reserva)) {
        throw new Exception('Erro ao cancelar a reserva.');
    }

   
    if ($status_atual == 'CONFIRMADA') {
        $sql_estorno = "UPDATE Pagamentos 
                        SET status_pagamento = 'ESTORNADO' 
                        WHERE fk_reserva_id = $reserva_id AND tipo = 'DIARIA'";
        
        if (!$conexao->query($sql_estorno)) {
            throw new Exception('Erro ao processar o estorno do pagamento.');
        }
    }

    
    $conexao->commit();

    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Reserva cancelada com sucesso.'
    ]);

} catch (Exception $e) {
    
    $conexao->rollback();

    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => $e->getMessage()
    ]);
}
?>