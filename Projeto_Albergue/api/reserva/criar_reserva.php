<?php
/*
    Endpoint para criar uma nova reserva (status PENDENTE).
    Método: POST
    Recebe: JSON {
        "vagas_ids": [1, 2],
        "checkin": "AAAA-MM-DD",
        "checkout": "AAAA-MM-DD",
        "valor_total": "XXX.XX",
        "termo_id": X,
        "ip_aceite": "..."
    }
    Retorna: JSON { "status": "sucesso", "reserva_id": X } ou { "status": "erro", ... }
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
$cliente_id = $_SESSION['usuario_id'];
$vagas_ids = $dadosRecebidos['vagas_ids']; // Array de IDs das vagas
$checkin_str = $dadosRecebidos['checkin'];
$checkout_str = $dadosRecebidos['checkout'];
$valor_total = $dadosRecebidos['valor_total'];
$termo_id = $dadosRecebidos['termo_id']; // ID do termo que o usuário aceitou
$ip_aceite = $_SERVER['REMOTE_ADDR']; // Pega o IP do usuário para o aceite

// 4. Valida os dados
if (empty($vagas_ids) || empty($checkin_str) || empty($checkout_str) || empty($termo_id)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Dados da reserva incompletos.'
    ]);
    exit();
}

// 5. Aplica a Regra de Negócio: Check-in/Check-out ao Meio-dia (12:00)
$data_checkin = $checkin_str . ' 12:00:00';
$data_checkout = $checkout_str . ' 12:00:00';

// 6. Inicia a Transação (Obrigatório, pois são 3 tabelas)
$conexao->begin_transaction();

try {
    // --- Passo 1: Insere na tabela 'Reservas' ---
    // A reserva nasce como 'PENDENTE' e origem 'ONLINE'
    $sql_reserva = "INSERT INTO Reservas 
                        (fk_cliente_id, data_checkin, data_checkout, valor_total_diarias, status_reserva, origem)
                    VALUES 
                        ($cliente_id, '$data_checkin', '$data_checkout', $valor_total, 'PENDENTE', 'ONLINE')";

    if (!$conexao->query($sql_reserva)) {
        throw new Exception('Erro ao criar a reserva: ' . $conexao->error);
    }

    // Pega o ID da reserva que foi criada
    $nova_reserva_id = $conexao->insert_id;

    // --- Passo 2: Insere na tabela 'Reservas_Vagas' (Loop) ---
    // Prepara o SQL de inserção das vagas
    $sql_vagas = "INSERT INTO Reservas_Vagas (fk_reserva_id, fk_vaga_id) VALUES (?, ?)";
    $stmt_vagas = $conexao->prepare($sql_vagas);
    
    foreach ($vagas_ids as $vaga_id) {
        $stmt_vagas->bind_param("ii", $nova_reserva_id, $vaga_id);
        if (!$stmt_vagas->execute()) {
            throw new Exception('Erro ao associar vaga à reserva: ' . $stmt_vagas->error);
        }
    }
    $stmt_vagas->close();


    // --- Passo 3: Insere na tabela 'Termos_Aceites' ---
    $sql_termos = "INSERT INTO Termos_Aceites (fk_usuario_id, fk_termo_id, ip_aceite)
                   VALUES ($cliente_id, $termo_id, '$ip_aceite')";
    
    if (!$conexao->query($sql_termos)) {
        throw new Exception('Erro ao registrar aceite de termos: ' . $conexao->error);
    }


    // --- Sucesso: Efetiva a Transação ---
    $conexao->commit();
    
    http_response_code(201); // 201 Created
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Reserva criada com status PENDENTE.',
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