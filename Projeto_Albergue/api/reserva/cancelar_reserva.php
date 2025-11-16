<?php
/*
    Endpoint para o cliente cancelar uma reserva
    Método: POST
    Recebe: JSON { "reserva_id": X }
    Retorna: JSON { "status": "sucesso" } ou { "status": "erro", ... }
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

// 3. Pega os dados do JSON ($dadosRecebidos) e da Sessão
$reserva_id = $dadosRecebidos['reserva_id'];
$cliente_id = $_SESSION['usuario_id'];

// 4. Valida os dados
if (empty($reserva_id)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'ID da reserva não informado.'
    ]);
    exit();
}

// 5. Inicia a Transação
$conexao->begin_transaction();

try {
    // --- Passo 1: Busca a reserva pra checar as regras ---
    $sql_busca = "SELECT data_checkin, status_reserva, fk_cliente_id 
                  FROM Reservas 
                  WHERE id = $reserva_id";
    
    $result_busca = $conexao->query($sql_busca);

    if ($result_busca->num_rows == 0) {
        throw new Exception('Reserva não encontrada.');
    }

    $reserva = $result_busca->fetch_assoc();
    $status_atual = $reserva['status_reserva'];
    $data_checkin = $reserva['data_checkin']; // Ex: "2025-11-20 12:00:00"

    // --- Passo 2: Checa se o cliente é o dono da reserva ---
    if ($reserva['fk_cliente_id'] != $cliente_id) {
        throw new Exception('Você não tem permissão para cancelar esta reserva.');
    }

    // --- Passo 3: Checa se a reserva já está CANCELADA ou FINALIZADA ---
    if ($status_atual == 'CANCELADA' || $status_atual == 'FINALIZADA') {
        throw new Exception('Esta reserva não pode mais ser cancelada.');
    }

    // --- Passo 4: Implementa a Regra de Negócio (RF04 - 3 dias/72h) ---
    
    // Converte a data de check-in (string) pra um timestamp (segundos)
    $checkin_timestamp = strtotime($data_checkin);
    // Pega o timestamp atual (agora)
    $agora_timestamp = time();

    // Calcula a diferença em horas
    $horas_restantes = ($checkin_timestamp - $agora_timestamp) / 3600; // (3600 segundos = 1 hora)

    // Se tiver 72 horas ou menos (3 dias) até o check-in, bloqueia
    if ($horas_restantes <= 72) {
        throw new Exception('Cancelamento não permitido. O prazo é de até 3 dias (72 horas) antes do check-in.');
    }

    // --- Passo 5: Atualiza o status da Reserva ---
    $sql_update_reserva = "UPDATE Reservas 
                           SET status_reserva = 'CANCELADA' 
                           WHERE id = $reserva_id";

    if (!$conexao->query($sql_update_reserva)) {
        throw new Exception('Erro ao cancelar a reserva.');
    }

    // --- Passo 6: Verifica se precisa de Estorno ---
    // Se a reserva estava 'CONFIRMADA' (ou seja, foi paga),
    // o estorno do pagamento da diária é simulado
    if ($status_atual == 'CONFIRMADA') {
        $sql_estorno = "UPDATE Pagamentos 
                        SET status_pagamento = 'ESTORNADO' 
                        WHERE fk_reserva_id = $reserva_id AND tipo = 'DIARIA'";
        
        if (!$conexao->query($sql_estorno)) {
            throw new Exception('Erro ao processar o estorno do pagamento.');
        }
    }

    // --- Sucesso: Efetiva a Transação ---
    $conexao->commit();

    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Reserva cancelada com sucesso.'
    ]);

} catch (Exception $e) {
    // --- Falha: Reverte a Transação ---
    $conexao->rollback();

    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => $e->getMessage()
    ]);
}
?>