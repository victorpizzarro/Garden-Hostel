<?php
/**
 * Arquivo: api/admin/avaliacao_moderar.php
 * Descrição: Endpoint para o Admin Master aprovar ou reprovar uma avaliação (RF07).
 * Método: POST
 * Recebe: JSON { "avaliacao_id": X, "novo_status": "APROVADO" | "REPROVADO" }
 * Retorna: JSON { "status": "sucesso" } ou { "status": "erro", ... }
 */

/*
    Endpoint pro Admin Master aprovar ou reprovar uma avaliação
    Método: POST
    Recebe: JSON { "avaliacao_id": X, "novo_status": "APROVADO" | "REPROVADO" }
    Retorna: JSON { "status": "sucesso" } ou { "status": "erro", ... }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verifica se o usuário é ADMIN_MASTER
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'ADMIN_MASTER') {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Apenas o Admin Master pode moderar avaliações.'
    ]);
    exit();
}

// 3. Pega os dados do JSON ($dadosRecebidos)
$avaliacao_id = $dadosRecebidos['avaliacao_id'];
$novo_status = $dadosRecebidos['novo_status']; // 'APROVADO' ou 'REPROVADO'

// 4. Valida os dados
if (empty($avaliacao_id) || empty($novo_status)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'ID da avaliação e o novo status são obrigatórios.'
    ]);
    exit();
}

// 4b. Valida o status
if ($novo_status != 'APROVADO' && $novo_status != 'REPROVADO') {
    http_response_code(400);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Status inválido. Use apenas "APROVADO" ou "REPROVADO".'
    ]);
    exit();
}

// 5. Lógica de Moderação
// Atualiza o status da avaliação
$sql = "UPDATE Avaliacoes
        SET status_moderacao = '$novo_status'
        WHERE id = $avaliacao_id";

if ($conexao->query($sql)) {
    if ($conexao->affected_rows > 0) {
        http_response_code(200);
        echo json_encode([
            'status' => 'sucesso',
            'mensagem' => 'Avaliação moderada com sucesso.'
        ]);
    } else {
        http_response_code(404); // Not Found
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Avaliação não encontrada.'
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Erro ao moderar avaliação: ' . $conexao->error
    ]);
}
?>