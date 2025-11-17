<?php

require_once '../config.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

$cliente_id = isset($dadosRecebidos['cliente_id']) ? $dadosRecebidos['cliente_id'] : 0;
$dados = isset($dadosRecebidos['dados']) ? $dadosRecebidos['dados'] : [];
if (empty($cliente_id) || empty($dados)) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID do cliente e dados são obrigatórios.']);
    exit();
}
$conexao->begin_transaction();
try {
    $campos_usuario = []; $params_usuario = []; $types_usuario = "";
    if (isset($dados['nome_completo'])) { $campos_usuario[] = "nome_completo = ?"; $params_usuario[] = $dados['nome_completo']; $types_usuario .= "s"; }
    if (isset($dados['email'])) { $campos_usuario[] = "email = ?"; $params_usuario[] = $dados['email']; $types_usuario .= "s"; }
    if (isset($dados['documento_numero'])) { $campos_usuario[] = "documento_numero = ?"; $params_usuario[] = $dados['documento_numero']; $types_usuario .= "s"; }
    if (isset($dados['data_nascimento'])) { $campos_usuario[] = "data_nascimento = ?"; $params_usuario[] = $dados['data_nascimento']; $types_usuario .= "s"; }
    if (isset($dados['telefone_celular'])) { $campos_usuario[] = "telefone_celular = ?"; $params_usuario[] = $dados['telefone_celular']; $types_usuario .= "s"; }
    if (count($campos_usuario) > 0) {
        $sql_update_usuario = "UPDATE Usuarios SET " . implode(', ', $campos_usuario) . " WHERE id = ? AND tipo_usuario = 'CLIENTE'";
        $params_usuario[] = $cliente_id; $types_usuario .= "i";
        $stmt_usuario = $conexao->prepare($sql_update_usuario);
        $stmt_usuario->bind_param($types_usuario, ...$params_usuario);
        if (!$stmt_usuario->execute()) { throw new Exception('Erro ao atualizar dados do usuário: ' . $stmt_usuario->error); }
        $stmt_usuario->close();
    }
    if (isset($dados['endereco'])) {
        $end = $dados['endereco'];
        $sql_update_endereco = "UPDATE Enderecos SET cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ? WHERE fk_usuario_id = ?";
        $stmt_endereco = $conexao->prepare($sql_update_endereco);
        $stmt_endereco->bind_param("sssssssi", $end['cep'], $end['logradouro'], $end['numero'], $end['complemento'], $end['bairro'], $end['cidade'], $end['estado'], $cliente_id);
        if (!$stmt_endereco->execute()) { throw new Exception('Erro ao atualizar endereço: ' . $stmt_endereco->error); }
        $stmt_endereco->close();
    }
    $conexao->commit();
    echo json_encode(['status' => 'sucesso', 'mensagem' => 'Dados do cliente atualizados.']);
} catch (Exception $e) {
    $conexao->rollback();
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}
$conexao->close();
?>