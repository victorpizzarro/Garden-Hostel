<?php
/**
 * Arquivo: api/admin/vaga_crud.php
 * Descrição: Endpoint para operações CRUD de vagas
 */

require_once '../config.php';

// Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $dadosRecebidos = json_decode($json, true);
    $acao = $dadosRecebidos['acao'];
} else {
    $acao = isset($_GET['acao']) ? $_GET['acao'] : '';
}

try {
    switch($acao) {
        case 'listar_por_quarto':
            listarVagasPorQuarto();
            break;
        case 'criar':
            criarVaga();
            break;
        case 'excluir':
            excluirVaga();
            break;
        default:
            throw new Exception('Ação não especificada. Use "listar_por_quarto", "criar" ou "excluir".');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}

function listarVagasPorQuarto() {
    global $conexao;
    
    $quarto_id = isset($_GET['quarto_id']) ? $_GET['quarto_id'] : '';
    
    if (empty($quarto_id)) {
        throw new Exception('ID do quarto não fornecido.');
    }
    
    $sql = "SELECT id, nome_identificador, descricao_peculiaridades_pt, descricao_peculiaridades_en
            FROM Vagas 
            WHERE fk_quarto_id = ?
            ORDER BY nome_identificador";
    
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $quarto_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $vagas = [];
    
    while ($linha = $result->fetch_assoc()) {
        $vagas[] = $linha;
    }
    
    $stmt->close();
    
    echo json_encode($vagas);
}

function criarVaga() {
    global $conexao, $dadosRecebidos;
    
    $dados = $dadosRecebidos['dados'];
    
    $sql = "INSERT INTO Vagas (fk_quarto_id, nome_identificador, descricao_peculiaridades_pt, descricao_peculiaridades_en)
            VALUES (?, ?, ?, ?)";
    
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("isss", 
        $dados['fk_quarto_id'],
        $dados['nome_identificador'],
        $dados['descricao_pt'],
        $dados['descricao_en']
    );
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'sucesso', 'mensagem' => 'Vaga criada com sucesso.']);
    } else {
        throw new Exception('Erro ao criar vaga: ' . $stmt->error);
    }
    
    $stmt->close();
}

function excluirVaga() {
    global $conexao, $dadosRecebidos;
    
    $id = $dadosRecebidos['id'];
    
    
    $sql_check = "SELECT COUNT(*) as total FROM Reservas_Vagas WHERE fk_vaga_id = ?";
    $stmt_check = $conexao->prepare($sql_check);
    $stmt_check->bind_param("i", $id);
    $stmt_check->execute();
    $result = $stmt_check->get_result();
    $row = $result->fetch_assoc();
    $stmt_check->close();
    
    if ($row['total'] > 0) {
        throw new Exception('Não é possível excluir a vaga. Existem reservas associadas.');
    }
    
    $sql = "DELETE FROM Vagas WHERE id = ?";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'sucesso', 'mensagem' => 'Vaga excluída com sucesso.']);
    } else {
        throw new Exception('Erro ao excluir vaga: ' . $stmt->error);
    }
    
    $stmt->close();
}
?>