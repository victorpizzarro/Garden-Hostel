<?php
require_once '../config.php';

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'ADMIN_MASTER') {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}


$json = file_get_contents('php://input');
$dadosRecebidos = json_decode($json, true);

$titulo = $dadosRecebidos['titulo'] ?? '';
$conteudo_pt = $dadosRecebidos['conteudo_pt'] ?? '';
$conteudo_en = $dadosRecebidos['conteudo_en'] ?? '';

if (empty($titulo) || empty($conteudo_pt) || empty($conteudo_en)) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Todos os campos são obrigatórios.']);
    exit();
}

$conexao->begin_transaction();

try {
   
    $sql_versao = "SELECT MAX(versao) AS ultima_versao FROM Termos_Regras";
    $result_versao = $conexao->query($sql_versao);
    $nova_versao = 1;
    
    if ($result_versao->num_rows > 0) {
        $linha = $result_versao->fetch_assoc();
        if ($linha['ultima_versao'] !== null) {
            $nova_versao = (int)$linha['ultima_versao'] + 1;
        }
    }

    
    $sql_insert = "INSERT INTO Termos_Regras (titulo, conteudo_pt, conteudo_en, versao) VALUES (?, ?, ?, ?)";
    $stmt_insert = $conexao->prepare($sql_insert);
    $stmt_insert->bind_param("sssi", $titulo, $conteudo_pt, $conteudo_en, $nova_versao);

    if (!$stmt_insert->execute()) {
        if ($conexao->errno == 1062) {
            throw new Exception('Erro: Conflito de versão detectado.');
        } else {
            throw new Exception('Erro ao inserir novo termo: ' . $stmt_insert->error);
        }
    }

    $conexao->commit();
    echo json_encode([
        'status' => 'sucesso', 
        'mensagem' => 'Nova versão dos termos criada com sucesso.',
        'nova_versao' => $nova_versao,
        'id' => $conexao->insert_id
    ]);

} catch (Exception $e) {
    $conexao->rollback();
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}
?>