<?php
/*
    Endpoint pro Atendente/Admin buscar clientes
    Método: GET
    Recebe:
    ?tipo=id&valor=X
    ?tipo=cpf&valor=X
    ?tipo=nome_data&nome=X&data_nasc=AAAA-MM-DD
    Retorna: JSON [ { ...cliente... } ]
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verifica se o usuário está logado (como Atendente ou Admin)
if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] != 'ATENDENTE' && $_SESSION['usuario_tipo'] != 'ADMIN_MASTER')) {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Acesso negado. Você precisa ser um Atendente ou Admin.'
    ]);
    exit();
}

// 3. Pega o tipo de busca
$tipo_busca = isset($_GET['tipo']) ? $_GET['tipo'] : '';
$sql_base = "SELECT id, nome_completo, email, documento_numero, telefone_celular 
             FROM Usuarios 
             WHERE tipo_usuario = 'CLIENTE' AND ";
$sql_where = "";

// 4. Monta a query (SQL) baseada no tipo de busca
switch ($tipo_busca) {
    case 'id':
        $id = $_GET['valor'];
        $sql_where = "id = $id";
        break;
    
    case 'cpf':
        $cpf = $_GET['valor'];
        $sql_where = "documento_numero = '$cpf'";
        break;
        
    case 'nome_data':
        $nome = $_GET['nome'];
        $data_nasc = $_GET['data_nasc'];
        // Utilizado LIKE pra permitir buscar um cliente digitando apenas uma parte do nome dele
        $sql_where = "nome_completo LIKE '%$nome%' AND data_nascimento = '$data_nasc'";
        break;
        
    default:
        http_response_code(400); // Bad Request
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Tipo de busca inválido. Use "id", "cpf" ou "nome_data".'
        ]);
        exit();
}

// 5. Executa a busca
$sql_completo = $sql_base . $sql_where;
$resultado = $conexao->query($sql_completo);
$clientes = [];

if ($resultado->num_rows > 0) {
    while ($linha = $resultado->fetch_assoc()) {
        $clientes[] = $linha;
    }
}

// 6. Retorna os resultados (pode ser um array vazio)
http_response_code(200);
echo json_encode($clientes);
?>