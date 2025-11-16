<?php
/*
    Endpoint pra buscar uma avaliação existente com base no ID da reserva
    Método: GET
    Recebe: ?reserva_id=X
    Retorna: JSON [ { ...nota... }, { ...comentario... } ]
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Verifica se o usuário está logado (SÓ CLIENTE)
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] != 'CLIENTE') {
    http_response_code(401);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Acesso negado.']);
    exit();
}

// 3. Pega o ID da reserva
if (!isset($_GET['reserva_id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da reserva não fornecido.']);
    exit();
}
$reserva_id = $_GET['reserva_id'];

// 4. Busca a avaliação
$sql = "SELECT nota, comentario 
        FROM Avaliacoes 
        WHERE fk_reserva_id = $reserva_id 
        AND fk_cliente_id = {$_SESSION['usuario_id']}"; // Garante que ele só veja a dele

$resultado = $conexao->query($sql);

if ($resultado && $resultado->num_rows > 0) {
    $avaliacao = $resultado->fetch_assoc();
    http_response_code(200);
    echo json_encode($avaliacao);
} else {
    http_response_code(404);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Avaliação não encontrada.']);
}
?>