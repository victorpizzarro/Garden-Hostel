<?php
/*
    Endpoint pra verificar se existe uma sessão de usuário ativa
    Método: GET
    Recebe: Nada (usa a sessão)
    Retorna: JSON { "logado": true, "tipo": "...", "nome": "..." } ou { "logado": false }
*/


require_once '../config.php';


if (isset($_SESSION['usuario_id']) && isset($_SESSION['usuario_tipo'])) {
    // --- Sim, está logado ---
    http_response_code(200);
    echo json_encode([
        'logado' => true,
        'usuario_id' => $_SESSION['usuario_id'],
        'tipo_usuario' => $_SESSION['usuario_tipo'],
        'nome' => $_SESSION['usuario_nome']
    ]);
} else {
    // --- Não, não está logado ---
    http_response_code(200);
    echo json_encode([
        'logado' => false
    ]);
}
?>