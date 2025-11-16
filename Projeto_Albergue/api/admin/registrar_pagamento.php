<?php
/*
    Endpoint pro Atendente registrar um pagamento no balcão (seja da diária ou de extras)
    Método: POST
    Recebe: JSON { "reserva_id": X, "valor": XX.XX, "tipo": "DIARIA|EXTRA", "metodo": "DINHEIRO|CARTAO_MAQUININHA" }
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
$valor = $dadosRecebidos['valor'];
$tipo = $dadosRecebidos['tipo'];     // 'DIARIA' ou 'EXTRA'
$metodo = $dadosRecebidos['metodo']; // 'DINHEIRO' ou 'CARTAO_MAQUININHA'

// 4. Valida os dados
if (empty($reserva_id) || empty($valor) || empty($tipo) || empty($metodo)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Todos os campos (reserva_id, valor, tipo, metodo) são obrigatórios.'
    ]);
    exit();
}

// 5. Inicia a Transação (Obrigatório)
$conexao->begin_transaction();

try {
    // --- Passo 1: Inserir o registro de Pagamento ---
    $sql_pagamento = "INSERT INTO Pagamentos 
                        (fk_reserva_id, valor, tipo, metodo, status_pagamento)
                      VALUES 
                        ($reserva_id, $valor, '$tipo', '$metodo', 'APROVADO')";

    if (!$conexao->query($sql_pagamento)) {
        throw new Exception('Erro ao registrar o pagamento: ' . $conexao->error);
    }

    // --- Passo 2: Se for pagamento da DIÁRIA, confirmar a reserva ---
    if ($tipo == 'DIARIA') {
        // Se o pagamento for da diária, atualiza a reserva de PENDENTE para CONFIRMADA
        $sql_update_reserva = "UPDATE Reservas 
                               SET status_reserva = 'CONFIRMADA' 
                               WHERE id = $reserva_id AND status_reserva = 'PENDENTE'";
        
        if (!$conexao->query($sql_update_reserva)) {
            throw new Exception('Erro ao confirmar a reserva após o pagamento: ' . $conexao->error);
        }
    }
    
    // (Se o tipo for 'EXTRA', não é feito nada na tabela Reservas,
    // apenas registra o pagamento

    // --- Sucesso: Efetiva a Transação ---
    $conexao->commit();

    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Pagamento registrado com sucesso.'
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