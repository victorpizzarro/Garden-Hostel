<?php
/*
    Endpoint pro Admin Master gerenciar (CRUD) os Quartos
    Método: GET (pra Listar) ou POST (pra Criar, Alterar, Excluir)
    GET ?acao=listar
    POST { "acao": "criar", "dados": { ... } }
    POST { "acao": "alterar", "id": X, "dados": { ... } }
    POST { "acao": "excluir", "id": X }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verifica se o usuário é ADMIN_MASTER
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'ADMIN_MASTER') {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Apenas o Admin Master pode gerenciar quartos.'
    ]);
    exit();
}

$metodo = $_SERVER['REQUEST_METHOD'];
$acao = '';

if ($metodo == 'GET') {
    $acao = isset($_GET['acao']) ? $_GET['acao'] : 'listar';
} else if ($metodo == 'POST') {
    $acao = isset($dadosRecebidos['acao']) ? $dadosRecebidos['acao'] : '';
}

// 3. Lógica CRUD
switch ($acao) {
    // --- LISTAR (READ) ---
    case 'listar':
        $sql = "SELECT * FROM Quartos ORDER BY nome ASC";
        $resultado = $conexao->query($sql);
        $quartos = [];
        while ($linha = $resultado->fetch_assoc()) {
            $quartos[] = $linha;
        }
        echo json_encode($quartos);
        break;

    // --- CRIAR (CREATE) ---
    case 'criar':
        $dados = $dadosRecebidos['dados'];
        $sql = "INSERT INTO Quartos (nome, descricao_pt, descricao_en, capacidade, tem_banheiro, preco_diaria)
                VALUES ('{$dados['nome']}', '{$dados['descricao_pt']}', '{$dados['descricao_en']}', {$dados['capacidade']}, {$dados['tem_banheiro']}, {$dados['preco_diaria']})";
        
        if ($conexao->query($sql)) {
            echo json_encode(['status' => 'sucesso', 'mensagem' => 'Quarto criado.', 'id' => $conexao->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao criar quarto: ' . $conexao->error]);
        }
        break;

    // --- ALTERAR (UPDATE) ---
    case 'alterar':
        $id = $dadosRecebidos['id'];
        $dados = $dadosRecebidos['dados'];
        
        $sql = "UPDATE Quartos SET
                    nome = '{$dados['nome']}',
                    descricao_pt = '{$dados['descricao_pt']}',
                    descricao_en = '{$dados['descricao_en']}',
                    capacidade = {$dados['capacidade']},
                    tem_banheiro = {$dados['tem_banheiro']},
                    preco_diaria = {$dados['preco_diaria']}
                WHERE id = $id";

        if ($conexao->query($sql)) {
            echo json_encode(['status' => 'sucesso', 'mensagem' => 'Quarto alterado.']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao alterar quarto: ' . $conexao->error]);
        }
        break;

    // --- EXCLUIR (DELETE) ---
    case 'excluir':
        $id = $dadosRecebidos['id'];

        // Lógica de Exclusão
        // 1. Checa se o quarto tem "filhos" (vagas)
        $sql_check = "SELECT id FROM Vagas WHERE fk_quarto_id = $id";
        $result_check = $conexao->query($sql_check);

        if ($result_check->num_rows > 0) {
            // Se tem vagas, não pode excluir
            http_response_code(400); // Bad Request
            echo json_encode(['status' => 'erro', 'mensagem' => 'Este quarto não pode ser excluído pois possui vagas cadastradas. Exclua as vagas primeiro.']);
            exit();
        }

        // 2. Se não tem vagas, pode excluir
        $sql_delete = "DELETE FROM Quartos WHERE id = $id";
        if ($conexao->query($sql_delete)) {
            echo json_encode(['status' => 'sucesso', 'mensagem' => 'Quarto excluído.']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao excluir quarto: ' . $conexao->error]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['status' => 'erro', 'mensagem' => 'Ação não reconhecida.']);
        break;
}
?>