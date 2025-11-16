<?php
/*
    Configuração central da API
    Esse arquivo é incluído por todos os endpoints.
    Funções:
    1. Inicia a sessão (para $_SESSION)
    2. Define os cabeçalhos da API (JSON, CORS)
    3. Estabelece a conexão com o banco de dados
*/

// --- 1. Sessão ---
// Inicia a sessão em todos os arquivos da API
session_start();

// --- 2. Cabeçalhos da API (Headers) ---

// Diz ao navegador que a resposta será sempre em formato JSON
header('Content-Type: application/json');

// Permite que o frontend acesse a API
// Sem isso, o navegador bloqueia as chamadas por segurança
header('Access-Control-Allow-Origin: *');

// Permite os métodos HTTP usados nos formulários JS
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Permite que o JS envie cabeçalhos específicos, como 'Content-Type'
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// O navegador envia um método "OPTIONS" antes de POST/PUT/DELETE
// Esse if responde OK pra essa verificação
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- 3. Conexão com o Banco de Dados ---

// Detalhes da conexão com o XAMPP
$servidor = "localhost";    // O servidor do banco
$usuario_db = "root";       // Usuário padrão do XAMPP
$senha_db = "";             // Senha padrão do XAMPP
$banco = "albergue_db";     // O nome do banco

// Tenta criar a conexão
$conexao = new mysqli($servidor, $usuario_db, $senha_db, $banco);

// Verifica se a conexão falhou
if ($conexao->connect_error) {
    // Se falhar, interrompe o script e envia um erro JSON
    http_response_code(500); // Erro interno do servidor
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Falha na conexão com o banco de dados: ' . $conexao->connect_error
    ]);
    exit(); // Para a execução
}

// Define o charset como UTF-8, pra suportar acentos
$conexao->set_charset("utf8mb4");

// --- 4. Dados de Entrada (Leitura do JSON) ---

// Todos os 'POST' e 'PUT' enviarão JSON
// Essa linha lê o JSON enviado pelo JS e transforma em um array PHP
$dadosRecebidos = json_decode(file_get_contents("php://input"), true);

// Esse if garante que $dadosRecebidos é um array, caso nenhum JSON seja enviado
if ($dadosRecebidos === null) {
    $dadosRecebidos = [];
}
?>