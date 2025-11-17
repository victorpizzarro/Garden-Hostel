<?php

require_once '../config.php';

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'ADMIN_MASTER') {
    http_response_code(401); 
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

$avaliacao_id = isset($dadosRecebidos['avaliacao_id']) ? $dadosRecebidos['avaliacao_id'] : 0;
$novo_status = isset($dadosRecebidos['novo_status']) ? $dadosRecebidos['novo_status'] : '';
if (empty($avaliacao_id) || empty($novo_status)) { http_response_code(400); echo json_encode(['status' => 'erro', 'mensagem' => 'ID da avaliação e o novo status são obrigatórios.']); exit(); }
if ($novo_status != 'APROVADO' && $novo_status != 'REPROVADO') { http_response_code(400); echo json_encode(['status' => 'erro', 'mensagem' => 'Status inválido. Use apenas "APROVADO" ou "REPROVADO".']); exit(); }
try {
    $sql = "UPDATE Avaliacoes SET status_moderacao = ? WHERE id = ?";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("si", $novo_status, $avaliacao_id);
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'sucesso', 'mensagem' => 'Avaliação moderada com sucesso.']);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'erro', 'mensagem' => 'Avaliação não encontrada.']);
        }
    } else {
        throw new Exception('Erro ao moderar avaliação: ' . $stmt->error);
    }
    $stmt->close();
    $conexao->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
    if (isset($conexao) && $conexao) $conexao->close();
}
?>