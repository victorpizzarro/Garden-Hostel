<?php
/*
    Endpoint pro Admin Master gerenciar (CRUD) as Vagas
    Método: GET (pra Listar) ou POST (pra Criar, Alterar, Excluir)
    GET ?acao=listar&quarto_id=X (Lista vagas de um quarto específico)
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
        'mensagem' => 'Acesso negado. Apenas o Admin Master pode gerenciar vagas.'
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
        // É obrigatório informar de qual quarto devemos listar as vagas
        if (!isset($_GET['quarto_id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'erro', 'mensagem' => 'ID do quarto é obrigatório para listar vagas.']);
            exit();
        }
        $quarto_id = $_GET['quarto_id'];
        
        $sql = "SELECT * FROM Vagas WHERE fk_quarto_id = $quarto_id ORDER BY nome_identificador ASC";
        $resultado = $conexao->query($sql);
        $vagas = [];
        while ($linha = $resultado->fetch_assoc()) {
            $vagas[] = $linha;
        }
        echo json_encode($vagas);
        break;

    // --- CRIAR (CREATE) ---
    case 'criar':
        $dados = $dadosRecebidos['dados'];
        $sql = "INSERT INTO Vagas (fk_quarto_id, nome_identificador, descricao_peculiaridades_pt, descricao_peculiaridades_en)
                VALUES ({$dados['fk_quarto_id']}, '{$dados['nome_identificador']}', '{$dados['descricao_peculiaridades_pt']}', '{$dados['descricao_peculiaridades_en']}')";
        
        if ($conexao->query($sql)) {
            echo json_encode(['status' => 'sucesso', 'mensagem' => 'Vaga criada.', 'id' => $conexao->insert_id]);
        } else {
            // Erro caso tente criar vaga com um nome_identificador duplicado no mesmo quarto
            if ($conexao->errno == 1062) { // Chave duplicada
                echo json_encode(['status' => 'erro', 'mensagem' => 'Erro: Já existe uma vaga com este nome/identificador neste quarto.']);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao criar vaga: ' . $conexao->error]);
            }
        }
        break;

    // --- ALTERAR (UPDATE) ---
    case 'alterar':
        $id = $dadosRecebidos['id'];
        $dados = $dadosRecebidos['dados'];
        
        $sql = "UPDATE Vagas SET
                    nome_identificador = '{$dados['nome_identificador']}',
                    descricao_peculiaridades_pt = '{$dados['descricao_peculiaridades_pt']}',
                    descricao_peculiaridades_en = '{$dados['descricao_peculiaridades_en']}'
                WHERE id = $id";

        if ($conexao->query($sql)) {
            echo json_encode(['status' => 'sucesso', 'mensagem' => 'Vaga alterada.']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao alterar vaga: ' . $conexao->error]);
        }
        break;

    // --- EXCLUIR (DELETE) ---
    case 'excluir':
        $id = $dadosRecebidos['id'];

        // Lógica de Exclusão
        // 1. Checar se a vaga tem "filhos" (reservas)
        $sql_check = "SELECT id FROM Reservas_Vagas WHERE fk_vaga_id = $id";
        $result_check = $conexao->query($sql_check);

        if ($result_check->num_rows > 0) {
            // Se tem reservas, não pode excluir
            http_response_code(400); // Bad Request
            echo json_encode(['status' => 'erro', 'mensagem' => 'Esta vaga não pode ser excluída pois está vinculada a reservas (ativas ou passadas).']);
            exit();
        }

        // 2. Se não tem reservas, pode excluir
        $sql_delete = "DELETE FROM Vagas WHERE id = $id";
        if ($conexao->query($sql_delete)) {
            echo json_encode(['status' => 'sucesso', 'mensagem' => 'Vaga excluída.']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao excluir vaga: ' . $conexao->error]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['status' => 'erro', 'mensagem' => 'Ação não reconhecida.']);
        break;
}
?>