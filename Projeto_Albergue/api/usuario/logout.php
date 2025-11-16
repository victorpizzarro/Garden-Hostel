<?php
/*
    Endpoint pra encerrar a sessão do usuário
    Método: GET
    Recebe: Nada (usa a sessão)
    Retorna: JSON { "status": "sucesso" }
*/

// 1. Inclui o arquivo de configuração
require_once '../config.php';

// 2. Limpa todas as variáveis da sessão
session_unset();

// 3. Destrói a sessão
session_destroy();

// 4. Retorna uma resposta de sucesso
http_response_code(200);
echo json_encode([
    'status' => 'sucesso',
    'mensagem' => 'Logout realizado com sucesso.'
]);
?>