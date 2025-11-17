<?php
/*
  Endpoint para criar uma nova reserva (status PENDENTE).
  Versão 2.0 - Corrigido com Prepared Statements (Seguro e Funcional)
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


$cliente_id = $_SESSION['usuario_id'];
$vagas_ids = $dadosRecebidos['vagas_ids']; 
$checkin_str = $dadosRecebidos['checkin'];
$checkout_str = $dadosRecebidos['checkout'];
$valor_total = $dadosRecebidos['valor_total'];
$termo_id = $dadosRecebidos['termo_id']; 
$ip_aceite = $_SERVER['REMOTE_ADDR']; 


if (empty($vagas_ids) || empty($checkin_str) || empty($checkout_str) || empty($termo_id)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Dados da reserva incompletos.'
    ]);
    exit();
}


$data_checkin = $checkin_str . ' 12:00:00';
$data_checkout = $checkout_str . ' 12:00:00';


$conexao->begin_transaction();

try {
   
    $sql_reserva = "INSERT INTO Reservas 
                      (fk_cliente_id, data_checkin, data_checkout, valor_total_diarias, status_reserva, origem)
                    VALUES 
                      (?, ?, ?, ?, 'PENDENTE', 'ONLINE')";
    
    $stmt_reserva = $conexao->prepare($sql_reserva);
    
    $stmt_reserva->bind_param("issd", $cliente_id, $data_checkin, $data_checkout, $valor_total);

    if (!$stmt_reserva->execute()) {
        throw new Exception('Erro ao criar a reserva: ' . $stmt_reserva->error);
    }

    $nova_reserva_id = $conexao->insert_id;
    $stmt_reserva->close();

   
    $sql_vagas = "INSERT INTO Reservas_Vagas (fk_reserva_id, fk_vaga_id) VALUES (?, ?)";
    $stmt_vagas = $conexao->prepare($sql_vagas);
    
    foreach ($vagas_ids as $vaga_id) {
        $stmt_vagas->bind_param("ii", $nova_reserva_id, $vaga_id);
        if (!$stmt_vagas->execute()) {
            throw new Exception('Erro ao associar vaga à reserva: ' . $stmt_vagas->error);
        }
    }
    $stmt_vagas->close();


    
    $sql_termos = "INSERT INTO Termos_Aceites (fk_usuario_id, fk_termo_id, ip_aceite)
                   VALUES (?, ?, ?)";
    
    $stmt_termos = $conexao->prepare($sql_termos);
    
    $stmt_termos->bind_param("iis", $cliente_id, $termo_id, $ip_aceite);

    if (!$stmt_termos->execute()) {
       
    }
    $stmt_termos->close();


    
    $conexao->commit();
    
    http_response_code(201); // 201 Created
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Reserva criada com status PENDENTE.',
        'reserva_id' => $nova_reserva_id
    ]);

} catch (Exception $e) {
   
    $conexao->rollback();
    
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'erro',
        'mensagem' => $e->getMessage()
    ]);
}

$conexao->close();
?>