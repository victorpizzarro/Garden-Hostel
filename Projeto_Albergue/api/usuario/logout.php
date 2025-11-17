<?php
/*
    Endpoint pra encerrar a sessão do usuário
    Método: GET
    Recebe: Nada (usa a sessão)
    Retorna: JSON { "status": "sucesso" }
*/


require_once '../config.php';


session_unset();


session_destroy();


http_response_code(200);
echo json_encode([
    'status' => 'sucesso',
    'mensagem' => 'Logout realizado com sucesso.'
]);
?>