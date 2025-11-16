<?php
/*
    Endpoint pra calcular o saldo devedor de extras
    Método: GET
    Recebe: ?reserva_id=X
    Retorna: JSON { "saldo_devedor": XX.XX }
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

// 3. Pega o ID da reserva
if (!isset($_GET['reserva_id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da reserva não fornecido.']);
    exit();
}
$reserva_id = $_GET['reserva_id'];

// 4. Lógica de Cálculo de Saldo
$saldo_devedor = 0.00;
$total_consumido = 0.00;
$total_pago_extra = 0.00;

try {
    // --- Passo 1: Calcula o total consumido ---
    $sql_consumo = "SELECT SUM(valor) AS total_consumido 
                    FROM Consumo_Extras 
                    WHERE fk_reserva_id = $reserva_id";
    
    $result_consumo = $conexao->query($sql_consumo);
    if ($result_consumo && $result_consumo->num_rows > 0) {
        $linha = $result_consumo->fetch_assoc();
        // Se 'total_consumido' for NULL (nenhum consumo), usa 0
        $total_consumido = $linha['total_consumido'] ?? 0.00;
    }

    // --- Passo 2: Calcula o total pago (apenas de 'EXTRA') ---
    $sql_pagamentos = "SELECT SUM(valor) AS total_pago
                       FROM Pagamentos 
                       WHERE fk_reserva_id = $reserva_id 
                       AND tipo = 'EXTRA' 
                       AND status_pagamento = 'APROVADO'";

    $result_pagamentos = $conexao->query($sql_pagamentos);
    if ($result_pagamentos && $result_pagamentos->num_rows > 0) {
        $linha = $result_pagamentos->fetch_assoc();
        // Se 'total_pago' for NULL (nenhum pagamento), usa 0
        $total_pago_extra = $linha['total_pago'] ?? 0.00;
    }

    // --- Passo 3: Calcula o saldo devedor ---
    $saldo_devedor = $total_consumido - $total_pago_extra;

    // Retorna o saldo
    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'saldo_devedor' => $saldo_devedor,
        'total_consumido' => $total_consumido,
        'total_pago_extra' => $total_pago_extra
    ]);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'erro',
        'mensagem' => $e->getMessage()
    ]);
}
?>