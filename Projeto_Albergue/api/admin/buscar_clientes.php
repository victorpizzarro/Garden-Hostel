<?php

require_once '../config.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

$tipo_busca = isset($_GET['tipo']) ? $_GET['tipo'] : '';
$sql_base = "SELECT id, nome_completo, email, documento_numero, telefone_celular FROM Usuarios WHERE tipo_usuario = 'CLIENTE' AND ";
$sql_where = ""; $params = []; $types = "";
try {
    switch ($tipo_busca) {
        case 'id': $sql_where = "id = ?"; $params[] = $_GET['valor']; $types = "i"; break;
        case 'cpf': $sql_where = "documento_numero = ?"; $params[] = $_GET['valor']; $types = "s"; break;
        case 'termo':
            $termo = isset($_GET['valor']) ? $_GET['valor'] : '';
            if (empty($termo)) { echo json_encode([]); exit(); }
            $sql_where = "(nome_completo LIKE ? OR email LIKE ? OR documento_numero LIKE ?)";
            $like_termo = "%" . $termo . "%"; $params = [$like_termo, $like_termo, $like_termo]; $types = "sss";
            break;
        case 'nome_data':
            $nome = isset($_GET['nome']) ? $_GET['nome'] : ''; $data_nasc = isset($_GET['data_nasc']) ? $_GET['data_nasc'] : '';
            $sql_where = "nome_completo LIKE ? AND data_nascimento = ?";
            $like_nome = "%" . $nome . "%"; $params = [$like_nome, $data_nasc]; $types = "ss";
            break;
        default: throw new Exception('Tipo de busca inválido.');
    }
    $sql_completo = $sql_base . $sql_where;
    $stmt = $conexao->prepare($sql_completo);
    if ($stmt === false) { throw new Exception('Erro ao preparar a consulta: ' . $conexao->error); }
    if (count($params) > 0) { $stmt->bind_param($types, ...$params); }
    if ($stmt->execute() === false) { throw new Exception('Erro ao executar a consulta: ' . $stmt->error); }
    $resultado = $stmt->get_result();
    $clientes = $resultado->fetch_all(MYSQLI_ASSOC);
    $stmt->close(); $conexao->close();
    echo json_encode($clientes);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
    if (isset($stmt) && $stmt) $stmt->close();
    if (isset($conexao) && $conexao) $conexao->close();
}
?>