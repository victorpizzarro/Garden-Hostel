<?php
/**
 * Arquivo: api/admin/cliente_crud.php
 * Descrição: Endpoint para operações CRUD de clientes (buscar, detalhes)
 */

require_once '../config.php';


if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}


$acao = isset($_GET['acao']) ? $_GET['acao'] : '';

try {
    switch($acao) {
        case 'buscar':
            buscarClientes();
            break;
        case 'detalhes':
            detalhesCliente();
            break;
        default:
            throw new Exception('Ação não especificada. Use "buscar" ou "detalhes".');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}

function buscarClientes() {
    global $conexao;
    
    $termo = isset($_GET['termo']) ? $_GET['termo'] : '';
    
    // DEBUG
    error_log("=== BUSCA CLIENTES ===");
    error_log("Termo: " . $termo);
    
    if (empty($termo) || strlen($termo) < 3) {
        error_log("Termo muito curto");
        echo json_encode([]);
        return;
    }
    
    
    $sql = "SELECT id, nome_completo, email, documento_numero as documento, 
                   telefone_celular as telefone, documento_tipo, data_nascimento
            FROM Usuarios 
            WHERE tipo_usuario = 'CLIENTE' 
            AND (nome_completo LIKE ? OR email LIKE ? OR documento_numero LIKE ?)
            ORDER BY nome_completo LIMIT 20";
    
    error_log("SQL: " . $sql);
    
    $stmt = $conexao->prepare($sql);
    $like_termo = "%" . $termo . "%";
    $stmt->bind_param("sss", $like_termo, $like_termo, $like_termo);
    
    if (!$stmt->execute()) {
        error_log("Erro na execução: " . $stmt->error);
        echo json_encode([]);
        return;
    }
    
    $result = $stmt->get_result();
    $clientes = $result->fetch_all(MYSQLI_ASSOC);
    
    error_log("Clientes encontrados: " . count($clientes));
    foreach ($clientes as $cliente) {
        error_log("Cliente: " . $cliente['nome_completo'] . " - " . $cliente['email']);
    }
    
    $stmt->close();
    
    echo json_encode($clientes);
}

function detalhesCliente() {
    global $conexao;
    
    $cliente_id = isset($_GET['id']) ? $_GET['id'] : '';
    
    error_log("=== DETALHES CLIENTE ===");
    error_log("ID do cliente: " . $cliente_id);
    
    if (empty($cliente_id)) {
        throw new Exception('ID do cliente não fornecido.');
    }
    
    
    $sql = "SELECT id, nome_completo, email, documento_numero as documento, 
                   telefone_celular as telefone, documento_tipo, data_nascimento
            FROM Usuarios 
            WHERE id = ? AND tipo_usuario = 'CLIENTE'";
    
    error_log("SQL detalhes: " . $sql);
    
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $cliente_id);
    
    if (!$stmt->execute()) {
        error_log("Erro na execução detalhes: " . $stmt->error);
        throw new Exception('Erro ao buscar dados do cliente.');
    }
    
    $result = $stmt->get_result();
    $cliente = $result->fetch_assoc();
    
    $stmt->close();
    
    if (!$cliente) {
        error_log("Cliente não encontrado para ID: " . $cliente_id);
        throw new Exception('Cliente não encontrado.');
    }
    
    error_log("Cliente encontrado: " . $cliente['nome_completo']);
    
    echo json_encode($cliente);
}
?>