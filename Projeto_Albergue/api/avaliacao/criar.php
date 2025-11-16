<?php
/*
    Endpoint para um cliente criar uma nova avaliação
    Método: POST
    Recebe: JSON { "reserva_id": X, "nota": X, "comentario": "..." }
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
$cliente_id = $_SESSION['usuario_id'];
$reserva_id = $dadosRecebidos['reserva_id'];
$nota = $dadosRecebidos['nota'];
$comentario = $dadosRecebidos['comentario'];

// 4. Valida os dados
if (empty($reserva_id) || empty($nota)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'ID da reserva e nota são obrigatórios.'
    ]);
    exit();
}

// 5. Lógica de Negócio
// Antes de inserir, precisa checar duas regras:
// 1. O cliente logado é o dono da reserva?
// 2. A reserva está com o status 'FINALIZADA'?

$sql_check = "SELECT status_reserva, fk_cliente_id 
              FROM Reservas 
              WHERE id = $reserva_id";

$result_check = $conexao->query($sql_check);

if ($result_check->num_rows == 0) {
    http_response_code(404); // Not Found
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Reserva não encontrada.'
    ]);
    exit();
}

$reserva = $result_check->fetch_assoc();

// Checando Regra 1 (Dono)
if ($reserva['fk_cliente_id'] != $cliente_id) {
    http_response_code(403); // Forbidden
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Você não pode avaliar uma reserva que não é sua.'
    ]);
    exit();
}

// Checando Regra 2 (Status)
if ($reserva['status_reserva'] != 'FINALIZADA') {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Você só pode avaliar reservas que já foram finalizadas.'
    ]);
    exit();
}

// 6. Insere a Avaliação
// A avaliação já nasce como 'PENDENTE',
// esperando a moderação do Admin Master.
$sql_insert = "INSERT INTO Avaliacoes (fk_reserva_id, fk_cliente_id, nota, comentario)
               VALUES ($reserva_id, $cliente_id, $nota, '$comentario')";

if ($conexao->query($sql_insert)) {
    http_response_code(201); // Created
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Avaliação enviada com sucesso. Ela será publicada após moderação.'
    ]);
} else {
    // Erro comum: O cliente tenta avaliar a mesma reserva duas vezes
    // (o banco tem uma 'UNIQUE KEY' no 'fk_reserva_id')
    if ($conexao->errno == 1062) { // Erro de Duplicidade
        http_response_code(400);
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Esta reserva já foi avaliada.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Erro ao salvar avaliação: ' . $conexao->error
        ]);
    }
}
?>