<?php
/*
    Configuração central da API
    Esse arquivo é incluído por todos os endpoints.
    Funções:
    1. Inicia a sessão (para $_SESSION)
    2. Define os cabeçalhos da API (JSON, CORS)
    3. Estabelece a conexão com o banco de dados
*/


error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);


session_start();



// Diz ao navegador que a resposta será sempre em formato JSON
header('Content-Type: application/json');


header('Access-Control-Allow-Origin: *');


header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');


header('Access-Control-Allow-Headers: Content-Type, Authorization');


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

//Conexão com o Banco de Dados ---


$servidor = "localhost";    
$usuario_db = "root";       
$senha_db = "";             
$banco = "albergue_db";     


$conexao = new mysqli($servidor, $usuario_db, $senha_db, $banco);


if ($conexao->connect_error) {
    
    http_response_code(500); // Erro interno do servidor
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Falha na conexão com o banco de dados: ' . $conexao->connect_error
    ]);
    exit(); 
}


$conexao->set_charset("utf8mb4");





$dadosRecebidos = json_decode(file_get_contents("php://input"), true);


if ($dadosRecebidos === null) {
    $dadosRecebidos = [];
}
?>