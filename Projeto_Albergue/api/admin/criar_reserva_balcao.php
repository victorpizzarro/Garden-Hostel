<?php
/*
    Endpoint para o Atendente/Admin criar uma reserva (Balcão)
    Método: POST
    Recebe: JSON { 
        "fk_cliente_id": X, (O ID do cliente para quem é a reserva)
        "vagas_ids": [1, 2],
        "checkin": "AAAA-MM-DD",
        "checkout": "AAAA-MM-DD",
        "valor_total": "XXX.XX"
    }
    Retorna: JSON { "status": "sucesso", "reserva_id": X }
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

// 3. Pega o ID da sessão
$atendente_id = $_SESSION['usuario_id'];

// 4. Pega os dados do JSON ($dadosRecebidos)
$cliente_id = $dadosRecebidos['fk_cliente_id']; // O cliente para quem a reserva é
$vagas_ids = $dadosRecebidos['vagas_ids'];
$checkin_str = $dadosRecebidos['checkin'];
$checkout_str = $dadosRecebidos['checkout'];
$valor_total = $dadosRecebidos['valor_total'];

// 5. Valida os dados
if (empty($cliente_id) || empty($vagas_ids) || empty($checkin_str) || empty($checkout_str)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Dados da reserva incompletos (Cliente, Vagas, Datas).'
    ]);
    exit();
}

// 6. Aplica a Regra de Negócio: Check-in/Check-out ao Meio-dia (12:00)
$data_checkin = $checkin_str . ' 12:00:00';
$data_checkout = $checkout_str . ' 12:00:00';

// 7. Iniciar a Transação (Obrigatório)
$conexao->begin_transaction();

try {
    // --- Passo 1: Insere na tabela 'Reservas' ---
    // A reserva nasce como 'PENDENTE' e origem 'BALCAO'
    $sql_reserva = "INSERT INTO Reservas 
                        (fk_cliente_id, fk_atendente_id, data_checkin, data_checkout, valor_total_diarias, status_reserva, origem)
                    VALUES 
                        ($cliente_id, $atendente_id, '$data_checkin', '$data_checkout', $valor_total, 'PENDENTE', 'BALCAO')";

    if (!$conexao->query($sql_reserva)) {
        throw new Exception('Erro ao criar a reserva: ' . $conexao->error);
    }

    $nova_reserva_id = $conexao->insert_id;

    // --- Passo 2: Insere na tabela 'Reservas_Vagas' ---
    $sql_vagas = "INSERT INTO Reservas_Vagas (fk_reserva_id, fk_vaga_id) VALUES (?, ?)";
    $stmt_vagas = $conexao->prepare($sql_vagas);
    
    foreach ($vagas_ids as $vaga_id) {
        $stmt_vagas->bind_param("ii", $nova_reserva_id, $vaga_id);
        if (!$stmt_vagas->execute()) {
            throw new Exception('Erro ao associar vaga à reserva: ' . $stmt_vagas->error);
        }
    }
    $stmt_vagas->close();

    // --- Sucesso: Efetiva a Transação ---
    $conexao->commit();
    
    http_response_code(201); // 201 Created
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Reserva de balcão criada com status PENDENTE.',
        'reserva_id' => $nova_reserva_id
    ]);

} catch (Exception $e) {
    // --- Falha: Reverte a Transação ---
    $conexao->rollback();
    
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'erro',
        'mensagem' => $e->getMessage()
    ]);
}
?>