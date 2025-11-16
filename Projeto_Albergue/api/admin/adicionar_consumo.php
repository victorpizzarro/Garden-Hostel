<?php
/*
    Endpoint para o Atendente/Admin lançar um item de consumo extra
    Método: POST
    Recebe: JSON { "reserva_id": X, "descricao": "...", "valor": XX.XX }
    Retorna: JSON { "status": "sucesso", "consumo_id": X } ou { "status": "erro", ... }
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

// 3. Pega os dados do JSON ($dadosRecebidos) e da Sessão
$reserva_id = $dadosRecebidos['reserva_id'];
$descricao = $dadosRecebidos['descricao'];
$valor = $dadosRecebidos['valor'];
$atendente_id = $_SESSION['usuario_id']; // O ID do atendente que está lançando

// 4. Valida os dados
if (empty($reserva_id) || empty($descricao) || empty($valor)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'ID da reserva, descrição e valor são obrigatórios.'
    ]);
    exit();
}

// 5. Lógica de Negócio
// Antes de lançar o consumo, checa se a reserva está
// com o status 'CHECKIN'. Não se pode adicionar consumo
// a uma reserva que ainda não chegou ou que já foi finalizada

$sql_check = "SELECT status_reserva FROM Reservas WHERE id = $reserva_id";
$result_check = $conexao->query($sql_check);

if ($result_check->num_rows == 0) {
    http_response_code(404); // Not Found
    echo json_encode(['status' => 'erro', 'mensagem' => 'Reserva não encontrada.']);
    exit();
}

$reserva = $result_check->fetch_assoc();

if ($reserva['status_reserva'] != 'CHECKIN') {
    http_response_code(400);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Só é possível adicionar consumo em reservas com status "CHECKIN".'
    ]);
    exit();
}

// 6. Insere o Consumo
$sql_insert = "INSERT INTO Consumo_Extras (fk_reserva_id, fk_atendente_id, descricao, valor)
               VALUES ($reserva_id, $atendente_id, '$descricao', $valor)";

if ($conexao->query($sql_insert)) {
    $novo_consumo_id = $conexao->insert_id;
    http_response_code(201); // Created
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Consumo adicionado com sucesso.',
        'consumo_id' => $novo_consumo_id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Erro ao adicionar consumo: ' . $conexao->error
    ]);
}
?>