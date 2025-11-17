<?php
/**
 * Arquivo: api/admin/quarto_crud.php
 * Descrição: Endpoint para operações CRUD de quartos
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
        case 'listar':
            listarQuartos();
            break;
        case 'criar':
            criarQuarto();
            break;
        case 'alterar':
            alterarQuarto();
            break;
        case 'excluir':
            excluirQuarto();
            break;
        default:
            throw new Exception('Ação não especificada. Use "listar", "criar", "alterar" ou "excluir".');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}

function listarQuartos() {
    global $conexao;
    
    $sql = "SELECT id, nome, capacidade, preco_diaria, tipo, tem_banheiro,
                   descricao_pt, descricao_en, data_entrada, data_saida
            FROM Quartos 
            ORDER BY nome";
    
    $result = $conexao->query($sql);
    $quartos = [];
    
    while ($linha = $result->fetch_assoc()) {
        $quartos[] = $linha;
    }
    
    echo json_encode($quartos);
}

function criarQuarto() {
    global $conexao, $dadosRecebidos;
    
    $dados = $dadosRecebidos['dados'];
    
    $sql = "INSERT INTO Quartos (nome, capacidade, preco_diaria, tipo, tem_banheiro,
                                descricao_pt, descricao_en, data_entrada, data_saida)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("sidsissss", 
        $dados['nome'],
        $dados['capacidade'],
        $dados['preco_diaria'],
        $dados['tipo'],
        $dados['tem_banheiro'],
        $dados['descricao_pt'],
        $dados['descricao_en'],
        $dados['data_entrada'],
        $dados['data_saida']
    );
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'sucesso', 'mensagem' => 'Quarto criado com sucesso.']);
    } else {
        throw new Exception('Erro ao criar quarto: ' . $stmt->error);
    }
    
    $stmt->close();
}

function alterarQuarto() {
    global $conexao, $dadosRecebidos;
    
    $id = $dadosRecebidos['id'];
    $dados = $dadosRecebidos['dados'];
    
    $sql = "UPDATE Quartos SET 
                nome = ?, capacidade = ?, preco_diaria = ?, tipo = ?, tem_banheiro = ?,
                descricao_pt = ?, descricao_en = ?, data_entrada = ?, data_saida = ?
            WHERE id = ?";
    
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("sidsissssi", 
        $dados['nome'],
        $dados['capacidade'],
        $dados['preco_diaria'],
        $dados['tipo'],
        $dados['tem_banheiro'],
        $dados['descricao_pt'],
        $dados['descricao_en'],
        $dados['data_entrada'],
        $dados['data_saida'],
        $id
    );
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'sucesso', 'mensagem' => 'Quarto atualizado com sucesso.']);
    } else {
        throw new Exception('Erro ao atualizar quarto: ' . $stmt->error);
    }
    
    $stmt->close();
}

function excluirQuarto() {
    global $conexao, $dadosRecebidos;
    
    $id = $dadosRecebidos['id'];
    
    // Verifica se existem vagas associadas
    $sql_check = "SELECT COUNT(*) as total FROM Vagas WHERE fk_quarto_id = ?";
    $stmt_check = $conexao->prepare($sql_check);
    $stmt_check->bind_param("i", $id);
    $stmt_check->execute();
    $result = $stmt_check->get_result();
    $row = $result->fetch_assoc();
    $stmt_check->close();
    
    if ($row['total'] > 0) {
        throw new Exception('Não é possível excluir o quarto. Exclua as vagas primeiro.');
    }
    
    $sql = "DELETE FROM Quartos WHERE id = ?";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'sucesso', 'mensagem' => 'Quarto excluído com sucesso.']);
    } else {
        throw new Exception('Erro ao excluir quarto: ' . $stmt->error);
    }
    
    $stmt->close();
}
?>